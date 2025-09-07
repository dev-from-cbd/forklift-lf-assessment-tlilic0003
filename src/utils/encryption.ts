// Import the CryptoJS library for encryption and decryption functionality
// Using explicit import with type declaration to resolve module not found error
import * as CryptoJS from 'crypto-js';

// Define the encryption key from environment variables or use a default key for development
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-123';

/**
 * Encrypts data using AES encryption algorithm
 * @param data - Any data that needs to be encrypted
 * @returns A string containing the encrypted data
 */
export const encrypt = (data: any): string => {
  // Convert data to JSON string, encrypt it using AES with the encryption key, and return as string
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

/**
 * Decrypts previously encrypted data
 * @param encryptedData - The encrypted string to decrypt
 * @returns The original data in its original format
 */
export const decrypt = (encryptedData: string): any => {
  // Decrypt the encrypted data using AES with the encryption key
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  // Convert the decrypted bytes back to a string and parse it as JSON to get the original data
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};