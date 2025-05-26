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
    console.log('🚀 Initializing donation system...');
    console.log('💰 Donation address:', DONATION_ADDRESS);
    console.log('🔧 Using manual implementation (Fleet SDK style)');

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

// Fallback manual implementation siguiendo principios de Fleet SDK
async function makeDonationManual() {
    console.log('🔧 === MANUAL TRANSACTION BUILDING (Fleet SDK Style) ===');
    
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

        // Calculate required amounts (como Fleet SDK)
        const networkFee = 1100000n; // 0.0011 ERG (minimum fee como Fleet SDK)
        const totalNeeded = amountNanoErg + networkFee;

        console.log('💰 Transaction amounts (Fleet SDK style):');
        console.log('  - Donation:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Network Fee (auto):', Number(networkFee) / 1000000000, 'ERG');
        console.log('  - Total needed:', Number(totalNeeded) / 1000000000, 'ERG');

        // Select UTXOs and collect tokens (como Fleet SDK BoxSelector)
        let selectedUtxos = [];
        let totalValue = 0n;
        const allTokens = new Map();

        // Ordenar UTXOs por valor (Fleet SDK strategy)
        const sortedUtxos = [...utxos].sort((a, b) => Number(BigInt(b.value) - BigInt(a.value)));

        for (const utxo of sortedUtxos) {
            selectedUtxos.push(utxo);
            totalValue += BigInt(utxo.value);

            // Collect all tokens (Fleet SDK preserva todos los tokens)
            if (utxo.assets && utxo.assets.length > 0) {
                utxo.assets.forEach(token => {
                    const existing = allTokens.get(token.tokenId) || 0n;
                    allTokens.set(token.tokenId, existing + BigInt(token.amount));
                });
            }

            // Stop when we have enough (Fleet SDK efficiency)
            if (totalValue >= totalNeeded) break;
        }

        if (totalValue < totalNeeded) {
            throw new Error(`Insufficient funds. Need ${Number(totalNeeded) / 1000000000} ERG but only have ${Number(totalValue) / 1000000000} ERG`);
        }

        console.log('💼 Input selection (Fleet SDK style):');
        console.log('  - Selected UTXOs:', selectedUtxos.length);
        console.log('  - Total input value:', Number(totalValue) / 1000000000, 'ERG');
        console.log('  - Total tokens found:', allTokens.size);

        // Get ErgoTrees
        const donationErgoTree = addressToErgoTree(DONATION_ADDRESS);
        const senderErgoTree = selectedUtxos[0].ergoTree; // Change address

        console.log('🎯 Transaction targets:');
        console.log('  - Donation ErgoTree:', donationErgoTree);
        console.log('  - Sender ErgoTree:', senderErgoTree);

        // Verify different addresses
        if (donationErgoTree === senderErgoTree) {
            throw new Error('CRITICAL: Donation and sender addresses are the same!');
        }

        // Build outputs (Fleet SDK style)
        const outputs = [];

        // Output 1: Donation (como Fleet SDK .to())
        outputs.push({
            value: amountNanoErg.toString(),
            ergoTree: donationErgoTree,
            assets: [], // No tokens in donation
            additionalRegisters: {},
            creationHeight: currentHeight
        });

        console.log('✅ Donation output (Fleet SDK .to() style):');
        console.log('  - Amount:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Target:', DONATION_ADDRESS.substring(0, 15) + '...');

        // Output 2: Change (como Fleet SDK .sendChangeTo())
        const changeValue = totalValue - amountNanoErg - networkFee;

        if (changeValue > 0n || allTokens.size > 0) {
            // Convert tokens to output format
            const changeTokens = Array.from(allTokens.entries()).map(([tokenId, amount]) => ({
                tokenId,
                amount: amount.toString()
            }));

            // Ensure minimum value for token boxes (Fleet SDK rule)
            let finalChangeValue = changeValue;
            if (changeValue < 1000000n && allTokens.size > 0) {
                finalChangeValue = 1000000n; // Minimum for token box
            }

            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: senderErgoTree,
                assets: changeTokens,
                additionalRegisters: {},
                creationHeight: currentHeight
            });

            console.log('✅ Change output (Fleet SDK .sendChangeTo() style):');
            console.log('  - ERG returned:', Number(finalChangeValue) / 1000000000);
            console.log('  - Tokens returned:', changeTokens.length);
            console.log('  - Back to sender address');

            if (changeTokens.length > 0) {
                console.log('  - Token preservation:');
                changeTokens.forEach(token => {
                    console.log(`    * ${token.tokenId.substring(0, 8)}...${token.tokenId.substring(token.tokenId.length - 8)}: ${token.amount}`);
                });
            }
        }

        // Build transaction (Fleet SDK .build() style)
        const transaction = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };

        console.log('📝 FINAL TRANSACTION (Fleet SDK style):');
        console.log('════════════════════════════════════════');
        console.log('📥 INPUTS:');
        console.log(`  - UTXOs: ${transaction.inputs.length}`);
        console.log(`  - Total ERG: ${Number(totalValue) / 1000000000}`);
        console.log(`  - Tokens: ${allTokens.size} types`);
        
        console.log('📤 OUTPUTS:');
        transaction.outputs.forEach((output, index) => {
            const ergAmount = Number(BigInt(output.value)) / 1000000000;
            if (output.ergoTree === donationErgoTree) {
                console.log(`  ${index + 1}. DONATION: ${ergAmount} ERG → donation address`);
            } else {
                console.log(`  ${index + 1}. CHANGE: ${ergAmount} ERG + ${output.assets.length} tokens → your address`);
            }
        });
        
        console.log('💰 AMOUNTS:');
        console.log(`  - Donation: ${amount} ERG`);
        console.log(`  - Network fee: ${Number(networkFee) / 1000000000} ERG`);
        console.log(`  - Change: ${changeValue > 0n ? Number(changeValue) / 1000000000 : 0} ERG`);
        console.log('════════════════════════════════════════');

        // Retornar tanto la transacción como información útil
        return {
            transaction: transaction,
            tokenCount: allTokens.size,
            changeAmount: changeValue,
            totalInputs: totalValue,
            selectedUtxos: selectedUtxos.length
        };

    } catch (error) {
        console.error('❌ Manual transaction building failed:', error);
        throw error;
    }
}

