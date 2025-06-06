// translations.js - Complete updated version with copy address and QR modal functionality

const translations = {
    en: {
        hero: {
            title: "Decentralized BIP39 Seed Cipher",
            subtitle: "Secure your seed phrases with XOR encryption. Code stored permanently on Ergo blockchain.",
            downloadBtn: "Download from Blockchain",
            learnBtn: "Learn More",
            feature1: "No Backend Required",
            feature2: "Blockchain Verified",
            feature3: "Open Source"
        },
        how: {
            title: "How SCypher Works",
            subtitle: "A simple yet powerful encryption system that transforms your BIP39 seed phrase into another valid BIP39 phrase",
            process: {
                title: "The Encryption Process",
                input1: "Your Original BIP39 Seed",
                input2: "Password",
                input3: "Iterations",
                encryption: "XOR Encryption with SHAKE-256",
                output: "Encrypted BIP39 Seed Phrase",
                decrypt: "To decrypt: Use the same password and iterations with the encrypted phrase to get back your original phrase."
            },
            advantages: {
                security: {
                    title: "Blockchain Security",
                    desc: "The decryption tool is permanently stored on Ergo blockchain. Cannot be altered, lost, or censored."
                },
                availability: {
                    title: "Always Available",
                    desc: "Download anytime from the blockchain. No central servers or third parties required."
                },
                deterministic: {
                    title: "Deterministic",
                    desc: "Same password and iterations always produce the same result. Fully predictable and reliable."
                }
            },
            tech: {
                title: "Technical Details",
                item1: "Pure XOR encryption maintains BIP39 validity",
                item2: "SHAKE-256 provides cryptographic security",
                item3: "Iterative key strengthening for enhanced protection",
                item4: "Memory-secure operations with sensitive data cleanup",
                item5: "Cross-platform Bash implementation"
            }
        },
        download: {
            title: "Download SCypher",
            subtitle: "Retrieve the cipher script directly from Ergo blockchain",
            blockchain: {
                title: "Download from Blockchain",
                desc: "Click below to fetch the script fragments from Ergo blockchain and reconstruct the original SCypherV2.sh.xz file",
                button: "Fetch from Blockchain"
            },
            info: {
                title: "What happens when you download?",
                step1: "Fetches token data from Ergo blockchain API",
                step2: "Combines base64 encoded fragments",
                step3: "Reconstructs the compressed XZ archive",
                step4: "Delivers the original SCypherV2.sh.xz file"
            },
            extraction: {
                title: "How to Extract SCypherV2.sh.xz",
                desc: "The downloaded file is compressed with XZ format. Extract using:",
                windows: "Use WinRAR, 7-Zip or similar",
                note: "This ensures maximum decentralization while maintaining small blockchain footprint."
            },
            transparency: {
                title: "Blockchain Transparency",
                desc: "Every download is completely transparent and verifiable:",
                item1: "All script fragments are publicly stored on Ergo blockchain",
                item2: "No central servers - direct blockchain access",
                item3: "Immutable storage ensures script integrity",
                item4: "Open source verification of the reconstruction process"
            },
            progress: {
                connecting: "Connecting to Ergo blockchain...",
                initializing: "Initializing decentralized download...",
                fetching: "Fetching script fragments from blockchain...",
                fragment: "Downloading fragment {current} of {total} from blockchain...",
                combining: "Combining base64 fragments...",
                reconstructing: "Reconstructing XZ archive...",
                preparing: "Preparing download...",
                success: "✅ Successfully downloaded SCypherV2.sh.xz from blockchain!",
                completed: "Download Completed",
                error: "Download failed",
                fetchError: "Failed to fetch fragment",
                noDescription: "Fragment has no description field",
                fragmentFailed: "Fragment download failed"
            },
            github: {
                SCypher: "SCypher Repository",
                web: "Website Repository"
            }
        },
        donate: {
            title: "Support Development",
            subtitle: "Help us maintain and improve SCypher with a secure donation",
            tokenSafe: "Token-Safe Donations",
            info: "Our donation system automatically preserves all tokens in your UTXOs. Your NFTs and tokens are completely safe.",
            detecting: "Detecting Nautilus Wallet...",
            walletReady: "Nautilus Wallet detected - Ready to connect",
            selectAmount: "Select donation amount (ERG):",
            address: "Donation Address:",
            connectBtn: "Connect Nautilus Wallet",
            donateBtn: "Donate",
            // NEW: Copy and QR functionality
            copyBtn: "Copy",
            qrBtn: "QR",
            copied: "Copied!",
            copyFailed: "Failed",
            qrModal: {
                title: "Donation QR Code",
                instructions: "Scan this QR code with your Ergo wallet to donate",
                copyAddress: "Copy Address",
                close: "Close"
            }
        },
        footer: {
            text: "Open source BIP39 seed cipher stored on Ergo blockchain"
        }
    },
    es: {
        hero: {
            title: "Cifrador BIP39 Descentralizado",
            subtitle: "Asegura tus frases semilla con cifrado XOR. Código almacenado permanentemente en la blockchain de Ergo.",
            downloadBtn: "Descargar desde Blockchain",
            learnBtn: "Saber Más",
            feature1: "Sin Backend Requerido",
            feature2: "Verificado en Blockchain",
            feature3: "Código Abierto"
        },
        how: {
            title: "Cómo Funciona SCypher",
            subtitle: "Un sistema de cifrado simple pero poderoso que transforma tu frase semilla BIP39 en otra frase BIP39 válida",
            process: {
                title: "El Proceso de Cifrado",
                input1: "Tu Frase Semilla BIP39 Original",
                input2: "Contraseña",
                input3: "Iteraciones",
                encryption: "Cifrado XOR con SHAKE-256",
                output: "Frase Semilla BIP39 Cifrada",
                decrypt: "Para descifrar: Usa la misma contraseña e iteraciones con la frase cifrada para recuperar tu frase original."
            },
            advantages: {
                security: {
                    title: "Seguridad Blockchain",
                    desc: "La herramienta de descifrado está permanentemente almacenada en la blockchain de Ergo. No puede ser alterada, perdida o censurada."
                },
                availability: {
                    title: "Siempre Disponible",
                    desc: "Descarga en cualquier momento desde la blockchain. No se requieren servidores centrales o terceros."
                },
                deterministic: {
                    title: "Determinístico",
                    desc: "La misma contraseña e iteraciones siempre producen el mismo resultado. Completamente predecible y confiable."
                }
            },
            tech: {
                title: "Detalles Técnicos",
                item1: "El cifrado XOR puro mantiene la validez BIP39",
                item2: "SHAKE-256 proporciona seguridad criptográfica",
                item3: "Fortalecimiento iterativo de clave para protección mejorada",
                item4: "Operaciones seguras en memoria con limpieza de datos sensibles",
                item5: "Implementación Bash multiplataforma"
            }
        },
        download: {
            title: "Descargar SCypher",
            subtitle: "Recupera el script cifrador directamente desde la blockchain de Ergo",
            blockchain: {
                title: "Descargar desde Blockchain",
                desc: "Haz clic abajo para obtener los fragmentos del script desde la blockchain de Ergo y reconstruir el archivo SCypherV2.sh.xz original",
                button: "Obtener desde Blockchain"
            },
            info: {
                title: "¿Qué sucede cuando descargas?",
                step1: "Obtiene datos de tokens desde la API de blockchain de Ergo",
                step2: "Combina fragmentos codificados en base64",
                step3: "Reconstruye el archivo comprimido XZ",
                step4: "Entrega el archivo SCypherV2.sh.xz original"
            },
            extraction: {
                title: "Cómo Extraer SCypherV2.sh.xz",
                desc: "El archivo descargado está comprimido en formato XZ. Extrae usando:",
                windows: "Usa WinRAR, 7-Zip o similar",
                note: "Esto asegura máxima descentralización manteniendo una pequeña huella en la blockchain."
            },
            transparency: {
                title: "Transparencia Blockchain",
                desc: "Cada descarga es completamente transparente y verificable:",
                item1: "Todos los fragmentos del script están almacenados públicamente en la blockchain de Ergo",
                item2: "Sin servidores centrales - acceso directo a blockchain",
                item3: "El almacenamiento inmutable asegura la integridad del script",
                item4: "Verificación de código abierto del proceso de reconstrucción"
            },
            progress: {
                connecting: "Conectando a la blockchain de Ergo...",
                initializing: "Inicializando descarga descentralizada...",
                fetching: "Obteniendo fragmentos del script desde la blockchain...",
                fragment: "Descargando fragmento {current} de {total} desde blockchain...",
                combining: "Combinando fragmentos base64...",
                reconstructing: "Reconstruyendo archivo XZ...",
                preparing: "Preparando descarga...",
                success: "✅ ¡SCypherV2.sh.xz descargado exitosamente desde blockchain!",
                completed: "Descarga Completada",
                error: "Error en la descarga",
                fetchError: "Error al descargar fragmento",
                noDescription: "El fragmento no tiene campo de descripción",
                fragmentFailed: "Falló la descarga del fragmento"
            },
            github: {
                SCypher: "Repositorio SCypher",
                web: "Repositorio del Sitio Web"
            }
        },
        donate: {
            title: "Apoyar el Desarrollo",
            subtitle: "Ayúdanos a mantener y mejorar SCypher con una donación segura",
            tokenSafe: "Donaciones Seguras para Tokens",
            info: "Nuestro sistema de donaciones preserva automáticamente todos los tokens en tus UTXOs. Tus NFTs y tokens están completamente seguros.",
            detecting: "Detectando Nautilus Wallet...",
            walletReady: "Nautilus Wallet detectada - Lista para conectar",
            selectAmount: "Selecciona el monto de donación (ERG):",
            address: "Dirección de Donación:",
            connectBtn: "Conectar Nautilus Wallet",
            donateBtn: "Donar",
            // NUEVO: Funcionalidad de copiar y QR
            copyBtn: "Copiar",
            qrBtn: "QR",
            copied: "¡Copiado!",
            copyFailed: "Error",
            qrModal: {
                title: "Código QR de Donación",
                instructions: "Escanea este código QR con tu billetera Ergo para donar",
                copyAddress: "Copiar Dirección",
                close: "Cerrar"
            }
        },
        footer: {
            text: "Cifrador BIP39 de código abierto almacenado en la blockchain de Ergo"
        }
    },
    zh: {
        hero: {
            title: "去中心化 BIP39 种子密码器",
            subtitle: "使用 XOR 加密保护您的种子短语。代码永久存储在 Ergo 区块链上。",
            downloadBtn: "从区块链下载",
            learnBtn: "了解更多",
            feature1: "无需后端",
            feature2: "区块链验证",
            feature3: "开源"
        },
        how: {
            title: "SCypher 如何工作",
            subtitle: "一个简单而强大的加密系统，将您的 BIP39 种子短语转换为另一个有效的 BIP39 短语",
            process: {
                title: "加密过程",
                input1: "您的原始 BIP39 种子",
                input2: "密码",
                input3: "迭代次数",
                encryption: "使用 SHAKE-256 的 XOR 加密",
                output: "加密的 BIP39 种子短语",
                decrypt: "解密：使用相同的密码和迭代次数与加密短语一起获取您的原始短语。"
            },
            advantages: {
                security: {
                    title: "区块链安全",
                    desc: "解密工具永久存储在 Ergo 区块链上。无法被更改、丢失或审查。"
                },
                availability: {
                    title: "始终可用",
                    desc: "随时从区块链下载。不需要中央服务器或第三方。"
                },
                deterministic: {
                    title: "确定性",
                    desc: "相同的密码和迭代次数总是产生相同的结果。完全可预测和可靠。"
                }
            },
            tech: {
                title: "技术细节",
                item1: "纯 XOR 加密保持 BIP39 有效性",
                item2: "SHAKE-256 提供密码学安全性",
                item3: "迭代密钥强化以增强保护",
                item4: "内存安全操作与敏感数据清理",
                item5: "跨平台 Bash 实现"
            }
        },
        download: {
            title: "下载 SCypher",
            subtitle: "直接从 Ergo 区块链检索密码脚本",
            blockchain: {
                title: "从区块链下载",
                desc: "点击下方从 Ergo 区块链获取脚本片段并重建原始 SCypherV2.sh.xz 文件",
                button: "从区块链获取"
            },
            info: {
                title: "下载时会发生什么？",
                step1: "从 Ergo 区块链 API 获取代币数据",
                step2: "组合 base64 编码的片段",
                step3: "重建压缩的 XZ 存档",
                step4: "交付原始 SCypherV2.sh.xz 文件"
            },
            extraction: {
                title: "如何提取 SCypherV2.sh.xz",
                desc: "下载的文件以 XZ 格式压缩。使用以下方式提取：",
                windows: "使用 WinRAR、7-Zip 或类似工具",
                note: "这确保了最大的去中心化，同时保持小的区块链足迹。"
            },
            transparency: {
                title: "区块链透明度",
                desc: "每次下载都是完全透明和可验证的：",
                item1: "所有脚本片段都公开存储在 Ergo 区块链上",
                item2: "无中央服务器 - 直接区块链访问",
                item3: "不可变存储确保脚本完整性",
                item4: "重建过程的开源验证"
            },
            progress: {
                connecting: "连接到 Ergo 区块链...",
                initializing: "初始化去中心化下载...",
                fetching: "从区块链获取脚本片段...",
                fragment: "从区块链下载片段 {current}/{total}...",
                combining: "组合 base64 片段...",
                reconstructing: "重建 XZ 存档...",
                preparing: "准备下载...",
                success: "✅ 成功从区块链下载 SCypherV2.sh.xz！",
                completed: "下载完成",
                error: "下载失败",
                fetchError: "获取片段失败",
                noDescription: "片段没有描述字段",
                fragmentFailed: "片段下载失败"
            },
            github: {
                SCypher: "SCypher 仓库",
                web: "网站仓库"
            }
        },
        donate: {
            title: "支持开发",
            subtitle: "通过安全捐赠帮助我们维护和改进 SCypher",
            tokenSafe: "代币安全捐赠",
            info: "我们的捐赠系统会自动保留您 UTXO 中的所有代币。您的 NFT 和代币完全安全。",
            detecting: "正在检测 Nautilus 钱包...",
            walletReady: "检测到 Nautilus 钱包 - 准备连接",
            selectAmount: "选择捐赠金额 (ERG)：",
            address: "捐赠地址：",
            connectBtn: "连接 Nautilus 钱包",
            donateBtn: "捐赠",
            // 新增：复制和二维码功能
            copyBtn: "复制",
            qrBtn: "二维码",
            copied: "已复制！",
            copyFailed: "失败",
            qrModal: {
                title: "捐赠二维码",
                instructions: "用您的 Ergo 钱包扫描此二维码进行捐赠",
                copyAddress: "复制地址",
                close: "关闭"
            }
        },
        footer: {
            text: "存储在 Ergo 区块链上的开源 BIP39 种子密码器"
        }
    },
    de: {
        hero: {
            title: "Dezentralisierter BIP39 Seed-Verschlüsseler",
            subtitle: "Sichern Sie Ihre Seed-Phrasen mit XOR-Verschlüsselung. Code dauerhaft auf der Ergo-Blockchain gespeichert.",
            downloadBtn: "Von Blockchain herunterladen",
            learnBtn: "Mehr erfahren",
            feature1: "Kein Backend erforderlich",
            feature2: "Blockchain-verifiziert",
            feature3: "Open Source"
        },
        how: {
            title: "Wie SCypher funktioniert",
            subtitle: "Ein einfaches aber mächtiges Verschlüsselungssystem, das Ihre BIP39-Seed-Phrase in eine andere gültige BIP39-Phrase umwandelt",
            process: {
                title: "Der Verschlüsselungsprozess",
                input1: "Ihre ursprüngliche BIP39-Seed",
                input2: "Passwort",
                input3: "Iterationen",
                encryption: "XOR-Verschlüsselung mit SHAKE-256",
                output: "Verschlüsselte BIP39-Seed-Phrase",
                decrypt: "Zum Entschlüsseln: Verwenden Sie dasselbe Passwort und Iterationen mit der verschlüsselten Phrase, um Ihre ursprüngliche Phrase zurückzubekommen."
            },
            advantages: {
                security: {
                    title: "Blockchain-Sicherheit",
                    desc: "Das Entschlüsselungswerkzeug ist dauerhaft auf der Ergo-Blockchain gespeichert. Kann nicht verändert, verloren oder zensiert werden."
                },
                availability: {
                    title: "Immer verfügbar",
                    desc: "Jederzeit von der Blockchain herunterladen. Keine zentralen Server oder Drittparteien erforderlich."
                },
                deterministic: {
                    title: "Deterministisch",
                    desc: "Gleiches Passwort und Iterationen erzeugen immer dasselbe Ergebnis. Vollständig vorhersagbar und zuverlässig."
                }
            },
            tech: {
                title: "Technische Details",
                item1: "Reine XOR-Verschlüsselung erhält BIP39-Gültigkeit",
                item2: "SHAKE-256 bietet kryptographische Sicherheit",
                item3: "Iterative Schlüsselverstärkung für verbesserten Schutz",
                item4: "Speichersichere Operationen mit Bereinigung sensibler Daten",
                item5: "Plattformübergreifende Bash-Implementierung"
            }
        },
        download: {
            title: "SCypher herunterladen",
            subtitle: "Rufen Sie das Verschlüsselungsskript direkt von der Ergo-Blockchain ab",
            blockchain: {
                title: "Von Blockchain herunterladen",
                desc: "Klicken Sie unten, um die Skriptfragmente von der Ergo-Blockchain abzurufen und die ursprüngliche SCypherV2.sh.xz-Datei zu rekonstruieren",
                button: "Von Blockchain abrufen"
            },
            info: {
                title: "Was passiert beim Download?",
                step1: "Ruft Token-Daten von der Ergo-Blockchain-API ab",
                step2: "Kombiniert base64-codierte Fragmente",
                step3: "Rekonstruiert das komprimierte XZ-Archiv",
                step4: "Liefert die ursprüngliche SCypherV2.sh.xz-Datei"
            },
            extraction: {
                title: "Wie man SCypherV2.sh.xz extrahiert",
                desc: "Die heruntergeladene Datei ist im XZ-Format komprimiert. Extrahieren mit:",
                windows: "Verwenden Sie WinRAR, 7-Zip oder ähnliches",
                note: "Dies gewährleistet maximale Dezentralisierung bei kleinem Blockchain-Fußabdruck."
            },
            transparency: {
                title: "Blockchain-Transparenz",
                desc: "Jeder Download ist vollständig transparent und überprüfbar:",
                item1: "Alle Skriptfragmente sind öffentlich auf der Ergo-Blockchain gespeichert",
                item2: "Keine zentralen Server - direkter Blockchain-Zugang",
                item3: "Unveränderlicher Speicher gewährleistet Skript-Integrität",
                item4: "Open-Source-Verifikation des Rekonstruktionsprozesses"
            },
            progress: {
                connecting: "Verbindung zur Ergo-Blockchain...",
                initializing: "Dezentraler Download wird initialisiert...",
                fetching: "Skriptfragmente von der Blockchain abrufen...",
                fragment: "Fragment {current} von {total} von der Blockchain herunterladen...",
                combining: "Base64-Fragmente kombinieren...",
                reconstructing: "XZ-Archiv rekonstruieren...",
                preparing: "Download vorbereiten...",
                success: "✅ SCypherV2.sh.xz erfolgreich von der Blockchain heruntergeladen!",
                completed: "Download abgeschlossen",
                error: "Download fehlgeschlagen",
                fetchError: "Fragment konnte nicht abgerufen werden",
                noDescription: "Fragment hat kein Beschreibungsfeld",
                fragmentFailed: "Fragment-Download fehlgeschlagen"
            },
            github: {
                SCypher: "SCypher-Repository",
                web: "Website-Repository"
            }
        },
        donate: {
            title: "Entwicklung unterstützen",
            subtitle: "Helfen Sie uns, SCypher mit einer sicheren Spende zu pflegen und zu verbessern",
            tokenSafe: "Token-sichere Spenden",
            info: "Unser Spendensystem bewahrt automatisch alle Token in Ihren UTXOs auf. Ihre NFTs und Token sind vollkommen sicher.",
            detecting: "Erkenne Nautilus Wallet...",
            walletReady: "Nautilus Wallet erkannt - Bereit zur Verbindung",
            selectAmount: "Spendenbetrag auswählen (ERG):",
            address: "Spendenadresse:",
            connectBtn: "Nautilus Wallet verbinden",
            donateBtn: "Spenden",
            // NEU: Kopieren und QR-Funktionalität
            copyBtn: "Kopieren",
            qrBtn: "QR",
            copied: "Kopiert!",
            copyFailed: "Fehler",
            qrModal: {
                title: "Spenden-QR-Code",
                instructions: "Scannen Sie diesen QR-Code mit Ihrer Ergo-Wallet zum Spenden",
                copyAddress: "Adresse kopieren",
                close: "Schließen"
            }
        },
        footer: {
            text: "Open-Source-BIP39-Seed-Verschlüsseler auf der Ergo-Blockchain gespeichert"
        }
    },
    ru: {
        hero: {
            title: "Децентрализованный шифратор BIP39",
            subtitle: "Защитите свои seed-фразы с помощью XOR-шифрования. Код постоянно хранится в блокчейне Ergo.",
            downloadBtn: "Скачать из блокчейна",
            learnBtn: "Узнать больше",
            feature1: "Не требует бэкенда",
            feature2: "Проверено блокчейном",
            feature3: "Открытый код"
        },
        how: {
            title: "Как работает SCypher",
            subtitle: "Простая, но мощная система шифрования, которая преобразует вашу BIP39 seed-фразу в другую действительную BIP39 фразу",
            process: {
                title: "Процесс шифрования",
                input1: "Ваша исходная BIP39 seed",
                input2: "Пароль",
                input3: "Итерации",
                encryption: "XOR-шифрование с SHAKE-256",
                output: "Зашифрованная BIP39 seed-фраза",
                decrypt: "Для расшифровки: Используйте тот же пароль и итерации с зашифрованной фразой, чтобы получить обратно вашу исходную фразу."
            },
            advantages: {
                security: {
                    title: "Безопасность блокчейна",
                    desc: "Инструмент расшифровки постоянно хранится в блокчейне Ergo. Не может быть изменен, потерян или подвергнут цензуре."
                },
                availability: {
                    title: "Всегда доступен",
                    desc: "Скачивайте в любое время из блокчейна. Не требуются центральные серверы или третьи стороны."
                },
                deterministic: {
                    title: "Детерминированный",
                    desc: "Одинаковый пароль и итерации всегда дают одинаковый результат. Полностью предсказуемо и надежно."
                }
            },
            tech: {
                title: "Технические детали",
                item1: "Чистое XOR-шифрование сохраняет действительность BIP39",
                item2: "SHAKE-256 обеспечивает криптографическую безопасность",
                item3: "Итеративное усиление ключа для улучшенной защиты",
                item4: "Безопасные операции с памятью и очисткой конфиденциальных данных",
                item5: "Кроссплатформенная реализация на Bash"
            }
        },
        download: {
            title: "Скачать SCypher",
            subtitle: "Получите скрипт шифратора напрямую из блокчейна Ergo",
            blockchain: {
                title: "Скачать из блокчейна",
                desc: "Нажмите ниже, чтобы получить фрагменты скрипта из блокчейна Ergo и восстановить исходный файл SCypherV2.sh.xz",
                button: "Получить из блокчейна"
            },
            info: {
                title: "Что происходит при загрузке?",
                step1: "Получает данные токенов из API блокчейна Ergo",
                step2: "Объединяет фрагменты, закодированные в base64",
                step3: "Восстанавливает сжатый XZ-архив",
                step4: "Доставляет исходный файл SCypherV2.sh.xz"
            },
            extraction: {
                title: "Как извлечь SCypherV2.sh.xz",
                desc: "Загруженный файл сжат в формате XZ. Извлеките с помощью:",
                windows: "Используйте WinRAR, 7-Zip или аналогичное",
                note: "Это обеспечивает максимальную децентрализацию при сохранении небольшого следа в блокчейне."
            },
            transparency: {
                title: "Прозрачность блокчейна",
                desc: "Каждая загрузка полностью прозрачна и проверяема:",
                item1: "Все фрагменты скрипта публично хранятся в блокчейне Ergo",
                item2: "Без центральных серверов - прямой доступ к блокчейну",
                item3: "Неизменяемое хранение обеспечивает целостность скрипта",
                item4: "Проверка с открытым исходным кодом процесса восстановления"
            },
            progress: {
                connecting: "Подключение к блокчейну Ergo...",
                initializing: "Инициализация децентрализованной загрузки...",
                fetching: "Получение фрагментов скрипта из блокчейна...",
                fragment: "Загрузка фрагмента {current} из {total} из блокчейна...",
                combining: "Объединение base64 фрагментов...",
                reconstructing: "Восстановление XZ-архива...",
                preparing: "Подготовка загрузки...",
                success: "✅ SCypherV2.sh.xz успешно загружен из блокчейна!",
                completed: "Загрузка завершена",
                error: "Ошибка загрузки",
                fetchError: "Не удалось получить фрагмент",
                noDescription: "У фрагмента нет поля описания",
                fragmentFailed: "Загрузка фрагмента не удалась"
            },
            github: {
                SCypher: "Репозиторий SCypher",
                web: "Репозиторий веб-сайта"
            }
        },
        donate: {
            title: "Поддержать разработку",
            subtitle: "Помогите нам поддерживать и улучшать SCypher безопасным пожертвованием",
            tokenSafe: "Безопасные для токенов пожертвования",
            info: "Наша система пожертвований автоматически сохраняет все токены в ваших UTXO. Ваши NFT и токены полностью безопасны.",
            detecting: "Обнаружение кошелька Nautilus...",
            walletReady: "Кошелек Nautilus обнаружен - Готов к подключению",
            selectAmount: "Выберите сумму пожертвования (ERG):",
            address: "Адрес для пожертвований:",
            connectBtn: "Подключить кошелек Nautilus",
            donateBtn: "Пожертвовать",
            // НОВОЕ: Функциональность копирования и QR
            copyBtn: "Копировать",
            qrBtn: "QR",
            copied: "Скопировано!",
            copyFailed: "Ошибка",
            qrModal: {
                title: "QR-код для пожертвований",
                instructions: "Отсканируйте этот QR-код вашим кошельком Ergo для пожертвования",
                copyAddress: "Копировать адрес",
                close: "Закрыть"
            }
        },
        footer: {
            text: "Шифратор BIP39 с открытым кодом, хранящийся в блокчейне Ergo"
        }
    }
};

// Make translations available globally
if (typeof window !== 'undefined') {
    window.translations = translations;

    // Global function to get translations
    window.getTranslation = function(keyPath) {
        const currentLang = localStorage.getItem('SCypher-lang') || 'en';
        const keys = keyPath.split('.');
        let value = translations[currentLang];

        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                // Fallback to English
                value = translations.en;
                for (const k of keys) {
                    if (value && value[k]) {
                        value = value[k];
                    } else {
                        return keyPath; // Return key if translation not found
                    }
                }
                break;
            }
        }

        return value;
    };
}
