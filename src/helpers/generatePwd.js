module.exports = (length, includeUpperCase, includeNumbers, includeSymbols) => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';
  
    let chars = lowercaseChars;
    if (includeUpperCase) chars += uppercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
  
    let password = '';
    const charsLength = chars.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsLength);
      password += chars[randomIndex];
    }
  
    return password;
  }
