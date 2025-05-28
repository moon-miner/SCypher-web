// download.js - Updated version with SCypherV2.xz filename

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

        // Create download with NEW filename: SCypherV2.xz
        createXZDownload(xzBytes, 'SCypherV2.xz');

        // Complete
        showProgress(100, '✅', 'Download completed successfully!');
        showSuccess('SCypherV2.xz downloaded from blockchain!');

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
