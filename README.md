# .tom File Encryption and Decryption

This project provides functionality to securely encrypt and decrypt `.tom` files using AES-256-CBC and RSA encryption. It transforms Base64 encoding into emoji for unique obfuscation, ensuring secure data handling.

## Features

- Encrypt text into a `.tom` file
- Decrypt `.tom` files back to text
- Uses AES-256-CBC for content encryption
- Uses RSA for key encryption
- Base64 to emoji transformation for additional obfuscation

## Screenshot

![GUI](https://i.imgur.com/DF0KDbg.png)

## Installation

1. Ensure that [Node.js](https://nodejs.org/) is installed on your machine.
2. Clone the repository:

    ```bash
    git clone https://github.com/YourUsername/tom-file-encryption-decryption.git
    ```

3. Navigate to the project directory:

    ```bash
    cd tom-file-encryption-decryption
    ```

4. Install dependencies:

    ```bash
    npm install
    ```

5. Generate RSA key pairs:

    ```bash
    npm run generate-keys
    ```

    Make sure to modify the passphrase in both `generate_keys.js` and `index.js`.

## Usage

### Production

To run the application in production:

```bash
npm start