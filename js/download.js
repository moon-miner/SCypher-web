// download.js - Blockchain download functionality (Improved with progress bar)

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
        
        // Create enhanced status display
        createProgressDisplay();
        showProgressStatus(getTranslation('download.progress.initializing'), 'loading', 0);

        // Phase 1: Initialize connection
        await updateProgress(10, getTranslation('download.progress.connecting'));
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phase 2: Fetch fragments from blockchain
        await updateProgress(20, getTranslation('download.progress.fetching'));
        const base64Content = await fetchAllTokenDataWithProgress();

        // Phase 3: Reconstruct XZ file
        await updateProgress(85, getTranslation('download.progress.reconstructing'));
        await new Promise(resolve => setTimeout(resolve, 300));

        // Convert base64 to binary data (XZ file)
        const binaryString = atob(base64Content);
        const xzBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            xzBytes[i] = binaryString.charCodeAt(i);
        }

        // Phase 4: Prepare download
        await updateProgress(95, getTranslation('download.progress.preparing'));
        await new Promise(resolve => setTimeout(resolve, 200));

        // Create direct XZ download (no decompression)
        createXZDownload(xzBytes, 'scypher.sh.xz');

        // Phase 5: Complete
        await updateProgress(100, getTranslation('download.progress.success'));
        showProgressStatus(getTranslation('download.progress.success'), 'success', 100);

        // Update button to show completion
        downloadBtn.innerHTML = '✅ ' + getTranslation('download.progress.completed');
        
        // Reset button after success
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
            hideProgressDisplay();
        }, 4000);

    } catch (error) {
        console.error('Download error:', error);
        showProgressStatus(`❌ ${getTranslation('download.progress.error')}: ${error.message}`, 'error', 0);
        
        // Reset button on error
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
            hideProgressDisplay();
        }, 5000);
    }
}

// Create enhanced progress display
function createProgressDisplay() {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="download-progress-container">
                <div class="progress-info">
                    <div class="progress-icon">🔗</div>
                    <div class="progress-text">Initializing...</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progressBar"></div>
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

// Update progress with smooth animation
async function updateProgress(percentage, message, icon = '🔗') {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.querySelector('.progress-text');
    const progressIcon = document.querySelector('.progress-icon');

    if (progressBar && progressPercentage && progressText && progressIcon) {
        // Update text and icon
        progressText.textContent = message;
        progressIcon.textContent = icon;
        
        // Animate progress bar
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';

        // Update step dots
        updateStepDots(percentage);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Update step dots based on progress
function updateStepDots(percentage) {
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
        const stepPercentage = (index + 1) * 25;
        dot.classList.remove('active', 'completed');
        
        if (percentage >= stepPercentage) {
            dot.classList.add('completed');
        } else if (percentage >= stepPercentage - 25) {
            dot.classList.add('active');
        }
    });
}

// Enhanced fetch function with detailed progress
async function fetchAllTokenDataWithProgress() {
    const fragments = [];
    const totalFragments = TOKEN_URLS.length;
    const baseProgress = 20; // Starting progress
    const fragmentProgress = 65; // Progress range for fragments (20% to 85%)

    for (let i = 0; i < TOKEN_URLS.length; i++) {
        const fragmentNumber = i + 1;
        const currentProgress = baseProgress + (fragmentProgress * (i / totalFragments));
        
        const progressMessage = getTranslation('download.progress.fragment')
            .replace('{current}', fragmentNumber)
            .replace('{total}', totalFragments);
            
        await updateProgress(currentProgress, progressMessage, '📦');

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
            
            // Show completion for this fragment
            const completedProgress = baseProgress + (fragmentProgress * ((i + 1) / totalFragments));
            await updateProgress(completedProgress, `✅ Fragment ${fragmentNumber}/${totalFragments} completed`, '✅');
            
            // Brief pause between fragments for better UX
            if (i < TOKEN_URLS.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }

        } catch (error) {
            throw new Error(`${getTranslation('download.progress.fragmentFailed')} ${fragmentNumber}: ${error.message}`);
        }
    }

    // Show combining phase
    await updateProgress(80, getTranslation('download.progress.combining'), '🧩');
    console.log('🧩 Combining all base64 fragments...');

    // Combine all fragments
    const combinedBase64 = fragments.join('');
    
    console.log(`✅ Successfully combined ${fragments.length} fragments`);
    console.log(`📊 Total base64 length: ${combinedBase64.length} characters`);
    
    return combinedBase64;
}

// Show progress status with better formatting
function showProgressStatus(message, type = 'info', percentage = 0) {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        if (type === 'success') {
            statusElement.innerHTML = `
                <div class="download-success">
                    <div class="success-icon">🎉</div>
                    <div class="success-message">${message}</div>
                    <div class="success-details">File ready for download!</div>
                </div>
            `;
            statusElement.className = 'download-status success';
        } else if (type === 'error') {
            statusElement.innerHTML = `
                <div class="download-error">
                    <div class="error-icon">❌</div>
                    <div class="error-message">${message}</div>
                </div>
            `;
            statusElement.className = 'download-status error';
        }
        // For loading state, the progress display is already created
    }
}

// Hide progress display
function hideProgressDisplay() {
    const statusElement = document.getElementById('downloadStatus');
    if (statusElement) {
        setTimeout(() => {
            statusElement.style.display = 'none';
            statusElement.innerHTML = '';
        }, 1000);
    }
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
        'download.progress.fragment': 'Downloading fragment {current}/{total}...',
        'download.progress.combining': 'Combining base64 fragments...',
        'download.progress.reconstructing': 'Reconstructing XZ archive...',
        'download.progress.preparing': 'Preparing download...',
        'download.progress.success': 'Successfully downloaded scypher.sh.xz from blockchain!',
        'download.progress.completed': 'Download Completed',
        'download.progress.error': 'Download failed',
        'download.progress.fetchError': 'Failed to fetch fragment',
        'download.progress.noDescription': 'Fragment has no description field',
        'download.progress.fragmentFailed': 'Fragment download failed'
    };

    return fallbacks[key] || key;
}
