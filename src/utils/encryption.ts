// Import CryptoJS library for encryption/decryption operations
import CryptoJS from 'crypto-js';

// Define encryption key from environment variables or use a default fallback
// Note: Using environment variables is more secure than hardcoded keys
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-123';

// Function to encrypt any data object
// Takes any data type as input and returns encrypted string
// Uses AES encryption algorithm with the defined key
// Data is first stringified to JSON before encryption
export const encrypt = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// Function to decrypt encrypted data back to original format
// Takes encrypted string as input and returns original data
// Uses same AES algorithm and key for decryption
// Converts decrypted bytes to UTF-8 string and parses back to JSON
export const decrypt = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};