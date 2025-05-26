// donation.js - EXACT COPY from working donaciones.html logic

// Configuration - EXACT same as donaciones.html
const DONATION_ADDRESS = "9fRAWhdxEsTcdb8PhGvvPGwH9yDzGJYWeNksf6uEaFnWLKjKj9h"; // BACK TO ORIGINAL
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
            console.log('Selected amount:', selectedAmount, 'ERG');
        });
    });

    if (customAmount) {
        customAmount.addEventListener('input', function() {
            selectedAmount = parseFloat(this.value) || 0;
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
        donateBtn.addEventListener('click', createDonationWithTokenPreservation);
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
            console.log(`Attempt ${attempts}: Checking for ergoConnector...`);

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
        console.log('Connection result:', connectionResult);

        if (connectionResult === true) {
            ergoApi = window.ergo;
            if (!ergoApi) {
                throw new Error('Ergo API context not available');
            }

            console.log('✅ API context obtained');

            const balance = await ergoApi.get_balance();
            const balanceERG = Number(BigInt(balance) / NANOERGS_PER_ERG);

            console.log('Wallet balance:', balanceERG, 'ERG');

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

// EXACT COPY of the working function from donaciones.html
async function createDonationWithTokenPreservation() {
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
        donateBtn.innerHTML = '<div class="loading"></div> Building secure transaction...';
        donateBtn.disabled = true;
        
        console.log('🚀 === INICIANDO DONACIÓN CON PRESERVACIÓN DE TOKENS ===');
        console.log('💰 Monto a donar:', `${amount} ERG`);
        showStatus('donationStatus', '⚡ Building transaction that preserves all tokens...', 'info');
        
        // 1. Obtener parámetros básicos
        const currentHeight = await ergoApi.get_current_height();
        const changeAddress = await ergoApi.get_change_address();
        
        // 2. Calcular montos
        const donationNanoERGs = BigInt(Math.floor(amount * 1000000000));
        const feeNanoERGs = 1000000n; // 0.001 ERG
        const totalNeededNanoERGs = donationNanoERGs + feeNanoERGs;
        
        console.log('📊 Cálculos:', {
            donacion: `${amount} ERG (${donationNanoERGs.toString()} nanoERG)`,
            fee: `0.001 ERG (${feeNanoERGs.toString()} nanoERG)`,
            total: `${Number(totalNeededNanoERGs) / 1000000000} ERG`
        });
        
        // 3. Obtener UTXOs que cubran el monto necesario
        const availableUtxos = await ergoApi.get_utxos();
        if (!availableUtxos || availableUtxos.length === 0) {
            throw new Error('No UTXOs available in your wallet');
        }
        
        console.log('📦 UTXOs disponibles:', availableUtxos.length);
        
        // 4. Seleccionar UTXOs y recopilar tokens
        let selectedUtxos = [];
        let totalInputValue = 0n;
        const tokenRegistry = new Map(); // tokenId -> cantidad total
        
        for (const utxo of availableUtxos) {
            selectedUtxos.push(utxo);
            totalInputValue += BigInt(utxo.value);
            
            // Recopilar tokens de este UTXO
            if (utxo.assets && Array.isArray(utxo.assets)) {
                for (const token of utxo.assets) {
                    const existingAmount = tokenRegistry.get(token.tokenId) || 0n;
                    tokenRegistry.set(token.tokenId, existingAmount + BigInt(token.amount));
                }
            }
            
            // Parar cuando tengamos suficiente ERG
            if (totalInputValue >= totalNeededNanoERGs) {
                break;
            }
        }
        
        if (totalInputValue < totalNeededNanoERGs) {
            throw new Error(`Insufficient funds. Need ${Number(totalNeededNanoERGs) / 1000000000} ERG but only have ${Number(totalInputValue) / 1000000000} ERG`);
        }
        
        console.log('🔍 Análisis de inputs:', {
            utxosSeleccionados: selectedUtxos.length,
            ergTotal: `${Number(totalInputValue) / 1000000000} ERG`,
            tiposDeTokens: tokenRegistry.size,
            listaTokens: Array.from(tokenRegistry.entries()).map(([id, amt]) => 
                `${id.substring(0, 8)}... (${amt.toString()})`
            )
        });
        
        // 5. Construir outputs
        const outputs = [];
        
        // Output 1: Donación (solo ERG, SIN tokens) - EXACT SAME ErgoTree as donaciones.html
        outputs.push({
            value: donationNanoERGs.toString(),
            ergoTree: "0008cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d", // EXACT SAME as donaciones.html
            assets: [], // ¡IMPORTANTE! Sin tokens en la donación
            additionalRegisters: {},
            creationHeight: currentHeight
        });
        
        // Output 2: Cambio (ERG restante + TODOS los tokens)
        const changeValue = totalInputValue - donationNanoERGs - feeNanoERGs;
        
        if (changeValue > 0n || tokenRegistry.size > 0) {
            // ¡CRÍTICO! Usar el ErgoTree del primer UTXO de entrada
            // Esto garantiza que los tokens regresen a tu billetera correctamente
            const changeErgoTree = selectedUtxos[0].ergoTree;
            
            // Convertir tokens del registry a formato de salida
            const tokensParaCambio = Array.from(tokenRegistry.entries()).map(([tokenId, cantidad]) => ({
                tokenId: tokenId,
                amount: cantidad.toString()
            }));
            
            // Asegurar monto mínimo para boxes con tokens
            const finalChangeValue = changeValue > 0n ? changeValue : 1000000n; // Mínimo 0.001 ERG
            
            outputs.push({
                value: finalChangeValue.toString(),
                ergoTree: changeErgoTree, // ¡MISMO ERGOTREE QUE LOS INPUTS!
                assets: tokensParaCambio, // ¡TODOS LOS TOKENS AQUÍ!
                additionalRegisters: {},
                creationHeight: currentHeight
            });
            
            console.log('✅ Output de cambio creado:', {
                erg: `${Number(finalChangeValue) / 1000000000} ERG`,
                tokens: tokensParaCambio.length,
                ergoTreeMatch: changeErgoTree === selectedUtxos[0].ergoTree ? 'SÍ' : 'NO'
            });
        }
        
        // 6. Construir transacción final - EXACT SAME structure as donaciones.html
        const transaccionSinFirmar = {
            inputs: selectedUtxos,
            outputs: outputs,
            dataInputs: []
        };
        
        console.log('📝 Transacción construida:', {
            inputs: transaccionSinFirmar.inputs.length,
            outputs: transaccionSinFirmar.outputs.length,
            tokensPreservados: tokenRegistry.size,
            resumen: `${amount} ERG donados, ${tokenRegistry.size} tipos de tokens preservados`
        });
        
        showStatus('donationStatus', '🛡️ Transaction ready - All tokens preserved. Please confirm in Nautilus.', 'info');
        
        // 7. Firmar transacción
        console.log('✍️ Solicitando firma...');
        const transaccionFirmada = await ergoApi.sign_tx(transaccionSinFirmar);
        console.log('✅ Transacción firmada exitosamente');
        
        // 8. Enviar transacción
        showStatus('donationStatus', '📡 Submitting transaction to blockchain...', 'info');
        const txId = await ergoApi.submit_tx(transaccionFirmada);
        
        console.log('🎉 ¡DONACIÓN COMPLETADA!', {
            transactionId: txId,
            donado: `${amount} ERG`,
            tokensPreservados: tokenRegistry.size
        });
        
        showStatus('donationStatus', `🎉 Donation successful! ${amount} ERG donated, ${tokenRegistry.size} tokens preserved. TX: ${txId}`, 'success');
        
        // Limpiar formulario
        selectedAmount = 0;
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) customAmountInput.value = '';
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        showStatus('donationStatus', `❌ Error: ${error.message}`, 'error');
    } finally {
        donateBtn.innerHTML = originalText;
        donateBtn.disabled = false;
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
            }, 10000);
        }
    } else {
        console.log(`Status (${type}):`, message);
    }
}

// Utility function to get translations
function getTranslation(key) {
    try {
        if (typeof window !== 'undefined' && typeof window.getTranslation === 'function') {
            return window.getTranslation(key);
        }
    } catch (e) {
        // Ignore errors and use fallback
    }

    const fallbacks = {
        'donate.walletReady': 'Nautilus Wallet detected - Ready to connect',
        'donate.connectBtn': 'Connect Nautilus Wallet',
        'donate.detecting': 'Detecting Nautilus Wallet...',
        'donate.donateBtn': 'Make Secure Donation'
    };

    return fallbacks[key] || key;
}
