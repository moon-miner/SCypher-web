// translations.js - Multi-language support for Scypher

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
            title: "How Scypher Works",
            subtitle: "A revolutionary approach to seed phrase security using XOR encryption and blockchain storage",
            step1: {
                title: "XOR Encryption",
                desc: "Your BIP39 seed phrase is encrypted using XOR cipher with SHAKE-256 key derivation"
            },
            step2: {
                title: "Blockchain Storage",
                desc: "The cipher code is split, encoded, and stored as token descriptions on Ergo blockchain"
            },
            step3: {
                title: "Decentralized Access",
                desc: "Retrieve the complete script anytime from the blockchain - no servers needed"
            },
            step4: {
                title: "Local Execution",
                desc: "Run the script locally on your machine for maximum security and privacy"
            },
            tech: {
                title: "Technical Details",
                item1: "✓ Pure Bash implementation - no external dependencies",
                item2: "✓ BIP39 checksum validation and preservation",
                item3: "✓ Iterative key strengthening for enhanced security",
                item4: "✓ Memory-secure operations with sensitive data cleanup"
            }
        },
        download: {
            title: "Download Scypher",
            subtitle: "Retrieve the cipher script directly from Ergo blockchain",
            blockchain: {
                title: "Download from Blockchain",
                desc: "Click below to fetch the script fragments from Ergo blockchain and reconstruct the original scypher.sh file",
                button: "Fetch from Blockchain"
            },
            info: {
                title: "What happens when you download?",
                step1: "Fetches token data from Ergo blockchain API",
                step2: "Combines base64 encoded fragments",
                step3: "Decodes and decompresses the data",
                step4: "Delivers the original scypher.sh script"
            },
            github: {
                scypher: "Scypher Repository",
                web: "Website Repository"
            }
        },
        donate: {
            title: "Support Development",
            subtitle: "Help us maintain and improve Scypher with a secure donation",
            tokenSafe: "Token-Safe Donations",
            info: "Our donation system automatically preserves all tokens in your UTXOs. Your NFTs and tokens are completely safe.",
            detecting: "Detecting Nautilus Wallet...",
            walletReady: "Nautilus Wallet detected - Ready to connect",
            selectAmount: "Select donation amount (ERG):",
            address: "Donation Address:",
            connectBtn: "Connect Nautilus Wallet",
            donateBtn: "Make Secure Donation"
        },
        contact: {
            title: "Contact & Resources",
            community: "Community",
            communityDesc: "Join our community for support and discussions",
            development: "Development",
            developmentDesc: "Contribute to the project or report issues",
            security: "Security",
            securityDesc: "Report security vulnerabilities responsibly"
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
            title: "Cómo Funciona Scypher",
            subtitle: "Un enfoque revolucionario para la seguridad de frases semilla usando cifrado XOR y almacenamiento blockchain",
            step1: {
                title: "Cifrado XOR",
                desc: "Tu frase semilla BIP39 se cifra usando cifrado XOR con derivación de clave SHAKE-256"
            },
            step2: {
                title: "Almacenamiento Blockchain",
                desc: "El código cifrador se divide, codifica y almacena como descripciones de tokens en la blockchain de Ergo"
            },
            step3: {
                title: "Acceso Descentralizado",
                desc: "Recupera el script completo en cualquier momento desde la blockchain - sin servidores"
            },
            step4: {
                title: "Ejecución Local",
                desc: "Ejecuta el script localmente en tu máquina para máxima seguridad y privacidad"
            },
            tech: {
                title: "Detalles Técnicos",
                item1: "✓ Implementación pura en Bash - sin dependencias externas",
                item2: "✓ Validación y preservación de checksum BIP39",
                item3: "✓ Fortalecimiento iterativo de clave para mayor seguridad",
                item4: "✓ Operaciones seguras en memoria con limpieza de datos sensibles"
            }
        },
        download: {
            title: "Descargar Scypher",
            subtitle: "Recupera el script cifrador directamente desde la blockchain de Ergo",
            blockchain: {
                title: "Descargar desde Blockchain",
                desc: "Haz clic abajo para obtener los fragmentos del script desde la blockchain de Ergo y reconstruir el archivo scypher.sh original",
                button: "Obtener desde Blockchain"
            },
            info: {
                title: "¿Qué sucede cuando descargas?",
                step1: "Obtiene datos de tokens desde la API de blockchain de Ergo",
                step2: "Combina fragmentos codificados en base64",
                step3: "Decodifica y descomprime los datos",
                step4: "Entrega el script scypher.sh original"
            },
            github: {
                scypher: "Repositorio Scypher",
                web: "Repositorio del Sitio Web"
            }
        },
        donate: {
            title: "Apoyar el Desarrollo",
            subtitle: "Ayúdanos a mantener y mejorar Scypher con una donación segura",
            tokenSafe: "Donaciones Seguras para Tokens",
            info: "Nuestro sistema de donaciones preserva automáticamente todos los tokens en tus UTXOs. Tus NFTs y tokens están completamente seguros.",
            detecting: "Detectando Nautilus Wallet...",
            walletReady: "Nautilus Wallet detectada - Lista para conectar",
            selectAmount: "Selecciona el monto de donación (ERG):",
            address: "Dirección de Donación:",
            connectBtn: "Conectar Nautilus Wallet",
            donateBtn: "Realizar Donación Segura"
        },
        contact: {
            title: "Contacto y Recursos",
            community: "Comunidad",
            communityDesc: "Únete a nuestra comunidad para soporte y discusiones",
            development: "Desarrollo",
            developmentDesc: "Contribuye al proyecto o reporta problemas",
            security: "Seguridad",
            securityDesc: "Reporta vulnerabilidades de seguridad responsablemente"
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
            title: "Scypher 如何工作",
            subtitle: "使用 XOR 加密和区块链存储的革命性种子短语安全方法",
            step1: {
                title: "XOR 加密",
                desc: "您的 BIP39 种子短语使用带有 SHAKE-256 密钥派生的 XOR 密码进行加密"
            },
            step2: {
                title: "区块链存储",
                desc: "密码代码被分割、编码并作为代币描述存储在 Ergo 区块链上"
            },
            step3: {
                title: "去中心化访问",
                desc: "随时从区块链检索完整脚本 - 无需服务器"
            },
            step4: {
                title: "本地执行",
                desc: "在您的机器上本地运行脚本以获得最大的安全性和隐私性"
            },
            tech: {
                title: "技术细节",
                item1: "✓ 纯 Bash 实现 - 无外部依赖",
                item2: "✓ BIP39 校验和验证和保留",
                item3: "✓ 迭代密钥强化以增强安全性",
                item4: "✓ 内存安全操作与敏感数据清理"
            }
        },
        download: {
            title: "下载 Scypher",
            subtitle: "直接从 Ergo 区块链检索密码脚本",
            blockchain: {
                title: "从区块链下载",
                desc: "点击下方从 Ergo 区块链获取脚本片段并重建原始 scypher.sh 文件",
                button: "从区块链获取"
            },
            info: {
                title: "下载时会发生什么？",
                step1: "从 Ergo 区块链 API 获取代币数据",
                step2: "组合 base64 编码的片段",
                step3: "解码并解压缩数据",
                step4: "交付原始 scypher.sh 脚本"
            },
            github: {
                scypher: "Scypher 仓库",
                web: "网站仓库"
            }
        },
        donate: {
            title: "支持开发",
            subtitle: "通过安全捐赠帮助我们维护和改进 Scypher",
            tokenSafe: "代币安全捐赠",
            info: "我们的捐赠系统会自动保留您 UTXO 中的所有代币。您的 NFT 和代币完全安全。",
            detecting: "正在检测 Nautilus 钱包...",
            walletReady: "检测到 Nautilus 钱包 - 准备连接",
            selectAmount: "选择捐赠金额 (ERG)：",
            address: "捐赠地址：",
            connectBtn: "连接 Nautilus 钱包",
            donateBtn: "进行安全捐赠"
        },
        contact: {
            title: "联系与资源",
            community: "社区",
            communityDesc: "加入我们的社区获取支持和讨论",
            development: "开发",
            developmentDesc: "为项目做贡献或报告问题",
            security: "安全",
            securityDesc: "负责任地报告安全漏洞"
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
            title: "Wie Scypher funktioniert",
            subtitle: "Ein revolutionärer Ansatz zur Seed-Phrasen-Sicherheit mit XOR-Verschlüsselung und Blockchain-Speicherung",
            step1: {
                title: "XOR-Verschlüsselung",
                desc: "Ihre BIP39-Seed-Phrase wird mit XOR-Verschlüsselung und SHAKE-256-Schlüsselableitung verschlüsselt"
            },
            step2: {
                title: "Blockchain-Speicherung",
                desc: "Der Verschlüsselungscode wird aufgeteilt, codiert und als Token-Beschreibungen auf der Ergo-Blockchain gespeichert"
            },
            step3: {
                title: "Dezentraler Zugriff",
                desc: "Rufen Sie das vollständige Skript jederzeit von der Blockchain ab - keine Server erforderlich"
            },
            step4: {
                title: "Lokale Ausführung",
                desc: "Führen Sie das Skript lokal auf Ihrem Computer aus für maximale Sicherheit und Privatsphäre"
            },
            tech: {
                title: "Technische Details",
                item1: "✓ Reine Bash-Implementierung - keine externen Abhängigkeiten",
                item2: "✓ BIP39-Prüfsummenvalidierung und -erhaltung",
                item3: "✓ Iterative Schlüsselverstärkung für erhöhte Sicherheit",
                item4: "✓ Speichersichere Operationen mit Bereinigung sensibler Daten"
            }
        },
        download: {
            title: "Scypher herunterladen",
            subtitle: "Rufen Sie das Verschlüsselungsskript direkt von der Ergo-Blockchain ab",
            blockchain: {
                title: "Von Blockchain herunterladen",
                desc: "Klicken Sie unten, um die Skriptfragmente von der Ergo-Blockchain abzurufen und die ursprüngliche scypher.sh-Datei zu rekonstruieren",
                button: "Von Blockchain abrufen"
            },
            info: {
                title: "Was passiert beim Download?",
                step1: "Ruft Token-Daten von der Ergo-Blockchain-API ab",
                step2: "Kombiniert base64-codierte Fragmente",
                step3: "Dekodiert und dekomprimiert die Daten",
                step4: "Liefert das ursprüngliche scypher.sh-Skript"
            },
            github: {
                scypher: "Scypher-Repository",
                web: "Website-Repository"
            }
        },
        donate: {
            title: "Entwicklung unterstützen",
            subtitle: "Helfen Sie uns, Scypher mit einer sicheren Spende zu pflegen und zu verbessern",
            tokenSafe: "Token-sichere Spenden",
            info: "Unser Spendensystem bewahrt automatisch alle Token in Ihren UTXOs auf. Ihre NFTs und Token sind vollkommen sicher.",
            detecting: "Erkenne Nautilus Wallet...",
            walletReady: "Nautilus Wallet erkannt - Bereit zur Verbindung",
            selectAmount: "Spendenbetrag auswählen (ERG):",
            address: "Spendenadresse:",
            connectBtn: "Nautilus Wallet verbinden",
            donateBtn: "Sichere Spende durchführen"
        },
        contact: {
            title: "Kontakt & Ressourcen",
            community: "Gemeinschaft",
            communityDesc: "Treten Sie unserer Community für Unterstützung und Diskussionen bei",
            development: "Entwicklung",
            developmentDesc: "Tragen Sie zum Projekt bei oder melden Sie Probleme",
            security: "Sicherheit",
            securityDesc: "Melden Sie Sicherheitslücken verantwortungsvoll"
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
            title: "Как работает Scypher",
            subtitle: "Революционный подход к безопасности seed-фраз с использованием XOR-шифрования и хранения в блокчейне",
            step1: {
                title: "XOR-шифрование",
                desc: "Ваша BIP39 seed-фраза шифруется с помощью XOR-шифра с выводом ключа SHAKE-256"
            },
            step2: {
                title: "Хранение в блокчейне",
                desc: "Код шифратора разделяется, кодируется и сохраняется как описания токенов в блокчейне Ergo"
            },
            step3: {
                title: "Децентрализованный доступ",
                desc: "Получите полный скрипт в любое время из блокчейна - серверы не нужны"
            },
            step4: {
                title: "Локальное выполнение",
                desc: "Запустите скрипт локально на вашем компьютере для максимальной безопасности и конфиденциальности"
            },
            tech: {
                title: "Технические детали",
                item1: "✓ Чистая реализация на Bash - без внешних зависимостей",
                item2: "✓ Валидация и сохранение контрольной суммы BIP39",
                item3: "✓ Итеративное усиление ключа для повышенной безопасности",
                item4: "✓ Безопасные операции с памятью и очистка конфиденциальных данных"
            }
        },
        download: {
            title: "Скачать Scypher",
            subtitle: "Получите скрипт шифратора напрямую из блокчейна Ergo",
            blockchain: {
                title: "Скачать из блокчейна",
                desc: "Нажмите ниже, чтобы получить фрагменты скрипта из блокчейна Ergo и восстановить исходный файл scypher.sh",
                button: "Получить из блокчейна"
            },
            info: {
                title: "Что происходит при загрузке?",
                step1: "Получает данные токенов из API блокчейна Ergo",
                step2: "Объединяет фрагменты, закодированные в base64",
                step3: "Декодирует и распаковывает данные",
                step4: "Предоставляет исходный скрипт scypher.sh"
            },
            github: {
                scypher: "Репозиторий Scypher",
                web: "Репозиторий веб-сайта"
            }
        },
        donate: {
            title: "Поддержать разработку",
            subtitle: "Помогите нам поддерживать и улучшать Scypher безопасным пожертвованием",
            tokenSafe: "Безопасные для токенов пожертвования",
            info: "Наша система пожертвований автоматически сохраняет все токены в ваших UTXO. Ваши NFT и токены полностью безопасны.",
            detecting: "Обнаружение кошелька Nautilus...",
            walletReady: "Кошелек Nautilus обнаружен - Готов к подключению",
            selectAmount: "Выберите сумму пожертвования (ERG):",
            address: "Адрес для пожертвований:",
            connectBtn: "Подключить кошелек Nautilus",
            donateBtn: "Сделать безопасное пожертвование"
        },
        contact: {
            title: "Контакты и ресурсы",
            community: "Сообщество",
            communityDesc: "Присоединяйтесь к нашему сообществу для поддержки и обсуждений",
            development: "Разработка",
            developmentDesc: "Внесите вклад в проект или сообщите о проблемах",
            security: "Безопасность",
            securityDesc: "Ответственно сообщайте об уязвимостях безопасности"
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
        const currentLang = localStorage.getItem('scypher-lang') || 'en';
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
