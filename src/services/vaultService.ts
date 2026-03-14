import JSZip from 'jszip';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

const MAGIC_HEADER = "KATM_SECURE_ARCHIVE_V1";

interface KatmDB extends DBSchema {
  archives: {
    key: string;
    value: Archive;
  };
}

let dbPromise: Promise<IDBPDatabase<KatmDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KatmDB>('katm-vault', 1, {
      upgrade(db) {
        db.createObjectStore('archives', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

// In a real application, this key would be derived from a user password using PBKDF2 or Argon2.
// For demonstration purposes, we use a hardcoded key, but the architecture supports dynamic keys.
const DEMO_KEY_MATERIAL = "katm-super-secret-key-2026";

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(DEMO_KEY_MATERIAL),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("katm-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export interface DraftAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

export interface Archive {
  id: string;
  name: string;
  timestamp: number;
  size: number;
  data: Blob;
}

export interface ArchiveFile {
  name: string;
  type: string;
  data: Blob;
}

export class VaultService {
  /**
   * Seals a collection of assets into an encrypted KATM archive and saves it to local storage.
   */
  static async sealArchive(name: string, assets: DraftAsset[]): Promise<Archive> {
    const zip = new JSZip();
    assets.forEach(asset => {
      zip.file(asset.name, asset.file);
    });
    
    const zipContent = await zip.generateAsync({ type: 'uint8array' });
    
    // Encrypt the zip content
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      zipContent
    );

    // Combine MAGIC_HEADER, IV, and Encrypted Content
    const headerBytes = new TextEncoder().encode(MAGIC_HEADER);
    const finalBlob = new Blob([headerBytes, iv, encryptedContent], { type: 'application/katm' });
    
    const archive: Archive = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.endsWith('.katm') ? name : `${name}.katm`,
      timestamp: Date.now(),
      size: finalBlob.size,
      data: finalBlob
    };

    // Save to IndexedDB
    const db = await getDB();
    await db.put('archives', archive);

    return archive;
  }

  /**
   * Retrieves all stored archives from IndexedDB.
   */
  static async getStoredArchives(): Promise<Archive[]> {
    const db = await getDB();
    return await db.getAll('archives');
  }

  /**
   * Deletes a stored archive from IndexedDB.
   */
  static async deleteStoredArchive(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('archives', id);
  }

  /**
   * Saves an external archive to IndexedDB.
   */
  static async saveExternalArchive(file: File): Promise<Archive> {
    const archive: Archive = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      timestamp: Date.now(),
      size: file.size,
      data: file
    };
    const db = await getDB();
    await db.put('archives', archive);
    return archive;
  }

  /**
   * Triggers a download of the archive blob.
   */
  static downloadArchive(archive: Archive) {
    const url = URL.createObjectURL(archive.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = archive.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens and decrypts a KATM archive, returning all files.
   */
  static async openArchive(blob: Blob): Promise<ArchiveFile[]> {
    const arrayBuffer = await blob.arrayBuffer();
    const headerBytes = new Uint8Array(arrayBuffer.slice(0, MAGIC_HEADER.length));
    const header = new TextDecoder().decode(headerBytes);
    
    if (header !== MAGIC_HEADER) {
      throw new Error("Invalid KATM Archive format.");
    }

    const iv = new Uint8Array(arrayBuffer.slice(MAGIC_HEADER.length, MAGIC_HEADER.length + 12));
    const encryptedData = arrayBuffer.slice(MAGIC_HEADER.length + 12);

    const key = await getCryptoKey();
    
    try {
      const decryptedContent = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedData
      );

      const zip = await JSZip.loadAsync(decryptedContent);
      const files: ArchiveFile[] = [];
      
      for (const [filename, fileData] of Object.entries(zip.files)) {
        if (!fileData.dir) {
          const blob = await fileData.async('blob');
          files.push({
            name: filename,
            type: blob.type || 'application/octet-stream',
            data: blob
          });
        }
      }
      
      return files;
    } catch (e) {
      console.error("Decryption failed", e);
      throw new Error("Failed to decrypt archive. It may be corrupted or the key is incorrect.");
    }
  }
}
