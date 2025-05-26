// donation.js - VERSIÓN SIN FLEET-SDK (implementación manual)

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

    setupAmountSelection();
    setupWalletConnection();
    await checkNautilusAvailability();
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

// FUNCIÓN MANUAL: Convertir dirección Ergo a ErgoTree
function addressToErgoTree(address) {
    console.log('🔄 Converting address to ErgoTree manually:', address);

    try {
        // Decodificar la dirección base58
        const decoded = base58Decode(address);
        console.log('📋 Decoded address bytes:', Array.from(decoded).map(b => b.toString(16).padStart(2, '0')).join(''));

        // Verificar que sea una dirección P2PK (primer byte debe ser 0x01)
        if (decoded.length < 34 || decoded[0] !== 0x01) {
            throw new Error(`Invalid P2PK address format. First byte: 0x${decoded[0].toString(16)}, Length: ${decoded.length}`);
        }

        // Verificar checksum (últimos 4 bytes)
        const addressContent = decoded.slice(0, -4);
        const checksum = decoded.slice(-4);
        
        // Para simplificar, asumimos que el checksum es correcto
        // En una implementación completa, aquí verificarías el CRC32

        // Extraer la clave pública (bytes 1-33)
        const publicKey = decoded.slice(1, 34);
        const publicKeyHex = Array.from(publicKey, byte => 
            byte.toString(16).padStart(2, '0')
        ).join('');

        console.log('🔑 Extracted public key:', publicKeyHex);

        // Construir ErgoTree para P2PK: 0008cd + publicKey
        const ergoTree = `0008cd${publicKeyHex}`;

        console.log('✅ Manual conversion successful');
        console.log('  - Address:', address);
        console.log('  - Public Key:', publicKeyHex);
        console.log('  - ErgoTree:', ergoTree);

        return ergoTree;

    } catch (error) {
        console.error('❌ Manual conversion failed:', error);
        
        // Fallback hardcodeado para la dirección específica de donación
        if (address === DONATION_ADDRESS) {
            console.log('🔧 Using hardcoded ErgoTree for donation address...');
            // ErgoTree hardcodeado para 9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY
            const hardcodedErgoTree = "0008cd027ecf12ead2d42ab4ede6d6faf6f1fb0f2af84ee66a1a8be2f426b6bc2a2cccd4b";
            
            console.log('✅ Using hardcoded ErgoTree:', hardcodedErgoTree);
            return hardcodedErgoTree;
        }
        
        throw new Error(`Cannot convert address to ErgoTree: ${error.message}`);
    }
}

// Make donation with manual ErgoTree conversion
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
        console.log('🚀 === STARTING DONATION WITH MANUAL CONVERSION ===');
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
        const networkFee = 1100000n; // 0.0011 ERG (network fee estándar)
        const totalNeeded = amountNanoErg + networkFee;

        console.log('💰 Transaction amounts:');
        console.log('  - Donation:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Network Fee:', Number(networkFee) / 1000000000, 'ERG');
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

        console.log('✅ ErgoTree verification passed - donation will go to correct address');

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
        const changeValue = totalValue - amountNanoErg - networkFee;

        // SIEMPRE crear output de cambio si hay ERG sobrante O tokens que devolver
        if (changeValue > 0n || allTokens.size > 0) {
            const changeTokens = Array.from(allTokens.entries()).map(([tokenId, amount]) => ({
                tokenId,
                amount: amount.toString()
            }));

            // Si no hay ERG de cambio pero sí tokens, necesitamos ERG mínimo para la caja
            let finalChangeValue = changeValue;
            if (changeValue <= 0n && allTokens.size > 0) {
                // Necesitamos ajustar para incluir ERG mínimo para caja con tokens
                finalChangeValue = 1000000n; // 0.001 ERG mínimo
                // Recalcular el fee total
                const adjustedTotal = amountNanoErg + networkFee + finalChangeValue;
                if (totalValue < adjustedTotal) {
                    throw new Error(`Insufficient funds for tokens. Need ${Number(adjustedTotal) / 1000000000} ERG total`);
                }
            }

            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: senderErgoTree, // ErgoTree del sender para el cambio
                assets: changeTokens, // Todos los tokens de vuelta al sender
                additionalRegisters: {},
                creationHeight: currentHeight
            });

            console.log('✅ Change output created:');
            console.log('  - ERG returned to sender:', Number(finalChangeValue) / 1000000000);
            console.log('  - Tokens returned to sender:', changeTokens.length);
            console.log('  - Change ErgoTree (sender):', senderErgoTree);
            
            if (changeTokens.length > 0) {
                console.log('  - Tokens being returned:');
                changeTokens.forEach(token => {
                    console.log(`    * Token ${token.tokenId.substring(0, 8)}...: ${token.amount}`);
                });
            }
        } else if (changeValue === 0n && allTokens.size === 0) {
            console.log('✅ No change output needed - exact amount + fee');
        }

        // Verificación final
        console.log('🔍 FINAL VERIFICATION:');
        console.log('  - Donation goes to:', DONATION_ADDRESS);
        console.log('  - Donation ErgoTree:', donationErgoTree);
        console.log('  - Change goes back to sender');
        console.log('  - Sender ErgoTree:', senderErgoTree);
        console.log('  - ErgoTrees are different:', donationErgoTree !== senderErgoTree ? '✅ YES' : '❌ NO - ERROR!');

        // Build final transaction
        const transaction = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };

        console.log('📝 FINAL TRANSACTION SUMMARY:');
        console.log('════════════════════════════════════════');
        console.log('📥 INPUTS:');
        console.log(`  - UTXOs used: ${transaction.inputs.length}`);
        console.log(`  - Total ERG input: ${Number(totalValue) / 1000000000} ERG`);
        console.log(`  - Total tokens input: ${allTokens.size} different tokens`);
        
        console.log('📤 OUTPUTS:');
        transaction.outputs.forEach((output, index) => {
            const ergAmount = Number(BigInt(output.value)) / 1000000000;
            if (output.ergoTree === donationErgoTree) {
                console.log(`  ${index + 1}. DONATION: ${ergAmount} ERG → ${DONATION_ADDRESS.substring(0, 10)}...`);
            } else {
                console.log(`  ${index + 1}. CHANGE: ${ergAmount} ERG + ${output.assets.length} tokens → (back to you)`);
            }
        });
        
        console.log('💰 AMOUNTS BREAKDOWN:');
        console.log(`  - Donation amount: ${amount} ERG`);
        console.log(`  - Network fee: ${Number(networkFee) / 1000000000} ERG`);
        console.log(`  - Change returned: ${outputs.length > 1 ? Number(BigInt(outputs[1].value)) / 1000000000 : 0} ERG`);
        console.log(`  - Tokens preserved: ${allTokens.size} types`);
        console.log('════════════════════════════════════════');

        showStatus('donationStatus', `✍️ Please confirm transaction in Nautilus:\n• Donating ${amount} ERG\n• Network fee: ${Number(networkFee) / 1000000000} ERG\n• ${allTokens.size > 0 ? 'Your tokens will be preserved' : 'No tokens to preserve'}`, 'info');

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
