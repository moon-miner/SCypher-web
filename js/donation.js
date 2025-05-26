// donation.js - Token-safe donation functionality - FINAL CORRECTED VERSION

// Configuration - CORRECTED ADDRESS & ERGOTREE
const DONATION_ADDRESS = "9f4WEgtBoWrtMa4HoUmxA3NSeWMU9PZRvArVGrSS3whSWfGDBoY";
const NANOERGS_PER_ERG = 1000000000n;

// CORRECTED: ErgoTree for the donation address (converted from donaciones.html working version)
// This ErgoTree corresponds to a P2PK address and should work correctly
const DONATION_ERGOTREE = "0008cd027ecf12ead2d42ab4ede6d6faf6f1fb0f2af84ee66a1a8be2f426b6bc2a2cccd4b";

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
    console.log('🌳 ErgoTree:', DONATION_ERGOTREE);
    
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

// CORRECTED: Make token-safe donation with proper validations
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

    // Minimum donation check
    if (amount < 0.001) {
        showStatus('donationStatus', 'Minimum donation is 0.001 ERG', 'error');
        return;
    }

    const donateBtn = document.getElementById('donateBtn');
    const originalText = donateBtn.innerHTML;

    try {
        console.log('🚀 === STARTING TOKEN-SAFE DONATION ===');
        console.log('💰 Donation amount:', amount, 'ERG');
        console.log('🎯 Donation address:', DONATION_ADDRESS);

        donateBtn.disabled = true;
        donateBtn.innerHTML = '<div class="loading"></div> Building secure transaction...';
        showStatus('donationStatus', '⚡ Building transaction that preserves all tokens...', 'info');

        // 1. Get basic parameters
        const currentHeight = await ergoApi.get_current_height();
        console.log('📊 Current height:', currentHeight);

        // 2. Calculate amounts in nanoERGs with proper precision
        const donationNanoERGs = BigInt(Math.floor(amount * 1000000000));
        const feeNanoERGs = 1000000n; // 0.001 ERG standard fee
        const totalNeededNanoERGs = donationNanoERGs + feeNanoERGs;

        console.log('💵 Transaction amounts:');
        console.log('  - Donation:', donationNanoERGs.toString(), 'nanoERG');
        console.log('  - Fee:', feeNanoERGs.toString(), 'nanoERG');
        console.log('  - Total needed:', totalNeededNanoERGs.toString(), 'nanoERG');
        console.log('  - Total needed (ERG):', Number(totalNeededNanoERGs) / 1000000000);

        // 3. Get available UTXOs
        const availableUtxos = await ergoApi.get_utxos();
        if (!availableUtxos || availableUtxos.length === 0) {
            throw new Error('No UTXOs available in your wallet');
        }

        console.log('📦 Available UTXOs:', availableUtxos.length);

        // 4. Select UTXOs and collect tokens - EXACTLY like donaciones.html
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

        // CRITICAL: Validate sufficient funds
        if (totalInputValue < totalNeededNanoERGs) {
            const needed = Number(totalNeededNanoERGs) / 1000000000;
            const available = Number(totalInputValue) / 1000000000;
            throw new Error(`Insufficient funds. Need ${needed.toFixed(9)} ERG but only have ${available.toFixed(9)} ERG available`);
        }

        console.log('🔍 Input analysis:');
        console.log('  - UTXOs selected:', selectedUtxos.length);
        console.log('  - Total input ERG:', Number(totalInputValue) / 1000000000);
        console.log('  - Token types found:', tokenRegistry.size);
        
        if (tokenRegistry.size > 0) {
            console.log('  - Tokens to preserve:', Array.from(tokenRegistry.entries()).map(([id, amt]) =>
                `${id.substring(0, 8)}...${id.substring(id.length - 8)} (${amt.toString()})`
            ));
        }

        // 5. Build outputs with COMPLETE validation
        const outputs = [];

        // Output 1: Donation (ERG only, NO tokens) - CORRECTED ErgoTree
        outputs.push({
            value: donationNanoERGs.toString(),
            ergoTree: DONATION_ERGOTREE, // CORRECTED: Use proper ErgoTree
            assets: [], // CRITICAL: No tokens in donation!
            additionalRegisters: {},
            creationHeight: currentHeight
        });

        console.log('✅ Donation output created:');
        console.log('  - Value:', Number(donationNanoERGs) / 1000000000, 'ERG');
        console.log('  - ErgoTree:', DONATION_ERGOTREE);
        console.log('  - Assets: NONE (preserving for sender)');

        // Output 2: Change (remaining ERG + ALL tokens) - EXACTLY like donaciones.html
        const changeValue = totalInputValue - donationNanoERGs - feeNanoERGs;

        // CRITICAL: Always create change output if there are tokens OR remaining ERG
        if (changeValue > 0n || tokenRegistry.size > 0) {
            // Use ErgoTree from first input to ensure tokens return correctly
            const changeErgoTree = selectedUtxos[0].ergoTree;

            // Convert all tokens to output format
            const tokensForChange = Array.from(tokenRegistry.entries()).map(([tokenId, amount]) => ({
                tokenId: tokenId,
                amount: amount.toString()
            }));

            // CRITICAL: Ensure minimum value for boxes with tokens (0.001 ERG minimum)
            const finalChangeValue = changeValue > 0n ? changeValue : 1000000n;

            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: changeErgoTree, // SAME AS INPUT!
                assets: tokensForChange, // ALL TOKENS HERE!
                additionalRegisters: {},
                creationHeight: currentHeight
            });

            console.log('✅ Change output created:');
            console.log('  - ERG returned:', Number(finalChangeValue) / 1000000000);
            console.log('  - Tokens preserved:', tokensForChange.length);
            console.log('  - ErgoTree match:', changeErgoTree === selectedUtxos[0].ergoTree ? 'YES ✓' : 'NO ❌');

            // VALIDATION: Ensure no ERG is lost
            const totalOutputValue = donationNanoERGs + finalChangeValue + feeNanoERGs;
            if (totalOutputValue !== totalInputValue) {
                console.error('❌ ERG BALANCE ERROR:');
                console.error('  - Input total:', Number(totalInputValue) / 1000000000, 'ERG');
                console.error('  - Output total:', Number(totalOutputValue) / 1000000000, 'ERG');
                throw new Error('Transaction balance error: Input and output ERG amounts do not match');
            }
        } else {
            // VALIDATION: Ensure no remaining ERG is lost to fees
            const remainingERG = Number(changeValue) / 1000000000;
            if (remainingERG > 0.000000001) { // More than 1 nanoERG
                console.warn('⚠️ Small amount of ERG will be lost:', remainingERG, 'ERG');
            }
        }

        // 6. Build and validate final transaction
        const unsignedTransaction = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };

        // FINAL VALIDATION: Check transaction integrity
        const totalInputERG = selectedUtxos.reduce((sum, utxo) => sum + BigInt(utxo.value), 0n);
        const totalOutputERG = outputs.reduce((sum, output) => sum + BigInt(output.value), 0n);
        const impliedFee = totalInputERG - totalOutputERG;

        console.log('📝 Transaction validation:');
        console.log('  - Inputs:', selectedUtxos.length);
        console.log('  - Outputs:', outputs.length);
        console.log('  - Input ERG:', Number(totalInputERG) / 1000000000);
        console.log('  - Output ERG:', Number(totalOutputERG) / 1000000000);
        console.log('  - Implied fee:', Number(impliedFee) / 1000000000, 'ERG');
        console.log('  - Tokens preserved:', tokenRegistry.size);

        // Validate fee is reasonable (between 0.001 and 0.01 ERG)
        if (impliedFee < 1000000n || impliedFee > 10000000n) {
            throw new Error(`Invalid transaction fee: ${Number(impliedFee) / 1000000000} ERG. Expected 0.001-0.01 ERG`);
        }

        showStatus('donationStatus', 
            `🛡️ Transaction ready - ${tokenRegistry.size} token types preserved, ${Number(impliedFee) / 1000000000} ERG fee. Please confirm in Nautilus.`, 
            'info'
        );

        // 7. Sign transaction
        console.log('✍️ Requesting signature from Nautilus...');
        const signedTransaction = await ergoApi.sign_tx(unsignedTransaction);
        console.log('✅ Transaction signed successfully');

        // 8. Submit transaction
        showStatus('donationStatus', '📡 Submitting transaction to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(signedTransaction);

        console.log('🎉 DONATION COMPLETED SUCCESSFULLY!');
        console.log('  - Transaction ID:', txId);
        console.log('  - Amount donated:', amount, 'ERG');
        console.log('  - Donation address:', DONATION_ADDRESS);
        console.log('  - Tokens preserved:', tokenRegistry.size);
        console.log('  - Fee paid:', Number(impliedFee) / 1000000000, 'ERG');

        showStatus('donationStatus',
            `🎉 Donation successful! ${amount} ERG sent to ${DONATION_ADDRESS.substring(0, 10)}...${DONATION_ADDRESS.substring(DONATION_ADDRESS.length - 10)}. ${tokenRegistry.size} tokens preserved. TX: ${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`,
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
        
        // Log detailed error info for debugging
        console.error('📍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    } finally {
        donateBtn.disabled = false;
        donateBtn.innerHTML = originalText;
    }
}

// Utility function to show status messages
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (statusElement) {
        statusElement.innerHTML = `<div class="donation-status ${type}">${message}</div>`;
        statusElement.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 15000); // Show success/error messages longer
        }
    } else {
        console.log(`📢 Status (${type}):`, message);
    }
}

// Utility function to get translations with safe fallback
function getTranslation(key) {
    try {
        if (typeof window !== 'undefined' && typeof window.getTranslation === 'function') {
            return window.getTranslation(key);
        }
    } catch (e) {
        console.warn('⚠️ Translation error:', e.message);
    }

    // Safe fallback translations
    const fallbacks = {
        'donate.walletReady': 'Nautilus Wallet detected - Ready to connect',
        'donate.connectBtn': 'Connect Nautilus Wallet',
        'donate.detecting': 'Detecting Nautilus Wallet...',
        'donate.donateBtn': 'Make Secure Donation'
    };

    return fallbacks[key] || key;
}
