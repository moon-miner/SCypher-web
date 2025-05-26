// download.js - Blockchain download functionality (Updated - Direct XZ delivery)

// Token URLs for Scypher script fragments
const TOKEN_URLS = [
    "https://api.sigmaspace.io/api/v1/tokens/e19e95429dc4566292ddda535129aa5e3c0b31d9139814a52e21508510a9b389",
    "https://api.sigmaspace.io/api/v1/tokens/01efc34d6752de5554d1d756b1fba3da094e41f8cf59904902ed90ec3e18ef43",
    "https://api.sigmaspace.io/api/v1/tokens/0f19789154bf43d1cb7cb9deb8e1603adc614506ae75e95b827b7b8c65dbb753",
    "https://api.sigmaspace.io/api/v1/tokens/aca4dd9bcd304e3bd32d21e477d7b3b840f7d50ebb85b7a6ab1cc483a7ebaa9a"
];

// Initialize download functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
});

// Main download handler with enhanced visual feedback
async function handleDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const originalContent = downloadBtn.innerHTML;

    try {
        // Update button state
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<div class="loading"></div> ' + getTranslation('download.progress.connecting');
        showStatus('downloadStatus', getTranslation('download.progress.initializing'), 'loading');

        // Phase 1: Fetch fragments from blockchain
        showStatus('downloadStatus', getTranslation('download.progress.fetching'), 'loading');
        const base64Content = await fetchAllTokenDataWithProgress();

        // Phase 2: Reconstruct XZ file
        showStatus('downloadStatus', getTranslation('download.progress.reconstructing'), 'loading');
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX

        // Convert base64 to binary data (XZ file)
        const binaryString = atob(base64Content);
        const xzBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            xzBytes[i] = binaryString.charCodeAt(i);
        }

        // Phase 3: Prepare download
        showStatus('downloadStatus', getTranslation('download.progress.preparing'), 'loading');
        await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for UX

        // Create direct XZ download (no decompression)
        createXZDownload(xzBytes, 'scypher.sh.xz');

        // Success message
        showStatus('downloadStatus', getTranslation('download.progress.success'), 'success');

        // Update button to show completion
        downloadBtn.innerHTML = '✅ ' + getTranslation('download.progress.completed');
        
        // Reset button after success
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
        }, 3000);

    } catch (error) {
        console.error('Download error:', error);
        showStatus('downloadStatus', `❌ ${getTranslation('download.progress.error')}: ${error.message}`, 'error');
        
        // Reset button on error
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalContent;
    }
}

