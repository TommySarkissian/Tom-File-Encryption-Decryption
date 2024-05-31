const crypto = require('crypto');
const fs = require('fs');

// Generate RSA key pair with specified options
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // The length of the key in bits
  publicKeyEncoding: {
    type: 'spki', // Public key encoding type
    format: 'pem', // Format of the public key
  },
  privateKeyEncoding: {
    type: 'pkcs8', // Private key encoding type
    format: 'pem', // Format of the private key
    cipher: 'aes-256-cbc', // Cipher used to encrypt the private key
    passphrase: 'your-secure-passphrase', // Passphrase to protect the private key (should be the same as the one in index.js)
  },
});

// Save the generated public key to a file
fs.writeFileSync('publicKey.pem', publicKey);

// Save the generated private key to a file
fs.writeFileSync('privateKey.pem', privateKey);

console.log('RSA key pair generated and saved to files.');
