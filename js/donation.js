// donation.js - VERSIÓN CORREGIDA SIN ERRORES DE SCOPE

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
    console.log('🔧 Using manual implementation (Fleet SDK style)');

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

// Manual transaction building siguiendo EXACTAMENTE el patrón de Fleet SDK
async function buildDonationTransaction(amount) {
    console.log('🔧 === BUILDING TRANSACTION (EXACT Fleet SDK Pattern) ===');
    
    const amountNanoErg = BigInt(Math.floor(amount * 1000000000));
    
    try {
        // Get current height
        const currentHeight = await ergoApi.get_current_height();
        console.log('📊 Current height:', currentHeight);

        // Get UTXOs - estos son nuestros inputs
        const utxos = await ergoApi.get_utxos();
        if (!utxos || utxos.length === 0) {
            throw new Error('No UTXOs available');
        }
        console.log('📦 Available UTXOs:', utxos.length);

        // Fleet SDK recommended minimum fee - CORRECCIÓN: 0.001 ERG estándar
        const RECOMMENDED_MIN_FEE = 1000000n; // 0.001 ERG (no 0.0011)
        console.log('💰 Using Ergo standard minimum fee:', Number(RECOMMENDED_MIN_FEE) / 1000000000, 'ERG');

        // Get sender address from first UTXO (para change)
        const senderErgoTree = utxos[0].ergoTree;
        console.log('👤 Sender ErgoTree (for change):', senderErgoTree);

        // Get donation ErgoTree
        const donationErgoTree = addressToErgoTree(DONATION_ADDRESS);
        console.log('🎯 Donation ErgoTree:', donationErgoTree);

        // Verificar que las direcciones sean diferentes
        if (donationErgoTree === senderErgoTree) {
            throw new Error('CRITICAL: Donation and sender addresses are the same!');
        }

        // Calculate total needed para inputs (SIN incluir fee aquí)
        const totalNeeded = amountNanoErg; // Solo la donación
        console.log('📊 Amount needed for donation:', Number(totalNeeded) / 1000000000, 'ERG');
        console.log('📊 Standard Ergo fee will be deducted:', Number(RECOMMENDED_MIN_FEE) / 1000000000, 'ERG');

        // Select inputs (Fleet SDK BoxSelector logic)
        let selectedInputs = [];
        let totalInputValue = 0n;
        const allTokens = new Map();

        // Ordenar UTXOs por valor (estrategia Fleet SDK)
        const sortedUtxos = [...utxos].sort((a, b) => Number(BigInt(b.value) - BigInt(a.value)));

        // Select inputs to cover donation + fee + change
        for (const utxo of sortedUtxos) {
            selectedInputs.push(utxo);
            totalInputValue += BigInt(utxo.value);

            // Collect all tokens from inputs
            if (utxo.assets && utxo.assets.length > 0) {
                utxo.assets.forEach(token => {
                    const existing = allTokens.get(token.tokenId) || 0n;
                    allTokens.set(token.tokenId, existing + BigInt(token.amount));
                });
            }

            // Necesitamos cubrir: donación + fee mínimo
            if (totalInputValue >= (amountNanoErg + RECOMMENDED_MIN_FEE)) break;
        }

        if (totalInputValue < (amountNanoErg + RECOMMENDED_MIN_FEE)) {
            throw new Error(`Insufficient funds. Need ${Number(amountNanoErg + RECOMMENDED_MIN_FEE) / 1000000000} ERG but only have ${Number(totalInputValue) / 1000000000} ERG`);
        }

        console.log('📥 INPUTS SELECTED:');
        console.log('  - UTXOs selected:', selectedInputs.length);
        console.log('  - Total input value:', Number(totalInputValue) / 1000000000, 'ERG');
        console.log('  - Tokens in inputs:', allTokens.size);

        // ========== CONSTRUCCIÓN CORRECTA CON FEE OUTPUT SEPARADO ==========
        
        const outputs = [];

        // OUTPUT 1: Donation (correcto)
        const donationOutput = {
            value: amountNanoErg.toString(),
            ergoTree: donationErgoTree,
            assets: [], // No tokens en donation - pure ERG
            additionalRegisters: {},
            creationHeight: currentHeight
        };
        outputs.push(donationOutput);

        console.log('✅ OUTPUT 1 - DONATION:');
        console.log('  - Amount:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - To address:', DONATION_ADDRESS);
        console.log('  - ErgoTree:', donationErgoTree);

        // OUTPUT 2: Fee Output (CRÍTICO - según documentación oficial)
        // "Create one fee output protected by the minerFee contract with txFee ERGs"
        const feeErgoTree = "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304";
        const feeOutput = {
            value: RECOMMENDED_MIN_FEE.toString(),
            ergoTree: feeErgoTree, // Miner fee contract
            assets: [],
            additionalRegisters: {},
            creationHeight: currentHeight
        };
        outputs.push(feeOutput);

        console.log('✅ OUTPUT 2 - MINER FEE:');
        console.log('  - Fee amount:', Number(RECOMMENDED_MIN_FEE) / 1000000000, 'ERG');
        console.log('  - To miner contract');
        console.log('  - ErgoTree:', feeErgoTree);

        // OUTPUT 3: Change (sin deducir fee - ya está en output separado)
        const changeValue = totalInputValue - amountNanoErg - RECOMMENDED_MIN_FEE;
        
        console.log('🔍 BALANCE CALCULATION (con fee output separado):');
        console.log('  - Total inputs:', Number(totalInputValue) / 1000000000, 'ERG');
        console.log('  - Donation output:', Number(amountNanoErg) / 1000000000, 'ERG');
        console.log('  - Fee output:', Number(RECOMMENDED_MIN_FEE) / 1000000000, 'ERG');
        console.log('  - Change remaining:', Number(changeValue) / 1000000000, 'ERG');
        console.log('  - Formula: Inputs = Donation + Fee + Change');
        console.log('  - Verification:', Number(totalInputValue) === Number(amountNanoErg + RECOMMENDED_MIN_FEE + changeValue) ? '✅ CORRECT' : '❌ ERROR');
        
        if (changeValue > 0n || allTokens.size > 0) {
            // Convert tokens for change output
            const changeTokens = Array.from(allTokens.entries()).map(([tokenId, amount]) => ({
                tokenId,
                amount: amount.toString()
            }));

            // Si no hay ERG de cambio pero sí tokens, necesitamos ERG mínimo
            let finalChangeValue = changeValue;
            if (changeValue < 1000000n && allTokens.size > 0) {
                finalChangeValue = 1000000n; // 0.001 ERG mínimo para caja con tokens
                console.log('⚠️ Adjusting change for minimum token box value');
            }

            // Solo crear output de cambio si hay ERG positivo o tokens
            if (finalChangeValue > 0n || changeTokens.length > 0) {
                const changeOutput = {
                    value: finalChangeValue.toString(),
                    ergoTree: senderErgoTree, // Back to sender
                    assets: changeTokens, // All tokens back to sender
                    additionalRegisters: {},
                    creationHeight: currentHeight
                };
                outputs.push(changeOutput);

                console.log('✅ OUTPUT 3 - CHANGE:');
                console.log('  - ERG change:', Number(finalChangeValue) / 1000000000);
                console.log('  - Tokens returned:', changeTokens.length);
                console.log('  - Back to sender ErgoTree:', senderErgoTree);

                if (changeTokens.length > 0) {
                    console.log('  - Token details:');
                    changeTokens.forEach(token => {
                        console.log(`    * ${token.tokenId.substring(0, 8)}...${token.tokenId.substring(token.tokenId.length - 8)}: ${token.amount}`);
                    });
                }
            }
        } else if (changeValue === 0n && allTokens.size === 0) {
            console.log('ℹ️  No change output - exact amount');
        } else {
            console.error('🚨 Insufficient funds for transaction after fee');
            throw new Error(`Insufficient funds. After donation and fee, remaining ${Number(changeValue) / 1000000000} ERG is insufficient`);
        }

        // Build final transaction (Fleet SDK .build())
        const transaction = {
            inputs: selectedInputs,
            outputs: outputs,
            dataInputs: []
        };

        console.log('📝 FINAL TRANSACTION (con fee output separado):');
        console.log('════════════════════════════════════════');
        console.log('📥 INPUTS:', transaction.inputs.length, 'UTXOs');
        console.log('  - Total input value:', Number(totalInputValue) / 1000000000, 'ERG');
        console.log('📤 OUTPUTS:', transaction.outputs.length, 'outputs');
        
        let totalOutputValue = 0n;
        transaction.outputs.forEach((output, index) => {
            const ergAmount = Number(BigInt(output.value)) / 1000000000;
            totalOutputValue += BigInt(output.value);
            if (index === 0) {
                console.log(`  ${index + 1}. DONATION: ${ergAmount} ERG → ${DONATION_ADDRESS.substring(0, 10)}...`);
            } else if (index === 1) {
                console.log(`  ${index + 1}. MINER FEE: ${ergAmount} ERG → fee contract`);
            } else {
                console.log(`  ${index + 1}. CHANGE: ${ergAmount} ERG + ${output.assets.length} tokens → (back to you)`);
            }
        });
        
        console.log('  - Total output value:', Number(totalOutputValue) / 1000000000, 'ERG');
        
        console.log('💰 BALANCE VERIFICATION (con fee output):');
        console.log(`  - Total inputs: ${Number(totalInputValue) / 1000000000} ERG`);
        console.log(`  - Total outputs: ${Number(totalOutputValue) / 1000000000} ERG`);
        console.log(`  - Difference: ${Number(totalInputValue - totalOutputValue) / 1000000000} ERG`);
        console.log(`  - Perfect balance: ${totalInputValue === totalOutputValue ? '✅ YES (Inputs = Outputs)' : '❌ NO'}`);
        console.log('  - Fee is now an explicit output, not implicit');
        console.log('════════════════════════════════════════');

        return {
            transaction: transaction,
            tokenCount: allTokens.size,
            changeAmount: changeValue,
            feeAmount: RECOMMENDED_MIN_FEE,
            totalInputs: totalInputValue,
            selectedUtxos: selectedInputs.length
        };

    } catch (error) {
        console.error('❌ Transaction building failed:', error);
        throw error;
    }
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
        showStatus('donationStatus', '⚡ Building transaction with Fleet SDK principles...', 'info');

        // Build transaction
        console.log('🔧 Building transaction manually (Fleet SDK principles)');
        const result = await buildDonationTransaction(amount);
        
        const unsignedTransaction = result.transaction;
        const tokenCount = result.tokenCount;

        showStatus('donationStatus', 
            `✍️ Please confirm in Nautilus:\n• Donation: ${amount} ERG → donation address\n• Miner fee: 0.0011 ERG → fee contract\n• ${tokenCount > 0 ? `Your ${tokenCount} token types + change → back to you` : 'Change → back to you'}`, 
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
