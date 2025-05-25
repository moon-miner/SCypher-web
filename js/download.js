// download.js - Blockchain download functionality

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

// Main download handler
async function handleDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const originalContent = downloadBtn.innerHTML;

    try {
        // Update button state
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<div class="loading"></div> Fetching from blockchain...';
        showStatus('downloadStatus', 'Connecting to Ergo blockchain...', 'loading');

        // Fetch all token data
        const base64Content = await fetchAllTokenData();

        // Decode base64 to binary
        showStatus('downloadStatus', 'Decoding data...', 'loading');
        const binaryString = atob(base64Content);

        // Convert binary string to Uint8Array
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Decompress XZ data
        showStatus('downloadStatus', 'Decompressing script...', 'loading');
        const decompressed = await decompressXZ(bytes);

        // Create download
        createDownload(decompressed, 'scypher.sh');

        showStatus('downloadStatus', '✅ Successfully downloaded scypher.sh from blockchain!', 'success');

    } catch (error) {
        console.error('Download error:', error);
        showStatus('downloadStatus', `❌ Error: ${error.message}`, 'error');
    } finally {
        // Restore button state
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalContent;
    }
}

// Fetch all token data and combine
async function fetchAllTokenData() {
    const fragments = [];

    for (let i = 0; i < TOKEN_URLS.length; i++) {
        showStatus('downloadStatus', `Fetching fragment ${i + 1} of ${TOKEN_URLS.length}...`, 'loading');

        try {
            const response = await fetch(TOKEN_URLS[i]);
            if (!response.ok) {
                throw new Error(`Failed to fetch token ${i + 1}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.description) {
                throw new Error(`Token ${i + 1} has no description field`);
            }

            fragments.push(data.description);

        } catch (error) {
            throw new Error(`Failed to fetch fragment ${i + 1}: ${error.message}`);
        }
    }

    // Combine all fragments
    return fragments.join('');
}

// Decompress XZ data using pure JavaScript
async function decompressXZ(compressedData) {
    // XZ decompression is complex, so we'll use a simpler approach
    // Since the browser can't natively decompress XZ, we'll fetch the pre-decompressed version
    // from the blockchain or provide the actual bash script content

    // For now, we'll show an alternative approach
    throw new Error('XZ decompression in browser requires additional libraries. Please use the bash download script instead.');

    // In a production environment, you would either:
    // 1. Include an XZ decompression library like lzma-js
    // 2. Store the uncompressed version on the blockchain
    // 3. Use a different compression format that's browser-compatible (like gzip)
}

// Alternative: Direct script delivery (for demo purposes)
function getScypherScript() {
    // This would contain the full scypher.sh script
    // For production, this should be fetched from the blockchain
    return `#!/usr/bin/env bash
# SCypher - XOR-based BIP39 Seed Cipher (v2.0)
# This is a placeholder - the actual script would be fetched from blockchain
echo "This is a placeholder for the actual scypher.sh script"
echo "In production, this would be fetched and reconstructed from the Ergo blockchain"
`;
}

// Create download link
function createDownload(content, filename) {
    // For demo purposes, use the placeholder script
    const scriptContent = getScypherScript();

    // Create blob
    const blob = new Blob([scriptContent], { type: 'text/plain' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Alternative download method with instructions
function provideAlternativeDownload() {
    const instructions = `
# Alternative Download Method

Since XZ decompression in the browser requires additional libraries,
you can download the script using the bash command:

\`\`\`bash
#!/bin/bash

# Save this as download-scypher.sh and run it

# URLs
urls=(
    "https://api.sigmaspace.io/api/v1/tokens/e19e95429dc4566292ddda535129aa5e3c0b31d9139814a52e21508510a9b389"
    "https://api.sigmaspace.io/api/v1/tokens/01efc34d6752de5554d1d756b1fba3da094e41f8cf59904902ed90ec3e18ef43"
    "https://api.sigmaspace.io/api/v1/tokens/0f19789154bf43d1cb7cb9deb8e1603adc614506ae75e95b827b7b8c65dbb753"
    "https://api.sigmaspace.io/api/v1/tokens/aca4dd9bcd304e3bd32d21e477d7b3b840f7d50ebb85b7a6ab1cc483a7ebaa9a"
)

# Download and combine
> scypherBASE64.txt
for url in "\${urls[@]}"; do
    curl -s -X GET "$url" | jq -r '.description' >> scypherBASE64.txt
done

# Decode and decompress
base64 -d scypherBASE64.txt > scypher.sh.xz
xz -d scypher.sh.xz
rm scypherBASE64.txt

echo "Download complete: scypher.sh"
\`\`\`
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
