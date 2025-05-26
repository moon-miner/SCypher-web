// donation.js - VERSIÓN CORREGIDA con Fleet-SDK

// Configuration
const DONATION_ADDRESS = "9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY";
const NANOERGS_PER_ERG = 1000000000n;

// State
let isWalletConnected = false;
let selectedAmount = 0;
let ergoApi = null;
let nautilusConnector = null;

// Initialize donation functionality
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeDonation, 100);
});

// Initialize all donation components
async function initializeDonation() {
    console.log('🚀 Initializing donation system...');
    console.log('💰 Donation address:', DONATION_ADDRESS);

    // Cargar Fleet-SDK primero
    await loadFleetSDK();
    
    setupAmountSelection();
    setupWalletConnection();
    await checkNautilusAvailability();
}

// Cargar Fleet-SDK desde CDN
async function loadFleetSDK() {
    return new Promise((resolve, reject) => {
        if (typeof window.FleetSDK !== 'undefined') {
            console.log('✅ Fleet-SDK already loaded');
            resolve();
            return;
        }

        console.log('📦 Loading Fleet-SDK...');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@fleet-sdk/core@latest/dist/index.umd.js';
        script.onload = () => {
            console.log('✅ Fleet-SDK loaded successfully');
            resolve();
        };
        script.onerror = (error) => {
            console.error('❌ Failed to load Fleet-SDK:', error);
            reject(error);
        };
        document.head.appendChild(script);
    });
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

// CORRECCIÓN PRINCIPAL: Convertir dirección a ErgoTree usando Fleet-SDK
function addressToErgoTree(address) {
    console.log('🔄 Converting address to ErgoTree using Fleet-SDK:', address);

    try {
        if (typeof window.FleetSDK === 'undefined') {
            throw new Error('Fleet-SDK not loaded');
        }

        // Usar Fleet-SDK para convertir la dirección
        const addr = window.FleetSDK.Address.fromBase58(address);
        const ergoTree = addr.ergoTree;
        
        console.log('✅ Fleet-SDK conversion successful');
        console.log('  - Address:', address);
        console.log('  - ErgoTree:', ergoTree);
        
        return ergoTree;

    } catch (error) {
        console.error('❌ Fleet-SDK conversion failed:', error);
        
        // Fallback manual para direcciones P2PK
        console.log('🔧 Attempting manual P2PK conversion...');
        
        try {
            // Para la dirección 9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY
            // Decodificar base58 y extraer la clave pública
            const decoded = base58Decode(address);
            
            // Verificar que es una dirección P2PK (empieza con 0x01)
            if (decoded[0] !== 0x01) {
                throw new Error('Not a P2PK address');
            }
            
            // Extraer la clave pública (bytes 1-33)
            const publicKey = decoded.slice(1, 34);
            const publicKeyHex = Array.from(publicKey, byte => 
                byte.toString(16).padStart(2, '0')
            ).join('');
            
            // Construir ErgoTree para P2PK
            const ergoTree = `0008cd${publicKeyHex}`;
            
            console.log('✅ Manual P2PK conversion successful');
            console.log('  - Public Key:', publicKeyHex);
            console.log('  - ErgoTree:', ergoTree);
            
            return ergoTree;
            
        } catch (manualError) {
            console.error('❌ Manual conversion also failed:', manualError);
            throw new Error(`Cannot convert address to ErgoTree: ${error.message}`);
        }
    }
}

// Función auxiliar para decodificar base58
function base58Decode(str) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = 58;
    
    let decoded = [];
    let multi = 1;
    let s = str;
    
    while (s.length > 0) {
        const digit = ALPHABET.indexOf(s[s.length - 1]);
        if (digit < 0) throw new Error('Invalid base58 character');
        
        let carry = digit * multi;
        let i = 0;
        while (carry > 0 || i < decoded.length) {
            if (i >= decoded.length) decoded.push(0);
            carry += decoded[i];
            decoded[i] = carry % 256;
            carry = Math.floor(carry / 256);
            i++;
        }
        
        multi *= BASE;
        s = s.slice(0, -1);
    }
    
    // Manejar ceros iniciales
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
        decoded.push(0);
    }
    
    return new Uint8Array(decoded.reverse());
}

