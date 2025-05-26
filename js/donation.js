// donation.js - VERSIÓN CORRECTA CON FLEET SDK

// Configuration
const DONATION_ADDRESS = "9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY";
const NANOERGS_PER_ERG = 1000000000n;

// State
let isWalletConnected = false;
let selectedAmount = 0;
let ergoApi = null;
let nautilusConnector = null;
let FleetSDK = null;

// Initialize donation functionality
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeDonation, 100);
});

// Initialize all donation components
async function initializeDonation() {
    console.log('🚀 Initializing donation system with Fleet SDK...');
    console.log('💰 Donation address:', DONATION_ADDRESS);

    // Cargar Fleet SDK primero
    await loadFleetSDK();

    setupAmountSelection();
    setupWalletConnection();
    await checkNautilusAvailability();
}

// Cargar Fleet SDK usando ESM
async function loadFleetSDK() {
    try {
        console.log('📦 Loading Fleet SDK...');

        // Usar esm.sh para cargar Fleet SDK como módulos ES
        const [
            { TransactionBuilder, OutputBuilder },
            { Address }
        ] = await Promise.all([
            import('https://esm.sh/@fleet-sdk/core@0.1.0-alpha.20'),
            import('https://esm.sh/@fleet-sdk/common@0.1.0-alpha.20')
        ]);

        FleetSDK = {
            TransactionBuilder,
            OutputBuilder,
            Address
        };

        console.log('✅ Fleet SDK loaded successfully');
        console.log('📋 Available classes:', Object.keys(FleetSDK));

    } catch (error) {
        console.error('❌ Failed to load Fleet SDK:', error);
        console.log('🔄 Fallback: Using manual implementation...');
        // En caso de error, usar implementación manual como fallback
        FleetSDK = null;
    }
}

