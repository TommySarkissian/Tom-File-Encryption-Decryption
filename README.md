# .tom File Encryption and Decryption

This project provides functionality to encrypt securely and decrypt `.tom` files using AES-256-CBC and RSA encryption. It transforms Base64 encoding into emojis for unique obfuscation, ensuring secure data handling.

## Features

- **Encrypt Text**: Encrypt text into a `.tom` file.
- **Decrypt Text**: Decrypt `.tom` files back to text.
- **AES-256-CBC Encryption**: Uses AES-256-CBC for content encryption.
- **RSA Encryption**: Uses RSA for key encryption.
- **Base64 to Emoji Transformation**: Transforms Base64 encoding to emoji for additional obfuscation.

## Screenshot

![GUI](https://i.imgur.com/DF0KDbg.png)

## Installation

1. Ensure that [Node.js](https://nodejs.org/) is installed on your machine.
2. Clone the repository:

    ```bash
    git clone https://github.com/tommysarkissian/Tom-File-Encryption-Decryption.git
    ```

3. Navigate to the project directory:

    ```bash
    cd Tom-File-Encryption-Decryption
    ```

4. Install dependencies:

    ```bash
    npm install
    ```

5. Generate RSA key pairs:

    ```bash
    npm run generate-keys
    ```

    Modify the passphrase in both `generate_keys.js` and `index.js`.

## Usage

### Production

To run the application in production mode:

```bash
npm start
```

## Contributing

We welcome contributions to improve the `.tom File Encryption and Decryption` project! Please fork the repository and submit pull requests.