// Enhanced fetch function with detailed progress
async function fetchAllTokenDataWithProgress() {
    const fragments = [];
    const totalFragments = TOKEN_URLS.length;

    for (let i = 0; i < TOKEN_URLS.length; i++) {
        const fragmentNumber = i + 1;
        const progressMessage = getTranslation('download.progress.fragment')
            .replace('{current}', fragmentNumber)
            .replace('{total}', totalFragments);
            
        showStatus('downloadStatus', `🔍 ${progressMessage}`, 'loading');

        try {
            const response = await fetch(TOKEN_URLS[i]);
            if (!response.ok) {
                throw new Error(`${getTranslation('download.progress.fetchError')} ${fragmentNumber}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.description) {
                throw new Error(`${getTranslation('download.progress.noDescription')} ${fragmentNumber}`);
            }

            fragments.push(data.description);
            
            // Show progress for each fragment
            console.log(`✅ Fragment ${fragmentNumber}/${totalFragments} fetched successfully`);
            
            // Brief pause between fragments for better UX
            if (i < TOKEN_URLS.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }

        } catch (error) {
            throw new Error(`${getTranslation('download.progress.fragmentFailed')} ${fragmentNumber}: ${error.message}`);
        }
    }

    // Show combining phase
    showStatus('downloadStatus', `🧩 ${getTranslation('download.progress.combining')}`, 'loading');
    console.log('🧩 Combining all base64 fragments...');

    // Combine all fragments
    const combinedBase64 = fragments.join('');
    
    console.log(`✅ Successfully combined ${fragments.length} fragments`);
    console.log(`📊 Total base64 length: ${combinedBase64.length} characters`);
    
    return combinedBase64;
}

// Create XZ file download directly (no decompression)
function createXZDownload(xzBytes, filename) {
    console.log('📦 Creating XZ file download...');
    console.log(`📊 XZ file size: ${xzBytes.length} bytes`);
    console.log(`📄 Filename: ${filename}`);

    // Create blob with XZ binary data
    const blob = new Blob([xzBytes], { 
        type: 'application/x-xz' // Proper MIME type for XZ files
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';

    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up blob URL
    setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log('🧹 Blob URL cleaned up');
    }, 100);

    console.log('✅ XZ file download initiated successfully');
}

// Utility function for status messages with translation support
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        // Clear previous status
        statusElement.className = `download-status ${type}`;
        statusElement.innerHTML = message;
        statusElement.style.display = 'block';

        console.log(`📢 Status (${type}):`, message);

        // Auto-hide success and error messages after delay
        if (type === 'success') {
            setTimeout(() => {
                if (statusElement) {
                    statusElement.style.display = 'none';
                }
            }, 8000);
        } else if (type === 'error') {
            setTimeout(() => {
                if (statusElement) {
                    statusElement.style.display = 'none';
                }
            }, 12000);
        }
    } else {
        console.log(`📢 Status (${type}) [${elementId}]:`, message);
    }
}

// Get translation with fallback
function getTranslation(key) {
    try {
        if (typeof window !== 'undefined' && typeof window.getTranslation === 'function') {
            return window.getTranslation(key);
        }
    } catch (e) {
        console.warn('⚠️ Translation error:', e.message);
    }

    // Fallback translations for new download messages
    const fallbacks = {
        'download.progress.connecting': 'Connecting to Ergo blockchain...',
        'download.progress.initializing': 'Initializing decentralized download...',
        'download.progress.fetching': 'Fetching script fragments from blockchain...',
        'download.progress.fragment': 'Downloading fragment {current} of {total} from blockchain...',
        'download.progress.combining': 'Combining base64 fragments...',
        'download.progress.reconstructing': 'Reconstructing XZ archive...',
        'download.progress.preparing': 'Preparing download...',
        'download.progress.success': '✅ Successfully downloaded scypher.sh.xz from blockchain!',
        'download.progress.completed': 'Download Completed',
        'download.progress.error': 'Download failed',
        'download.progress.fetchError': 'Failed to fetch fragment',
        'download.progress.noDescription': 'Fragment has no description field',
        'download.progress.fragmentFailed': 'Fragment download failed'
    };

    return fallbacks[key] || key;
}

// Alternative download method information (updated for XZ)
function provideAlternativeDownload() {
    const instructions = `# Alternative Download Method

You can download the XZ compressed script using bash:

\`\`\`bash
#!/bin/bash
# Save this as download-scypher.sh and run it

# Token URLs
urls=(
    "https://api.sigmaspace.io/api/v1/tokens/e19e95429dc4566292ddda535129aa5e3c0b31d9139814a52e21508510a9b389"
    "https://api.sigmaspace.io/api/v1/tokens/01efc34d6752de5554d1d756b1fba3da094e41f8cf59904902ed90ec3e18ef43"
    "https://api.sigmaspace.io/api/v1/tokens/0f19789154bf43d1cb7cb9deb8e1603adc614506ae75e95b827b7b8c65dbb753"
    "https://api.sigmaspace.io/api/v1/tokens/aca4dd9bcd304e3bd32d21e477d7b3b840f7d50ebb85b7a6ab1cc483a7ebaa9a"
)

echo "🔍 Fetching Scypher fragments from Ergo blockchain..."

# Download and combine fragments
> scypher_base64.txt
for i in "\${!urls[@]}"; do
    echo "📦 Fetching fragment $((i+1))/\${#urls[@]}..."
    curl -s -X GET "\${urls[i]}" | jq -r '.description' >> scypher_base64.txt
done

echo "🧩 Reconstructing XZ archive..."
# Decode base64 to create XZ file
base64 -d scypher_base64.txt > scypher.sh.xz

# Clean up
rm scypher_base64.txt

echo "✅ Download complete: scypher.sh.xz"
echo "📄 To extract: xz -d scypher.sh.xz"
\`\`\`

The downloaded file is compressed with XZ. Use \`xz -d scypher.sh.xz\` to extract it.
`;

    // Create download for the bash script
    const blob = new Blob([instructions], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download-instructions.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
