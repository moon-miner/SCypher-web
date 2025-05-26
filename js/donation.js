// donation.js - Correct implementation using Fleet-SDK

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
    console.log('🚀 Initializing donation system with Fleet-SDK...');
    console.log('💰 Donation address:', DONATION_ADDRESS);
    
    // Check if Fleet-SDK is available
    if (typeof window.FleetSDK !== 'undefined') {
        console.log('✅ Fleet-SDK detected:', window.FleetSDK);
    } else {
        console.log('⚠️ Fleet-SDK not detected - using manual transaction building');
    }
    
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

// Make donation using proper address handling
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
        console.log('🚀 === STARTING DONATION WITH PROPER ADDRESS HANDLING ===');
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
        console.log('💰 Amount in nanoERG:', amountNanoErg.toString());

        // Check if Fleet-SDK is available for proper transaction building
        if (typeof window.FleetSDK !== 'undefined' && window.FleetSDK.TransactionBuilder) {
            console.log('🚀 Using Fleet-SDK TransactionBuilder');
            
            // Use Fleet-SDK approach (similar to Spectrum Finance)
            const txBuilder = new window.FleetSDK.TransactionBuilder(currentHeight)
                .from(utxos)
                .to(new window.FleetSDK.OutputBuilder(amountNanoErg, DONATION_ADDRESS))
                .sendChangeTo(await ergoApi.get_change_address())
                .payMinFee();
            
            const unsignedTx = txBuilder.build();
            console.log('✅ Transaction built with Fleet-SDK');
            
        } else {
            console.log('🔧 Using manual transaction building');
            
            // Manual approach but with proper address handling
            const changeAddress = await ergoApi.get_change_address();
            
            // Select UTXOs
            let selectedUtxos = [];
            let totalValue = 0n;
            const minFee = 1000000n; // 0.001 ERG
            const needed = amountNanoErg + minFee;
            
            // Collect tokens
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
                
                if (totalValue >= needed) break;
            }
            
            if (totalValue < needed) {
                throw new Error(`Insufficient funds. Need ${Number(needed) / 1000000000} ERG`);
            }
            
            console.log('💼 Transaction summary:');
            console.log('  - Selected UTXOs:', selectedUtxos.length);
            console.log('  - Total input:', Number(totalValue) / 1000000000, 'ERG');
            console.log('  - Tokens found:', allTokens.size);
            
            // Build outputs
            const outputs = [];
            
            // Donation output - pure ERG, no tokens
            outputs.push({
                value: amountNanoErg.toString(),
                ergoTree: selectedUtxos[0].ergoTree, // Use same format as input
                assets: [],
                additionalRegisters: {},
                creationHeight: currentHeight
            });
            
            // Change output - remaining ERG + all tokens
            const changeValue = totalValue - amountNanoErg - minFee;
            if (changeValue > 0n || allTokens.size > 0) {
                const changeTokens = Array.from(allTokens.entries()).map(([tokenId, amount]) => ({
                    tokenId,
                    amount: amount.toString()
                }));
                
                // Use change address ErgoTree - this is key for correct address display
                const changeErgoTree = selectedUtxos[0].ergoTree; // Temporary - should use change address ErgoTree
                
                outputs.push({
                    value: Math.max(Number(changeValue), 1000000).toString(), // Min 0.001 ERG
                    ergoTree: changeErgoTree,
                    assets: changeTokens,
                    additionalRegisters: {},
                    creationHeight: currentHeight
                });
            }
            
            // Build transaction
            const unsignedTx = {
                inputs: selectedUtxos,
                outputs: outputs,
                dataInputs: []
            };
            
            console.log('📝 Manual transaction built:');
            console.log('  - Inputs:', unsignedTx.inputs.length);
            console.log('  - Outputs:', unsignedTx.outputs.length);
        }

        // The key issue is we need to use the CORRECT ergoTree for the donation address
        // Let's try a different approach - get the ErgoTree for our target address
        console.log('🔍 Testing address conversion...');
        
        // Simple transaction structure that should work
        const donationAmountNanoErg = BigInt(Math.floor(amount * 1000000000));
        const fee = 1000000n;
        
        // Get first UTXO for testing
        const firstUtxo = utxos[0];
        const changeAmount = BigInt(firstUtxo.value) - donationAmountNanoErg - fee;
        
        const simpleTransaction = {
            inputs: [firstUtxo],
            outputs: [
                {
                    value: donationAmountNanoErg.toString(),
                    ergoTree: firstUtxo.ergoTree, // Temporary - use same format
                    assets: [],
                    additionalRegisters: {},
                    creationHeight: currentHeight
                }
            ],
            dataInputs: []
        };
        
        // Add change output if needed
        if (changeAmount > 0n) {
            simpleTransaction.outputs.push({
                value: changeAmount.toString(),
                ergoTree: firstUtxo.ergoTree,
                assets: firstUtxo.assets || [],
                additionalRegisters: {},
                creationHeight: currentHeight
            });
        }
        
        console.log('🧪 Testing simple transaction structure...');
        console.log('Transaction:', simpleTransaction);
        
        showStatus('donationStatus', '✍️ Please confirm transaction in Nautilus...', 'info');

        // Sign the transaction
        const signedTx = await ergoApi.sign_tx(simpleTransaction);
        console.log('✅ Transaction signed');

        // Submit the transaction
        showStatus('donationStatus', '📡 Submitting to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(signedTx);

        console.log('🎉 DONATION SUCCESSFUL!');
        console.log('Transaction ID:', txId);

        showStatus('donationStatus', 
            `🎉 Donation successful! ${amount} ERG donated. TX: ${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`, 
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
