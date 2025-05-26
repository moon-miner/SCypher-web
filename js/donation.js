// donation.js - Token-safe donation functionality using Nautilus Wallet - FIXED VERSION

// Configuration - UPDATED ADDRESS
const DONATION_ADDRESS = "9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY";
const NANOERGS_PER_ERG = 1000000000n;

// State
let isWalletConnected = false;
let selectedAmount = 0;
let ergoApi = null;
let nautilusConnector = null;

// Initialize donation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDonation();
});

// Initialize all donation components
async function initializeDonation() {
    console.log('🚀 Initializing donation system...');

    // Setup amount selection
    setupAmountSelection();

    // Setup wallet connection
    setupWalletConnection();

    // Check for Nautilus
    await checkNautilusAvailability();
}

// Setup amount selection buttons
function setupAmountSelection() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            amountBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Set amount
            selectedAmount = parseFloat(this.getAttribute('data-amount'));
            if (customAmount) {
                customAmount.value = selectedAmount;
            }

            console.log('Selected amount:', selectedAmount, 'ERG');
        });
    });

    // Custom amount input
    if (customAmount) {
        customAmount.addEventListener('input', function() {
            selectedAmount = parseFloat(this.value) || 0;

            // Update button states
            amountBtns.forEach(btn => {
                const btnAmount = parseFloat(btn.getAttribute('data-amount'));
                btn.classList.toggle('active', btnAmount === selectedAmount);
            });

            console.log('Custom amount:', selectedAmount, 'ERG');
        });
    }
}

// Setup wallet connection button
function setupWalletConnection() {
    const connectBtn = document.getElementById('connectWalletBtn');
    const donateBtn = document.getElementById('donateBtn');

    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }

    if (donateBtn) {
        donateBtn.addEventListener('click', makeDonation);
    }
}

// Check if Nautilus is available - FIXED VERSION
async function checkNautilusAvailability() {
    const statusElement = document.getElementById('walletStatus');
    const statusText = document.querySelector('.wallet-status .status-text');
    const connectBtn = document.getElementById('connectWalletBtn');

    console.log('🔍 Checking for Nautilus...');

    // Wait for Nautilus to be injected
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max

        const checkNautilus = () => {
            attempts++;
            console.log(`Attempt ${attempts}: Checking for ergoConnector...`);

            // Check for the correct Nautilus injection
            if (typeof window.ergoConnector !== 'undefined' &&
                window.ergoConnector &&
                typeof window.ergoConnector.nautilus !== 'undefined') {

                console.log('✅ Nautilus found!');
                nautilusConnector = window.ergoConnector.nautilus;

                if (statusText) {
                    statusText.textContent = getTranslation('donate.walletReady') || 'Nautilus Wallet detected - Ready to connect';
                }
                if (connectBtn) {
                    connectBtn.disabled = false;
                    connectBtn.textContent = getTranslation('donate.connectBtn') || 'Connect Nautilus Wallet';
                }
                if (statusElement) {
                    statusElement.classList.remove('error');
                }

                resolve(true);
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(checkNautilus, 100);
            } else {
                console.log('❌ Nautilus not found after maximum attempts');

                if (statusText) {
                    statusText.textContent = 'Nautilus Wallet not found. Please install it.';
                }
                if (connectBtn) {
                    connectBtn.textContent = 'Install Nautilus Wallet';
                    connectBtn.disabled = false;
                    connectBtn.onclick = () => {
                        window.open('https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjcchai', '_blank');
                    };
                }
                if (statusElement) {
                    statusElement.classList.add('error');
                }

                resolve(false);
            }
        };

        checkNautilus();
    });
}

// Connect to Nautilus Wallet - FIXED VERSION
async function connectWallet() {
    const connectBtn = document.getElementById('connectWalletBtn');
    const originalText = connectBtn.textContent;

    try {
        console.log('🔌 Connecting to Nautilus...');

        connectBtn.disabled = true;
        connectBtn.innerHTML = '<div class="loading"></div> Connecting...';
        showStatus('donationStatus', 'Connecting to Nautilus Wallet...', 'info');

        if (!nautilusConnector) {
            throw new Error('Nautilus connector not available');
        }

        // Request connection - FIXED: Use the correct method
        const connectionResult = await nautilusConnector.connect();
        console.log('Connection result:', connectionResult);

        if (connectionResult === true) {
            // Get API context - FIXED: Use window.ergo directly
            ergoApi = window.ergo;
            if (!ergoApi) {
                throw new Error('Ergo API context not available');
            }

            console.log('✅ API context obtained');

            // Get wallet info
            const balance = await ergoApi.get_balance();
            const balanceERG = Number(BigInt(balance) / NANOERGS_PER_ERG);

            console.log('Wallet balance:', balanceERG, 'ERG');

            // Update UI
            isWalletConnected = true;
            const statusElement = document.getElementById('walletStatus');
            const statusText = document.querySelector('.wallet-status .status-text');

            if (statusElement) statusElement.classList.add('connected');
            if (statusText) {
                statusText.textContent = `Connected - Balance: ${balanceERG.toFixed(3)} ERG`;
            }

            connectBtn.textContent = '✓ Wallet Connected';
            connectBtn.disabled = true;

            const donateBtn = document.getElementById('donateBtn');
            if (donateBtn) donateBtn.disabled = false;

            showStatus('donationStatus', 'Wallet connected successfully! You can now make a donation.', 'success');

        } else {
            throw new Error('Connection rejected by user');
        }

    } catch (error) {
        console.error('❌ Wallet connection error:', error);
        showStatus('donationStatus', `Connection failed: ${error.message}`, 'error');

        connectBtn.disabled = false;
        connectBtn.textContent = originalText;
    }
}

