const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { base64ToEmoji, emojiToBase64 } = require('./emoji-mapping'); // Adjust the path if necessary

const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(express.static('public'));

// Hard code the passphrase (should be the same as the one you used for the private key in generate_keys.js)
const passphrase = 'your-secure-passphrase';

// Read the keys from the files (you can generate new keys by running "npm run generate-keys")
const publicKey = fs.readFileSync('publicKey.pem', 'utf8');
const privateKey = fs.readFileSync('privateKey.pem', 'utf8');

// Function to generate a random AES key
function generateAESKey() {
    return crypto.randomBytes(32); // AES-256 key length is 32 bytes
}

// Function to encrypt text using AES-256-CBC with proper padding
function encryptWithAES(text, aesKey) {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv); // Create a cipher object using the AES key and IV
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64'); // Finalize the encryption
    return { iv: iv.toString('base64'), encryptedData: encrypted };
}

// Function to encrypt AES key with RSA public key
function encryptAESKeyWithRSA(aesKey) {
    return crypto.publicEncrypt(publicKey, aesKey).toString('base64'); // Encrypt the AES key with the public key
}

// Function to add HMAC for integrity check
function addHMAC(data, aesKey) {
    const hmac = crypto.createHmac('sha256', aesKey);
    hmac.update(data);
    return hmac.digest('base64'); // Return the HMAC
}

// Function to generate encrypted content
function generateEncryptedContent(content) {
    const aesKey = generateAESKey(); // Generate a random AES key
    const encryptedContent = encryptWithAES(content, aesKey); // Encrypt the content with the AES key
    const hmac = addHMAC(JSON.stringify(encryptedContent), aesKey); // Add HMAC for integrity check
    const encryptedAESKey = encryptAESKeyWithRSA(aesKey); // Encrypt the AES key with the RSA public key

    // Prepare the data to be saved (encrypted AES key, encrypted content, and HMAC)
    const dataToSave = {
        encryptedAESKey: encryptedAESKey,
        ...encryptedContent,
        hmac: hmac
    };

    // Save the data to the file in JSON format and encode it in Base64
    const base64Data = Buffer.from(JSON.stringify(dataToSave)).toString('base64');
    const emojiData = base64ToEmoji(base64Data); // Convert Base64 data to emoji representation
    return emojiData;
}

// Function to decrypt text using AES-256-CBC with proper padding handling
function decryptWithAES(encryptedContent, aesKey) {
    const iv = Buffer.from(encryptedContent.iv, 'base64'); // Convert the IV from base64 to a buffer
    const encryptedText = Buffer.from(encryptedContent.encryptedData, 'base64'); // Convert the encrypted data from base64 to a buffer
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv); // Create a decipher object using the AES key and IV
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8'); // Decrypt the data
    return decrypted;
}

// Function to decrypt AES key with RSA private key
function decryptAESKeyWithRSA(encryptedAESKey) {
    return crypto.privateDecrypt(
        {
            key: privateKey,
            passphrase: passphrase,
        },
        Buffer.from(encryptedAESKey, 'base64')
    );
}

// Function to verify HMAC
function verifyHMAC(data, aesKey, hmac) {
    const computedHmac = addHMAC(data, aesKey); // Compute HMAC of the data
    return computedHmac === hmac; // Compare with provided HMAC
}

// Route for creating encrypted content
app.post('/create', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' }); // Return error if text is missing
    }

    const encryptedData = generateEncryptedContent(text); // Generate encrypted content
    res.json({ encryptedData }); // Return encrypted data
});

// Route for decrypting content
app.post('/decrypt', (req, res) => {
    const { emojiData } = req.body;
    if (!emojiData) {
        return res.status(400).json({ error: 'Encrypted data is required' }); // Return error if encrypted data is missing
    }

    try {
        const base64Content = emojiToBase64(emojiData); // Convert emoji string back to base64 string
        const decodedContent = Buffer.from(base64Content, 'base64').toString('utf8'); // Decode the Base64 content
        const encryptedContent = JSON.parse(decodedContent); // Parse the JSON content

        const aesKey = decryptAESKeyWithRSA(encryptedContent.encryptedAESKey); // Decrypt the AES key with the RSA private key

        // Verify the HMAC
        if (!verifyHMAC(JSON.stringify({
            iv: encryptedContent.iv,
            encryptedData: encryptedContent.encryptedData
        }), aesKey, encryptedContent.hmac)) {
            return res.status(400).json({ error: 'Data integrity check failed' }); // Return error if HMAC verification fails
        }

        const decryptedData = decryptWithAES(encryptedContent, aesKey); // Decrypt the content with the decrypted AES key
        res.json({ decryptedData }); // Return decrypted data
    } catch (error) {
        console.error('Error decrypting data:', error);
        res.status(500).json({ error: 'Error decrypting data: ' + error.message }); // Return error if decryption fails
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});