// CORRECCIÓN PRINCIPAL: Make donation con ErgoTree correcto
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
        console.log('🚀 === STARTING DONATION WITH FLEET-SDK ===');
        console.log('💰 Donation amount:', amount, 'ERG');
        console.log('🎯 Target address:', DONATION_ADDRESS);

        donateBtn.disabled = true;
        donateBtn.innerHTML = '<div class="loading"></div> Building transaction...';
        showStatus('donationStatus', '⚡ Building secure transaction...', 'info');

        // Get current height
        const currentHeight = await ergoApi.get_current_height();
        console.log('📊 Current height:', currentHeight);

        // Get UTXOs
        const utxos = await ergoApi.get_utxos();
        if (!utxos || utxos.length === 0) {
            throw new Error('No UTXOs available');
        }
        console.log('📦 Available UTXOs:', utxos.length);

        // Calculate amounts
        const amountNanoErg = BigInt(Math.floor(amount * 1000000000));
        const minFee = 1000000n; // 0.001 ERG
        const totalNeeded = amountNanoErg + minFee;

        console.log('💰 Transaction amounts:');
        console.log('  - Donation:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Fee:', Number(minFee) / 1000000000, 'ERG');
        console.log('  - Total needed:', Number(totalNeeded) / 1000000000, 'ERG');

        // Select UTXOs and collect tokens
        let selectedUtxos = [];
        let totalValue = 0n;
        const allTokens = new Map();

        for (const utxo of utxos) {
            selectedUtxos.push(utxo);
            totalValue += BigInt(utxo.value);

            // Collect tokens
            if (utxo.assets && utxo.assets.length > 0) {
                utxo.assets.forEach(token => {
                    const existing = allTokens.get(token.tokenId) || 0n;
                    allTokens.set(token.tokenId, existing + BigInt(token.amount));
                });
            }

            if (totalValue >= totalNeeded) break;
        }

        if (totalValue < totalNeeded) {
            throw new Error(`Insufficient funds. Need ${Number(totalNeeded) / 1000000000} ERG but only have ${Number(totalValue) / 1000000000} ERG`);
        }

        console.log('💼 Input analysis:');
        console.log('  - Selected UTXOs:', selectedUtxos.length);
        console.log('  - Total input:', Number(totalValue) / 1000000000, 'ERG');
        console.log('  - Tokens found:', allTokens.size);

        // CRÍTICO: Obtener ErgoTree correcto para la dirección de donación
        const donationErgoTree = addressToErgoTree(DONATION_ADDRESS);
        console.log('🎯 Donation ErgoTree:', donationErgoTree);

        // Obtener ErgoTree del sender (para el cambio)
        const senderErgoTree = selectedUtxos[0].ergoTree;
        console.log('👤 Sender ErgoTree:', senderErgoTree);

        // Verificar que los ErgoTrees sean diferentes
        if (donationErgoTree === senderErgoTree) {
            throw new Error('CRITICAL ERROR: Donation and sender ErgoTrees are the same! This would send funds back to sender.');
        }

        // Build outputs
        const outputs = [];

        // Output 1: Donation - ErgoTree correcto para la dirección de destino
        outputs.push({
            value: amountNanoErg.toString(),
            ergoTree: donationErgoTree, // ErgoTree de la dirección de donación
            assets: [], // Sin tokens en la donación
            additionalRegisters: {},
            creationHeight: currentHeight
        });

        console.log('✅ Donation output created:');
        console.log('  - Amount:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Target Address:', DONATION_ADDRESS);
        console.log('  - Target ErgoTree:', donationErgoTree);
        console.log('  - Assets: none (pure ERG donation)');

        // Output 2: Change - ERG restante + todos los tokens de vuelta al sender
        const changeValue = totalValue - amountNanoErg - minFee;

        if (changeValue > 0n || allTokens.size > 0) {
            const changeTokens = Array.from(allTokens.entries()).map(([tokenId, amount]) => ({
                tokenId,
                amount: amount.toString()
            }));

            const finalChangeValue = changeValue > 0n ? changeValue : 1000000n; // Min 0.001 ERG para caja con tokens

            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: senderErgoTree, // ErgoTree del sender para el cambio
                assets: changeTokens, // Todos los tokens de vuelta al sender
                additionalRegisters: {},
                creationHeight: currentHeight
            });

            console.log('✅ Change output created:');
            console.log('  - ERG returned:', Number(finalChangeValue) / 1000000000);
            console.log('  - Tokens returned:', changeTokens.length);
            console.log('  - Change ErgoTree:', senderErgoTree);
        }

        // Verificación final
        console.log('🔍 FINAL VERIFICATION:');
        console.log('  - Donation goes to:', DONATION_ADDRESS);
        console.log('  - Donation ErgoTree:', donationErgoTree);
        console.log('  - Change goes back to sender');
        console.log('  - Sender ErgoTree:', senderErgoTree);
        console.log('  - ErgoTrees are different:', donationErgoTree !== senderErgoTree ? '✅ YES' : '❌ NO - ERROR!');

        if (donationErgoTree === senderErgoTree) {
            throw new Error('CRITICAL: ErgoTrees are the same - donation would go back to sender!');
        }

        // Build final transaction
        const transaction = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };

        console.log('📝 Final transaction:');
        console.log('  - Inputs:', transaction.inputs.length);
        console.log('  - Outputs:', transaction.outputs.length);
        console.log('  - Donation to:', DONATION_ADDRESS);
        console.log('  - Amount:', amount, 'ERG');
        console.log('  - Tokens preserved:', allTokens.size);

        showStatus('donationStatus', `✍️ Please confirm transaction in Nautilus. Donating ${amount} ERG to ${DONATION_ADDRESS.substring(0, 10)}...`, 'info');

        // Sign the transaction
        const signedTx = await ergoApi.sign_tx(transaction);
        console.log('✅ Transaction signed successfully');

        // Submit the transaction
        showStatus('donationStatus', '📡 Submitting to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(signedTx);

        console.log('🎉 DONATION COMPLETED SUCCESSFULLY!');
        console.log('  - Transaction ID:', txId);
        console.log('  - Amount donated:', amount, 'ERG');
        console.log('  - Recipient:', DONATION_ADDRESS);
        console.log('  - Tokens preserved:', allTokens.size);

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