// Make token-safe donation - COMPLETELY REWRITTEN
async function makeDonation() {
    if (!isWalletConnected || !ergoApi) {
        showStatus('donationStatus', 'Please connect your wallet first', 'error');
        return;
    }

    const amount = selectedAmount || parseFloat(document.getElementById('customAmount')?.value || 0);
    if (!amount || amount <= 0) {
        showStatus('donationStatus', 'Please enter a valid donation amount', 'error');
        return;
    }

    const donateBtn = document.getElementById('donateBtn');
    const originalText = donateBtn.innerHTML;

    try {
        console.log('🚀 === STARTING TOKEN-SAFE DONATION ===');
        console.log('💰 Donation amount:', amount, 'ERG');

        donateBtn.disabled = true;
        donateBtn.innerHTML = '<div class="loading"></div> Building secure transaction...';
        showStatus('donationStatus', '⚡ Building transaction that preserves all tokens...', 'info');

        // Get basic parameters
        const currentHeight = await ergoApi.get_current_height();
        const changeAddress = await ergoApi.get_change_address();

        console.log('📊 Current height:', currentHeight);
        console.log('🏠 Change address:', changeAddress);

        // Calculate amounts in nanoERGs
        const donationNanoERGs = BigInt(Math.floor(amount * 1000000000));
        const feeNanoERGs = 1000000n; // 0.001 ERG
        const totalNeededNanoERGs = donationNanoERGs + feeNanoERGs;

        console.log('💵 Amounts calculated:');
        console.log('  - Donation:', donationNanoERGs.toString(), 'nanoERG');
        console.log('  - Fee:', feeNanoERGs.toString(), 'nanoERG');
        console.log('  - Total needed:', totalNeededNanoERGs.toString(), 'nanoERG');

        // Get UTXOs
        const availableUtxos = await ergoApi.get_utxos();
        if (!availableUtxos || availableUtxos.length === 0) {
            throw new Error('No UTXOs available in your wallet');
        }

        console.log('📦 Available UTXOs:', availableUtxos.length);

        // Select UTXOs and collect tokens
        let selectedUtxos = [];
        let totalInputValue = 0n;
        const tokenRegistry = new Map(); // tokenId -> total amount

        for (const utxo of availableUtxos) {
            selectedUtxos.push(utxo);
            totalInputValue += BigInt(utxo.value);

            // Collect tokens from this UTXO
            if (utxo.assets && Array.isArray(utxo.assets)) {
                for (const token of utxo.assets) {
                    const existingAmount = tokenRegistry.get(token.tokenId) || 0n;
                    tokenRegistry.set(token.tokenId, existingAmount + BigInt(token.amount));
                }
            }

            // Stop when we have enough ERG
            if (totalInputValue >= totalNeededNanoERGs) {
                break;
            }
        }

        if (totalInputValue < totalNeededNanoERGs) {
            const needed = Number(totalNeededNanoERGs) / 1000000000;
            const available = Number(totalInputValue) / 1000000000;
            throw new Error(`Insufficient funds. Need ${needed} ERG but only have ${available} ERG available`);
        }

        console.log('🔍 Input analysis:');
        console.log('  - UTXOs selected:', selectedUtxos.length);
        console.log('  - Total ERG:', Number(totalInputValue) / 1000000000);
        console.log('  - Token types:', tokenRegistry.size);
        console.log('  - Token list:', Array.from(tokenRegistry.entries()).map(([id, amt]) =>
            `${id.substring(0, 8)}... (${amt.toString()})`
        ));

        // Build outputs
        const outputs = [];

        // Get ErgoTree for donation address
        const donationErgoTree = await ergoApi.get_utxos_by_address(DONATION_ADDRESS)
            .then(() => "0008cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d")
            .catch(() => "0008cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d"); // Fallback ErgoTree

        // Output 1: Donation (ERG only, NO tokens)
        outputs.push({
            value: donationNanoERGs.toString(),
            ergoTree: donationErgoTree, // Correct ErgoTree for donation address
            assets: [], // CRITICAL: No tokens in donation!
            additionalRegisters: {},
            creationHeight: currentHeight
        });

        console.log('✅ Donation output created: ERG only, no tokens');

        // Output 2: Change (remaining ERG + ALL tokens)
        const changeValue = totalInputValue - donationNanoERGs - feeNanoERGs;

        if (changeValue > 0n || tokenRegistry.size > 0) {
            // CRITICAL: Use ErgoTree from first input to ensure tokens return correctly
            const changeErgoTree = selectedUtxos[0].ergoTree;

            // Convert token registry to output format
            const tokensForChange = Array.from(tokenRegistry.entries()).map(([tokenId, amount]) => ({
                tokenId: tokenId,
                amount: amount.toString()
            }));

            // Ensure minimum value for boxes with tokens
            const finalChangeValue = changeValue > 0n ? changeValue : 1000000n; // Min 0.001 ERG

            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: changeErgoTree, // SAME ERGOTREE AS INPUTS!
                assets: tokensForChange, // ALL TOKENS HERE!
                additionalRegisters: {},
                creationHeight: currentHeight
            });

            console.log('✅ Change output created:');
            console.log('  - ERG:', Number(finalChangeValue) / 1000000000);
            console.log('  - Tokens:', tokensForChange.length);
            console.log('  - ErgoTree match:', changeErgoTree === selectedUtxos[0].ergoTree ? 'YES' : 'NO');
        }

        // Build final transaction
        const unsignedTransaction = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };

        console.log('📝 Transaction built:');
        console.log('  - Inputs:', selectedUtxos.length);
        console.log('  - Outputs:', outputs.length);
        console.log('  - Tokens preserved:', tokenRegistry.size);

        showStatus('donationStatus', `🛡️ Transaction ready - ${tokenRegistry.size} token types preserved. Please confirm in Nautilus.`, 'info');

        // Sign transaction
        console.log('✍️ Requesting signature...');
        const signedTransaction = await ergoApi.sign_tx(unsignedTransaction);
        console.log('✅ Transaction signed successfully');

        // Submit transaction
        showStatus('donationStatus', '📡 Submitting transaction to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(signedTransaction);

        console.log('🎉 DONATION COMPLETED!');
        console.log('  - Transaction ID:', txId);
        console.log('  - Amount donated:', amount, 'ERG');
        console.log('  - Tokens preserved:', tokenRegistry.size);

        showStatus('donationStatus',
            `🎉 Donation successful! ${amount} ERG donated, ${tokenRegistry.size} token types preserved. TX: ${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`,
            'success'
        );

        // Reset form
        selectedAmount = 0;
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) customAmountInput.value = '';
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));

    } catch (error) {
        console.error('❌ DONATION ERROR:', error);
        showStatus('donationStatus', `❌ Transaction failed: ${error.message}`, 'error');
    } finally {
        donateBtn.disabled = false;
        donateBtn.innerHTML = originalText;
    }
}