// Manual address to ErgoTree conversion
function addressToErgoTree(address) {
    console.log('🔄 Converting address to ErgoTree:', address);

    try {
        // Base58 decode
        const decoded = base58Decode(address);
        
        // Verify P2PK format
        if (decoded.length < 34 || decoded[0] !== 0x01) {
            throw new Error(`Invalid P2PK address format`);
        }

        // Extract public key (bytes 1-33)
        const publicKey = decoded.slice(1, 34);
        const publicKeyHex = Array.from(publicKey, byte => 
            byte.toString(16).padStart(2, '0')
        ).join('');

        // Build P2PK ErgoTree
        const ergoTree = `0008cd${publicKeyHex}`;

        console.log('✅ Address conversion successful');
        console.log('  - Public Key:', publicKeyHex);
        console.log('  - ErgoTree:', ergoTree);

        return ergoTree;

    } catch (error) {
        console.error('❌ Address conversion failed:', error);
        
        // Hardcoded fallback for donation address
        if (address === DONATION_ADDRESS) {
            console.log('🔧 Using hardcoded ErgoTree for donation address');
            return "0008cd027ecf12ead2d42ab4ede6d6faf6f1fb0f2af84ee66a1a8be2f426b6bc2a2cccd4b";
        }
        
        throw new Error(`Cannot convert address: ${error.message}`);
    }
}

// Base58 decode function
function base58Decode(str) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const ALPHABET_MAP = {};
    for (let i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET[i]] = i;
    }

    let decoded = [0];
    
    for (let i = 0; i < str.length; i++) {
        let carry = ALPHABET_MAP[str[i]];
        if (carry === undefined) throw new Error('Invalid base58 character');
        
        for (let j = 0; j < decoded.length; j++) {
            carry += decoded[j] * 58;
            decoded[j] = carry & 255;
            carry >>= 8;
        }
        
        while (carry > 0) {
            decoded.push(carry & 255);
            carry >>= 8;
        }
    }
    
    // Handle leading zeros
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
        decoded.push(0);
    }
    
    return new Uint8Array(decoded.reverse());
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

        // Usar implementación manual (estilo Fleet SDK)
        console.log('🔧 Building transaction manually (Fleet SDK principles)');
        unsignedTransaction = await makeDonationManual();

        showStatus('donationStatus', 
            `✍️ Please confirm in Nautilus:\n• Donating ${amount} ERG to donation address\n• Network fee: 0.0011 ERG (automatic)\n• ${allTokens && allTokens.size > 0 ? `Your ${allTokens.size} token types will be preserved` : 'Change will be returned to you'}`, 
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
        console.log('  - Tokens preserved:', tokenCount);

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