// Setup amount selection buttons
function setupAmountSelection() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedAmount = parseFloat(this.getAttribute('data-amount'));
            if (customAmount) {
                customAmount.value = selectedAmount;
            }
            console.log('✅ Selected amount:', selectedAmount, 'ERG');
        });
    });

    if (customAmount) {
        customAmount.addEventListener('input', function() {
            selectedAmount = parseFloat(this.value) || 0;
            amountBtns.forEach(btn => {
                const btnAmount = parseFloat(btn.getAttribute('data-amount'));
                btn.classList.toggle('active', btnAmount === selectedAmount);
            });
            console.log('✏️ Custom amount:', selectedAmount, 'ERG');
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

// Check if Nautilus is available
async function checkNautilusAvailability() {
    const statusElement = document.getElementById('walletStatus');
    const statusText = document.querySelector('.wallet-status .status-text');
    const connectBtn = document.getElementById('connectWalletBtn');

    console.log('🔍 Checking for Nautilus...');

    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50;

        const checkNautilus = () => {
            attempts++;

            if (attempts % 10 === 0) {
                console.log(`🔄 Attempt ${attempts}: Checking for ergoConnector...`);
            }

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

// Connect to Nautilus Wallet
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

        const connectionResult = await nautilusConnector.connect();
        console.log('📋 Connection result:', connectionResult);

        if (connectionResult === true) {
            ergoApi = window.ergo;
            if (!ergoApi) {
                throw new Error('Ergo API context not available');
            }

            console.log('✅ API context obtained');

            const balance = await ergoApi.get_balance();
            const balanceERG = Number(BigInt(balance) / NANOERGS_PER_ERG);

            console.log('💰 Wallet balance:', balanceERG, 'ERG');

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

// Make donation using Fleet SDK TransactionBuilder
async function makeDonationWithFleet() {
    console.log('🚀 === BUILDING DONATION WITH FLEET SDK ===');

    const amount = selectedAmount || parseFloat(document.getElementById('customAmount')?.value || 0);
    const amountNanoErg = BigInt(Math.floor(amount * 1000000000));

    try {
        // Get current height
        const currentHeight = await ergoApi.get_current_height();
        console.log('📊 Current height:', currentHeight);

        // Get UTXOs
        const utxos = await ergoApi.get_utxos();
        if (!utxos || utxos.length === 0) {
            throw new Error('No UTXOs available');
        }
        console.log('📦 Available UTXOs:', utxos.length);

        // Get change address (user's address from first UTXO)
        const userAddress = FleetSDK.Address.fromErgoTree(utxos[0].ergoTree).toString();
        console.log('👤 User address for change:', userAddress);

        console.log('🏗️ Building transaction with Fleet SDK...');
        console.log('  - Donation amount:', amount, 'ERG');
        console.log('  - Recipient:', DONATION_ADDRESS);
        console.log('  - Change address:', userAddress);

        // Build transaction usando Fleet SDK TransactionBuilder
        const unsignedTransaction = new FleetSDK.TransactionBuilder(currentHeight)
            .from(utxos)  // Fleet selecciona automáticamente los inputs necesarios
            .to(
                new FleetSDK.OutputBuilder(amountNanoErg, DONATION_ADDRESS)
            )  // Output de donación
            .sendChangeTo(userAddress)  // Cambio automático al usuario
            .payMinFee()  // Fee mínimo automático (0.0011 ERG)
            .build();

        console.log('✅ FLEET SDK TRANSACTION BUILT:');
        console.log('📥 INPUTS:', unsignedTransaction.inputs.length);
        console.log('📤 OUTPUTS:', unsignedTransaction.outputs.length);

        // Analizar outputs
        unsignedTransaction.outputs.forEach((output, index) => {
            const ergAmount = Number(BigInt(output.value)) / 1000000000;
            const outputAddress = FleetSDK.Address.fromErgoTree(output.ergoTree).toString();

            if (outputAddress === DONATION_ADDRESS) {
                console.log(`  ${index + 1}. DONATION: ${ergAmount} ERG → ${DONATION_ADDRESS.substring(0, 10)}...`);
            } else if (outputAddress === userAddress) {
                console.log(`  ${index + 1}. CHANGE: ${ergAmount} ERG + ${output.assets?.length || 0} tokens → (back to you)`);
            } else {
                console.log(`  ${index + 1}. OTHER: ${ergAmount} ERG → ${outputAddress.substring(0, 10)}...`);
            }
        });

        return unsignedTransaction;

    } catch (error) {
        console.error('❌ Fleet SDK transaction building failed:', error);
        throw error;
    }
}

// Fallback manual implementation
async function makeDonationManual() {
    console.log('🔧 Using manual transaction building...');
    // Usar la implementación manual previa como fallback
    // [Aquí iría el código manual de la versión anterior]
    throw new Error('Manual implementation needed as fallback');
}

// Main donation function
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

    if (amount < 0.001) {
        showStatus('donationStatus', 'Minimum donation is 0.001 ERG', 'error');
        return;
    }

    const donateBtn = document.getElementById('donateBtn');
    const originalText = donateBtn.innerHTML;

    try {
        donateBtn.disabled = true;
        donateBtn.innerHTML = '<div class="loading"></div> Building transaction...';
        showStatus('donationStatus', '⚡ Building transaction with Fleet SDK...', 'info');

        let unsignedTransaction;

        // Intentar usar Fleet SDK, fallback a manual si falla
        if (FleetSDK && FleetSDK.TransactionBuilder) {
            try {
                unsignedTransaction = await makeDonationWithFleet();
            } catch (fleetError) {
                console.warn('⚠️ Fleet SDK failed, using manual fallback:', fleetError.message);
                unsignedTransaction = await makeDonationManual();
            }
        } else {
            console.log('🔧 Fleet SDK not available, using manual implementation');
            unsignedTransaction = await makeDonationManual();
        }

        showStatus('donationStatus',
            `✍️ Please confirm transaction in Nautilus:\n• Donating ${amount} ERG\n• Network fee: 0.0011 ERG\n• Change and tokens will be returned to you`,
            'info'
        );

        // Sign the transaction
        const signedTx = await ergoApi.sign_tx(unsignedTransaction);
        console.log('✅ Transaction signed successfully');

        // Submit the transaction
        showStatus('donationStatus', '📡 Submitting to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(signedTx);

        console.log('🎉 DONATION COMPLETED SUCCESSFULLY!');
        console.log('  - Transaction ID:', txId);
        console.log('  - Amount donated:', amount, 'ERG');
        console.log('  - Recipient:', DONATION_ADDRESS);

        showStatus('donationStatus',
            `🎉 Donation successful! ${amount} ERG sent to ${DONATION_ADDRESS.substring(0, 10)}...${DONATION_ADDRESS.substring(DONATION_ADDRESS.length - 10)}. TX: ${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`,
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

// Utility functions
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.innerHTML = `<div class="donation-status ${type}">${message}</div>`;
        statusElement.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 15000);
        }
    } else {
        console.log(`📢 Status (${type}):`, message);
    }
}

function getTranslation(key) {
    try {
        if (typeof window !== 'undefined' && typeof window.getTranslation === 'function') {
            return window.getTranslation(key);
        }
    } catch (e) {
        console.warn('⚠️ Translation error:', e.message);
    }

    const fallbacks = {
        'donate.walletReady': 'Nautilus Wallet detected - Ready to connect',
        'donate.connectBtn': 'Connect Nautilus Wallet',
        'donate.detecting': 'Detecting Nautilus Wallet...',
        'donate.donateBtn': 'Make Secure Donation'
    };

    return fallbacks[key] || key;
}