// Utility function to show status messages (if not already defined)
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.innerHTML = `<div class="donation-status ${type}">${message}</div>`;
        statusElement.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 10000);
        }
    } else {
        console.log(`Status (${type}):`, message);
    }
}

// Utility function to get translations (fallback if not available)
function getTranslation(key) {
    // Verificar si las traducciones están disponibles
    if (typeof window === 'undefined' || !window.translations) {
        console.warn('⚠️ Translations not available, using fallback for:', key);
        return getFallbackTranslation(key);
    }

    // Obtener idioma actual
    const currentLang = localStorage.getItem('scypher-lang') || 'en';

    // Verificar si el idioma existe
    if (!window.translations[currentLang]) {
        console.warn('⚠️ Language not found:', currentLang, 'using English');
        return getTranslationForLang(key, 'en');
    }

    return getTranslationForLang(key, currentLang);
}

// Función auxiliar para obtener traducción de un idioma específico
function getTranslationForLang(keyPath, lang) {
    if (!window.translations || !window.translations[lang]) {
        return getFallbackTranslation(keyPath);
    }

    const keys = keyPath.split('.');
    let value = window.translations[lang];

    for (const key of keys) {
        if (value && typeof value === 'object' && value[key]) {
            value = value[key];
        } else {
            // Si no se encuentra en el idioma actual, intentar en inglés
            if (lang !== 'en' && window.translations.en) {
                return getTranslationForLang(keyPath, 'en');
            }
            return getFallbackTranslation(keyPath);
        }
    }

    return value || getFallbackTranslation(keyPath);
}

// Función de fallback para traducciones críticas
function getFallbackTranslation(key) {
    const fallbacks = {
        'donate.walletReady': 'Nautilus Wallet detected - Ready to connect',
        'donate.connectBtn': 'Connect Nautilus Wallet',
        'donate.detecting': 'Detecting Nautilus Wallet...',
        'donate.donateBtn': 'Make Secure Donation'
    };

    return fallbacks[key] || key;
}
