// download.js - Updated version with SCypherV2.xz filename

// Token URLs for Scypher script fragments
const TOKEN_URLS = [
    "https://api.sigmaspace.io/api/v1/tokens/2441e82d669db1ec65af092db175d91872ebfdd9a7865893254de863f30e62d8",
    "https://api.sigmaspace.io/api/v1/tokens/2d0d020b4f2669938c436fb4f30de703774faae20e0af7d77bf452ab330eaf9b",
    "https://api.sigmaspace.io/api/v1/tokens/55a364c8ab60444430d8a9bd88fcadf6231a72c8c8b92c3cb091c6497e0da85a",
    "https://api.sigmaspace.io/api/v1/tokens/3bc76d50309ad65cfb10be3bd288069c1eefc93465d65afcd8e5af7a99c5d9ce",
    "https://api.sigmaspace.io/api/v1/tokens/7ff624b7747e1dbd2dae1967d81c77eb5bd39671a581faf8ea923b27a6ce7776",
    "https://api.sigmaspace.io/api/v1/tokens/de7cca77a29aa84efdf873df47a74e4a667d419be735c7bfc0208619ce73c3e2",
    "https://api.sigmaspace.io/api/v1/tokens/7edcf227b14484a85b3e6bc33a56de4bab845590a8bdd474c1c9d3a83a4ce2bb",
    "https://api.sigmaspace.io/api/v1/tokens/494e97b1b2d54729b35174533edc04336efb314d6d05a2985225524a3468c1fd"
];

// Initialize download functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
});

// Main download handler - Clean version without crazy animations
async function handleDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const originalContent = downloadBtn.innerHTML;

    try {
        // Update button state - Simple emoji instead of spinner
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '⏳ Downloading...';

        // Create clean status display
        createProgressDisplay();
        showProgress(5, '🔗', 'Connecting to Ergo blockchain...');
        await sleep(300);

        // Fetch fragments
        showProgress(15, '📦', 'Fetching fragments from blockchain...');
        const base64Content = await fetchAllTokenData();

        // Reconstruct file
        showProgress(85, '🔧', 'Reconstructing XZ archive...');
        await sleep(200);

        const binaryString = atob(base64Content);
        const xzBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            xzBytes[i] = binaryString.charCodeAt(i);
        }

        // Prepare download
        showProgress(95, '📁', 'Preparing file download...');
        await sleep(200);

        // Create download with NEW filename: SCypherV2.sh.xz
        createXZDownload(xzBytes, 'SCypherV2.sh.xz');

        // Complete
        showProgress(100, '✅', 'Download completed successfully!');
        showSuccess('SCypherV2.sh.xz downloaded from blockchain!');

        // Reset button
        downloadBtn.innerHTML = '✅ Download Complete';
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
            hideProgress();
        }, 3000);

    } catch (error) {
        console.error('Download error:', error);
        showError(`Download failed: ${error.message}`);

        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
            hideProgress();
        }, 4000);
    }
}

// Create simple progress display
function createProgressDisplay() {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="download-progress-container">
                <div class="progress-info">
                    <div class="progress-icon">🔗</div>
                    <div class="progress-text">Starting download...</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                    <div class="progress-percentage" id="progressPercentage">0%</div>
                </div>
                <div class="progress-steps">
                    <div class="step-dot" data-step="1"></div>
                    <div class="step-dot" data-step="2"></div>
                    <div class="step-dot" data-step="3"></div>
                    <div class="step-dot" data-step="4"></div>
                </div>
            </div>
        `;
        statusElement.className = 'download-status loading';
        statusElement.style.display = 'block';
    }
}

// Simple progress update
function showProgress(percentage, icon, message) {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.querySelector('.progress-text');
    const progressIcon = document.querySelector('.progress-icon');

    if (progressBar && progressPercentage && progressText && progressIcon) {
        progressText.textContent = message;
        progressIcon.textContent = icon;
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';

        // Update step dots
        updateSteps(percentage);
    }
}

// Update step indicators
function updateSteps(percentage) {
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
        const stepPercentage = (index + 1) * 25;
        dot.classList.remove('active', 'completed');

        if (percentage >= stepPercentage) {
            dot.classList.add('completed');
        } else if (percentage > stepPercentage - 25) {
            dot.classList.add('active');
        }
    });
}

// Fetch fragments with clean progress
async function fetchAllTokenData() {
    const fragments = [];
    const totalFragments = TOKEN_URLS.length;

    for (let i = 0; i < TOKEN_URLS.length; i++) {
        const fragmentNumber = i + 1;
        const progressPercent = 15 + (65 * (i / totalFragments));

        showProgress(
            Math.round(progressPercent),
            '📦',
            `Downloading fragment ${fragmentNumber} of ${totalFragments}...`
        );

        try {
            const response = await fetch(TOKEN_URLS[i]);
            if (!response.ok) {
                throw new Error(`Fragment ${fragmentNumber} failed: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.description) {
                throw new Error(`Fragment ${fragmentNumber} has no data`);
            }

            fragments.push(data.description);

            // Show completion for this fragment
            const completedPercent = 15 + (65 * ((i + 1) / totalFragments));
            showProgress(
                Math.round(completedPercent),
                '✅',
                `Fragment ${fragmentNumber}/${totalFragments} completed`
            );

            await sleep(100); // Brief pause

        } catch (error) {
            throw new Error(`Fragment ${fragmentNumber} error: ${error.message}`);
        }
    }

    // Combining phase
    showProgress(80, '🔧', 'Combining fragments...');
    await sleep(200);

    return fragments.join('');
}

// Show success state
function showSuccess(message) {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="download-success">
                <div class="success-icon">🎉</div>
                <div class="success-message">${message}</div>
                <div class="success-details">File is ready in your downloads folder</div>
            </div>
        `;
        statusElement.className = 'download-status success';
    }
}

// Show error state
function showError(message) {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="download-error">
                <div class="error-icon">❌</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        statusElement.className = 'download-status error';
    }
}

// Hide progress
function hideProgress() {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 1000);
    }
}

// Create XZ download with NEW filename
function createXZDownload(xzBytes, filename) {
    const blob = new Blob([xzBytes], { type: 'application/x-xz' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Simple sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
