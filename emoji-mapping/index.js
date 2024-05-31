// Base64 characters used for encoding
const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Emojis used for encoding Base64 characters
const emojiMap = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "🍆", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
    "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
    "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
    "🤧", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟",
    "🙁", "😮", "😯", "😲"
];

// Create maps for Base64 to Emoji and Emoji to Base64 conversions
const base64ToEmojiMap = {}; // Mapping from Base64 characters to Emojis
const emojiToBase64Map = {}; // Mapping from Emojis to Base64 characters

// Populate the maps with corresponding values
for (let i = 0; i < base64Chars.length; i++) {
    base64ToEmojiMap[base64Chars[i]] = emojiMap[i]; // Map each Base64 character to an Emoji
    emojiToBase64Map[emojiMap[i]] = base64Chars[i]; // Map each Emoji to a Base64 character
}

// Function to convert a Base64 string to an Emoji string
function base64ToEmoji(base64String) {
    // Convert each character in the Base64 string to its corresponding Emoji
    return Array.from(base64String).map(char => base64ToEmojiMap[char]).join('');
}

// Function to convert an Emoji string to a Base64 string
function emojiToBase64(emojiString) {
    // Convert each Emoji in the string to its corresponding Base64 character
    return Array.from(emojiString).map(char => emojiToBase64Map[char]).join('');
}

// Export the conversion functions for use in other modules
module.exports = { base64ToEmoji, emojiToBase64 };
