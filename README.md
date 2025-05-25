# Scypher - Decentralized BIP39 Seed Cipher

A professional website for Scypher, a decentralized BIP39 seed phrase encryption tool with code stored on the Ergo blockchain.

## Features

- 🔐 **Decentralized Storage**: Cipher code stored permanently on Ergo blockchain
- 🌍 **Multi-language Support**: English, Spanish, Chinese, German, and Russian
- 💰 **Token-Safe Donations**: Donate ERG while preserving all your tokens
- 📥 **Direct Download**: Fetch the cipher script directly from the blockchain
- 📱 **Responsive Design**: Works perfectly on all devices
- 🚀 **No Backend Required**: Everything runs client-side

## Project Structure

```
scypher-web/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── main.js         # Core functionality
│   ├── translations.js # Multi-language support
│   ├── download.js     # Blockchain download logic
│   └── donation.js     # Token-safe donation system
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Deployment to Vercel

### Prerequisites

- GitHub account
- Vercel account (free at vercel.com)
- Git installed locally

### Step-by-Step Deployment

1. **Create GitHub Repository**
   ```bash
   # Initialize git in project folder
   git init

   # Add all files
   git add .

   # Commit
   git commit -m "Initial commit - Scypher website"

   # Create repo on GitHub and add remote
   git remote add origin https://github.com/YOUR_USERNAME/scypher-web.git

   # Push to GitHub
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Other
     - Build Command: (leave empty)
     - Output Directory: (leave empty)
   - Click "Deploy"

3. **Configure Domain (Optional)**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Environment Variables

No environment variables are required for this project.

## Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/scypher-web.git
   cd scypher-web
   ```

2. Serve locally:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

### Adding New Languages

1. Add translation in `js/translations.js`:
   ```javascript
   const translations = {
       // ... existing languages
       fr: {
           hero: {
               title: "Chiffreur BIP39 Décentralisé",
               // ... add all translations
           }
       }
   };
   ```

2. Add language option in `index.html`:
   ```html
   <option value="fr">FR</option>
   ```

## Technical Details

### Blockchain Download

The download functionality fetches script fragments from the Ergo blockchain:
- Retrieves token descriptions from 4 specific tokens
- Combines base64-encoded fragments
- Decodes and delivers the original script

### Token-Safe Donations

The donation system ensures user tokens are preserved:
- Builds transactions that separate ERG from tokens
- Returns all tokens to the user's wallet
- Only sends ERG to the donation address

## Security

- No private keys are ever handled by the website
- All wallet interactions go through Nautilus Wallet
- No data is sent to any servers
- Everything runs client-side in the browser

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Troubleshooting

### Nautilus Wallet not detected
- Ensure Nautilus extension is installed
- Refresh the page after installation
- Check that the extension is enabled

### Download issues
- Check your internet connection
- Ensure the Ergo blockchain API is accessible
- Try again later if the API is down

### Donation issues
- Ensure you have enough ERG for the donation + fees
- Check that Nautilus is unlocked
- Verify you're on the correct network

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Links

- Scypher Repository: [GitHub - PLACEHOLDER]
- Website Repository: [GitHub - PLACEHOLDER]
- Ergo Blockchain: [ergoplatform.org](https://ergoplatform.org)
- Nautilus Wallet: [Chrome Web Store](https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjcchai)

## Contact

- Discord: [PLACEHOLDER]
- Telegram: [PLACEHOLDER]
- GitHub Issues: [PLACEHOLDER]

---

Built with ❤️ for the Ergo community
