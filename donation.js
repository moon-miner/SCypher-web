// donation.js - Token-safe donation functionality using Nautilus Wallet

// Configuration
const DONATION_ADDRESS = "9fRAWhdxEsTcdb8PhGvvPGwH9yDzGJYWeNksf6uEaFnWLKjKj9h";
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
            customAmount.value = selectedAmount;
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
    const statusText = document.querySelector('.wallet-status .status-text');
    const connectBtn = document.getElementById('connectWalletBtn');

    // Wait for Nautilus to be injected
    let attempts = 0;
    const maxAttempts = 20;

    const checkNautilus = async () => {
        if (window.ergoConnector && window.ergoConnector.nautilus) {
            nautilusConnector = window.ergoConnector.nautilus;
            statusText.textContent = getTranslation('donate.walletReady') || 'Nautilus Wallet detected';
            connectBtn.disabled = false;
            connectBtn.textContent = getTranslation('donate.connectBtn');
            document.getElementById('walletStatus').classList.remove('error');
            return true;
        }

        attempts++;
        if (attempts < maxAttempts) {
            setTimeout(checkNautilus, 100);
        } else {
            statusText.textContent = 'Nautilus Wallet not found. Please install it.';
            connectBtn.textContent = 'Install Nautilus Wallet';
            connectBtn.disabled = false;
            connectBtn.onclick = () => {
                window.open('https://chromewebstore.google.com/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjcchai', '_blank');
            };
            document.getElementById('walletStatus').classList.add('error');
        }
    };

    checkNautilus();
}

// Connect to Nautilus Wallet
async function connectWallet() {
    const connectBtn = document.getElementById('connectWalletBtn');
    const originalText = connectBtn.textContent;

    try {
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<div class="loading"></div> Connecting...';

        if (!nautilusConnector) {
            throw new Error('Nautilus connector not available');
        }

        // Request connection
        const connected = await nautilusConnector.connect();

        if (connected) {
            // Get API context
            ergoApi = await nautilusConnector.getContext();

            // Get wallet info
            const balance = await ergoApi.get_balance();
            const balanceERG = Number(BigInt(balance) / NANOERGS_PER_ERG);

            // Update UI
            isWalletConnected = true;
            document.getElementById('walletStatus').classList.add('connected');
            document.querySelector('.wallet-status .status-text').textContent =
                `Connected - Balance: ${balanceERG.toFixed(3)} ERG`;

            connectBtn.textContent = '✓ Wallet Connected';
            connectBtn.disabled = true;

            document.getElementById('donateBtn').disabled = false;

            showStatus('donationStatus', 'Wallet connected successfully!', 'success');
        } else {
            throw new Error('Connection rejected by user');
        }

    } catch (error) {
        console.error('Wallet connection error:', error);
        showStatus('donationStatus', `Connection failed: ${error.message}`, 'error');
        connectBtn.disabled = false;
        connectBtn.textContent = originalText;
    }
}

// Make token-safe donation
async function makeDonation() {
    if (!isWalletConnected || !ergoApi) {
        showStatus('donationStatus', 'Please connect your wallet first', 'error');
        return;
    }

    const amount = selectedAmount || parseFloat(document.getElementById('customAmount').value);
    if (!amount || amount <= 0) {
        showStatus('donationStatus', 'Please enter a valid donation amount', 'error');
        return;
    }

    const donateBtn = document.getElementById('donateBtn');
    const originalText = donateBtn.innerHTML;

    try {
        donateBtn.disabled = true;
        donateBtn.innerHTML = '<div class="loading"></div> Building transaction...';
        showStatus('donationStatus', 'Building token-safe transaction...', 'info');

        // Build transaction using fleet-sdk for token preservation
        const tx = await buildTokenSafeDonation(amount);

        // Sign transaction
        showStatus('donationStatus', 'Please confirm in Nautilus Wallet...', 'info');
        const signedTx = await ergoApi.sign_tx(tx);

        // Submit transaction
        showStatus('donationStatus', 'Submitting transaction...', 'info');
        const txId = await ergoApi.submit_tx(signedTx);

        // Success!
        showStatus('donationStatus',
            `✅ Donation successful! TX ID: ${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`,
            'success'
        );

        // Reset form
        selectedAmount = 0;
        document.getElementById('customAmount').value = '';
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));

    } catch (error) {
        console.error('Donation error:', error);
        showStatus('donationStatus', `Transaction failed: ${error.message}`, 'error');
    } finally {
        donateBtn.disabled = false;
        donateBtn.innerHTML = originalText;
    }
}

// Build token-safe donation transaction
async function buildTokenSafeDonation(amountERG) {
    // Get current height
    const currentHeight = await ergoApi.get_current_height();

    // Get UTXOs
    const utxos = await ergoApi.get_utxos();
    if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available');
    }

    // Calculate amounts
    const donationNanoERGs = BigInt(Math.floor(amountERG * 1000000000));
    const feeNanoERGs = 1000000n; // 0.001 ERG fee
    const totalNeeded = donationNanoERGs + feeNanoERGs;

    // Select UTXOs and collect tokens
    const selectedUtxos = [];
    let totalInputValue = 0n;
    const tokenMap = new Map(); // tokenId -> total amount

    for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        totalInputValue += BigInt(utxo.value);

        // Collect tokens
        if (utxo.assets && Array.isArray(utxo.assets)) {
            for (const token of utxo.assets) {
                const existing = tokenMap.get(token.tokenId) || 0n;
                tokenMap.set(token.tokenId, existing + BigInt(token.amount));
            }
        }

        // Stop when we have enough
        if (totalInputValue >= totalNeeded) {
            break;
        }
    }

    if (totalInputValue < totalNeeded) {
        throw new Error(`Insufficient funds. Need ${Number(totalNeeded) / 1000000000} ERG`);
    }

    // Build outputs
    const outputs = [];

    // Output 1: Donation (ERG only, NO tokens)
    outputs.push({
        value: donationNanoERGs.toString(),
        ergoTree: "0008cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d", // Fixed ErgoTree for donation address
        assets: [], // No tokens in donation!
        additionalRegisters: {},
        creationHeight: currentHeight
    });

    // Output 2: Change (remaining ERG + ALL tokens)
    const changeValue = totalInputValue - donationNanoERGs - feeNanoERGs;

    if (changeValue > 0n || tokenMap.size > 0) {
        // Use ErgoTree from first input to ensure tokens return to wallet
        const changeErgoTree = selectedUtxos[0].ergoTree;

        // Convert token map to array
        const changeTokens = Array.from(tokenMap.entries()).map(([tokenId, amount]) => ({
            tokenId: tokenId,
            amount: amount.toString()
        }));

        // Ensure minimum value for token box
        const minChangeValue = changeValue > 0n ? changeValue : 1000000n; // Min 0.001 ERG

        outputs.push({
            value: minChangeValue.toString(),
            ergoTree: changeErgoTree,
            assets: changeTokens, // All tokens preserved here!
            additionalRegisters: {},
            creationHeight: currentHeight
        });
    }

    // Build final transaction
    return {
        inputs: selectedUtxos,
        outputs: outputs,
        dataInputs: []
    };
}
