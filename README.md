# 🔐 Scypher Web

**Decentralized BIP39 Seed Cipher Interface**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-scypher.vercel.app-blue)](https://scypher.vercel.app/)
[![Blockchain Storage](https://img.shields.io/badge/Storage-Ergo%20Blockchain-green)](https://ergoplatform.org/)
[![Version](https://img.shields.io/badge/Version-2.0-brightgreen)](https://github.com/moon-miner/SCypher-web/releases)

A decentralized web interface for [Scypher](https://github.com/moon-miner/bash-BIP39-seed-cypher) - the XOR-based BIP39 seed phrase cipher that maintains complete BIP39 compatibility.

## 🌟 What Makes This Special

- **🔗 Blockchain Storage**: The core cipher script is permanently stored on Ergo blockchain, ensuring it can never be lost, altered, or censored
- **🎯 Zero Backend**: Pure frontend application - no servers, databases, or external dependencies
- **🌍 Decentralized Downloads**: Fetch cipher fragments directly from blockchain storage
- **🛡️ Token-Safe Donations**: Integrated Nautilus wallet donations that preserve all your tokens and NFTs
- **🌙 Dark Mode First**: Modern, accessible design with comprehensive theme system
- **🌐 Multilingual**: Support for English, Spanish, Chinese, German, and Russian

## 🚀 Live Demo

**Visit: [scypher.vercel.app](https://scypher.vercel.app/)**

The website provides:
- Interactive download system fetching from Ergo blockchain
- Comprehensive documentation and tutorials
- Secure donation system using Ergo's Nautilus wallet
- Mobile-responsive design with smooth animations

## 🏗️ Architecture Overview

### Frontend Technologies
- **Pure HTML5/CSS3/JavaScript** - No frameworks, maximum compatibility
- **Progressive Web App** features for offline functionality
- **WebCrypto API** integration for secure operations
- **Responsive Design** with mobile-first approach

### Blockchain Integration
- **Ergo Blockchain Storage**: Script fragments stored as token metadata
- **SigmaSpace API**: Reliable blockchain data retrieval
- **Decentralized Architecture**: No single points of failure
- **Verifiable Downloads**: All files reconstructed from immutable blockchain data

### Key Features

#### 🔄 Decentralized Download System
```javascript
// Fetches script fragments from Ergo blockchain
const TOKEN_URLS = [
    "https://api.sigmaspace.io/api/v1/tokens/01594be725214d...",
    // 8 fragment URLs stored on blockchain
];
```

The system:
1. Fetches 8 token fragments from Ergo blockchain
2. Reconstructs base64-encoded data
3. Rebuilds the compressed SCypherV2.sh.xz file
4. Provides secure download with integrity verification

#### 💰 Token-Safe Donation System
```javascript
// Advanced UTXO management preserves all tokens
function selectInputsAndTokens(utxos, requiredAmount) {
    // Collects ALL tokens from inputs
    // Creates proper change outputs
    // Ensures no token loss during donations
}
```

#### 🎨 Advanced Theme System
```css
:root {
    /* Dark mode by default with sophisticated color palette */
    --bg-primary: #0f1115;
    --accent-color: #7c3aed;
    /* Smooth transitions for all theme changes */
}
```

#### 🌐 Internationalization
```javascript
const translations = {
    en: { /* English translations */ },
    es: { /* Spanish translations */ },
    zh: { /* Chinese translations */ },
    de: { /* German translations */ },
    ru: { /* Russian translations */ }
};
```

## 📋 What is Scypher?

Scypher is a revolutionary cryptographic tool that:

- **Encrypts BIP39 seed phrases** into other valid BIP39 phrases
- **Uses XOR encryption** with SHAKE-256 for cryptographic security
- **Maintains BIP39 compliance** - encrypted output works in any wallet
- **Provides perfect reversibility** - same password restores original phrase
- **Requires no external dependencies** - pure Bash + OpenSSL implementation

### How It Works

```
Original Seed + Password + Iterations
            ↓
    XOR Encryption with SHAKE-256
            ↓
    Encrypted BIP39 Seed Phrase
```

**Key Innovation**: Unlike traditional encryption that produces random data, Scypher's output is always a valid BIP39 seed phrase that any cryptocurrency wallet would accept.

## 🛠️ Development Setup

### Prerequisites
- Modern web browser with ES6+ support
- Node.js 16+ (for development tools)
- Basic understanding of blockchain technology

### Local Development
```bash
# Clone the repository
git clone https://github.com/moon-miner/SCypher-web.git
cd SCypher-web

# Serve locally (Python 3)
python -m http.server 8000

# Or use Node.js
npx serve .

# Visit http://localhost:8000
```

### Project Structure
```
SCypher-web/
├── index.html              # Main application entry point
├── css/
│   └── styles.css         # Complete CSS with dark/light themes
├── js/
│   ├── main.js           # Core application logic
│   ├── download.js       # Blockchain download system
│   ├── donation.js       # Nautilus wallet integration
│   └── translations.js   # Multilingual support
├── documentation/         # Comprehensive docs
└── assets/               # Images and media
```

## 🔧 Key Components

### 1. Blockchain Download System (`download.js`)
- Fetches 8 script fragments from Ergo blockchain
- Reconstructs original compressed file
- Provides detailed download progress
- Verifies file integrity

### 2. Donation System (`donation.js`)
- Integrates with Nautilus wallet
- Preserves all tokens in user UTXOs
- Uses proper fee handling
- Provides transparent transaction building

### 3. Theme System (`main.js`)
- Dark mode by default
- Smooth theme transitions
- System preference detection
- Persistent user preferences

### 4. Internationalization (`translations.js`)
- 5 language support
- Browser language detection
- Fallback to English
- Context-aware translations

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Alternative Deployments
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Enable in repository settings
- **IPFS**: Truly decentralized hosting
- **Traditional hosting**: Upload files to any web server

## 🔒 Security Features

### Frontend Security
- **No sensitive data storage** - everything processed client-side
- **Secure random generation** using WebCrypto API
- **Memory cleanup** for sensitive operations
- **CSP headers** for XSS protection

### Blockchain Security
- **Immutable storage** on Ergo blockchain
- **Verifiable downloads** with hash checking
- **Decentralized architecture** eliminates single points of failure
- **Open source verification** of all components

### Wallet Integration Security
- **Token preservation** in all transactions
- **Proper UTXO management** prevents token loss
- **Transparent fee handling** with separate fee outputs
- **User confirmation** for all transactions

## 🎯 Browser Compatibility

### Fully Supported
- **Chrome/Chromium 80+**
- **Firefox 75+**
- **Safari 13.1+**
- **Edge 80+**

### Mobile Support
- **iOS Safari 13.4+**
- **Chrome Mobile 80+**
- **Samsung Internet 13+**
- **Firefox Mobile 79+**

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Web Crypto API (for secure operations)
- Local Storage (for preferences)

## 📚 Documentation

### User Guides
- [How Scypher Works](https://scypher.vercel.app/#how-it-works) - Understanding the encryption process
- [Download Guide](https://scypher.vercel.app/#download) - Getting Scypher from blockchain
- [Security Best Practices](https://github.com/moon-miner/bash-BIP39-seed-cypher/tree/main/documentation) - Safe usage guidelines

### Technical Documentation
- [Core Algorithm](https://github.com/moon-miner/bash-BIP39-seed-cypher) - Main Scypher repository
- [BIP39 Standard](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) - Official specification

## 🤝 Contributing

We welcome contributions! This project was developed for ErgoHack X with AI assistance.

### Ways to Contribute
- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** for future versions
- 🌐 **Add translations** for new languages
- 🔧 **Submit pull requests** for improvements
- ⭐ **Star the repository** if you find it useful

### Development Guidelines
1. **Follow existing code style** and patterns
2. **Test thoroughly** across different browsers
3. **Maintain backward compatibility** when possible
4. **Document new features** comprehensively
5. **Consider security implications** of all changes

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

**IMPORTANT SECURITY NOTICE**

This software is provided "AS IS" without warranty of any kind. The developers assume no responsibility for:

- **Loss of funds** or cryptocurrency assets
- **Incorrect usage** or user errors  
- **Security implications** in specific contexts
- **Modifications** made by third parties

### Best Practices
- ✅ **Test with small amounts** first
- ✅ **Maintain secure backups** of original seed phrases
- ✅ **Use on clean, offline systems** when possible
- ✅ **Verify script integrity** before use
- ✅ **Keep strong, unique passwords**

## 📞 Support & Community

### Get Help
- **GitHub Issues**: [Report bugs or ask questions](https://github.com/moon-miner/SCypher-web/issues)
- **Main Repository**: [Scypher Core](https://github.com/moon-miner/bash-BIP39-seed-cypher)
- **Website**: [scypher.vercel.app](https://scypher.vercel.app/)

### Links
- 🌐 **Live Demo**: [scypher.vercel.app](https://scypher.vercel.app/)
- 📦 **Core Tool**: [bash-BIP39-seed-cypher](https://github.com/moon-miner/bash-BIP39-seed-cypher)
- 🔗 **Ergo Platform**: [ergoplatform.org](https://ergoplatform.org/)
- 💻 **ErgoHack X**: Competition project showcase

## 📄 License

**MIT License** - See [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software.

---

<div align="center">

**Made with ❤️ for the cryptocurrency community**

*Empowering secure, decentralized seed phrase management*

[⭐ Star this repo](https://github.com/moon-miner/SCypher-web) • [🐛 Report bug](https://github.com/moon-miner/SCypher-web/issues) • [✨ Request feature](https://github.com/moon-miner/SCypher-web/issues)

</div>
