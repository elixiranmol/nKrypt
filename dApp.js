import config from './config.js';

const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const appState = {
    provider: null,
    signer: null,
    contract: null,
    userAddress: null
};

function updateStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
}


function updateUIState(isConnected) {
    const buttons = ['deployButton', 'mintButton', 'transferButton', 'balanceButton', 'viewTokensButton'];
    buttons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = !isConnected;
        }
    });
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        appState.provider = new ethers.providers.Web3Provider(window.ethereum);
        appState.signer = appState.provider.getSigner();
        appState.userAddress = await appState.signer.getAddress();

        document.getElementById('connectButton').textContent = 'Connected';
        document.getElementById('walletAddress').textContent = `Connected Address: ${appState.userAddress}`;
        updateStatus('Wallet connected successfully!', 'success');
        updateUIState(true);

        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });

    } catch (error) {
        console.error('Wallet connection error:', error);
        updateStatus('Error connecting wallet: ' + error.message, 'error');
        updateUIState(false);
    }
}

async function deployContract() {
    try {
        if (!appState.signer) {
            throw new Error('Please connect your wallet first');
        }

        document.getElementById('deployLoading').style.display = 'block';

        const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, appState.signer);
        const contract = await factory.deploy();
        await contract.deployed();

        localStorage.setItem('contractAddress', contract.address);
        document.getElementById('contract-address').textContent = 
            `Contract deployed at: ${contract.address}`;
        updateStatus('Contract deployed successfully!', 'success');
        
        appState.contract = contract;
    } catch (error) {
        console.error('Deployment error:', error);
        updateStatus('Deployment error: ' + error.message, 'error');
    } finally {
        document.getElementById('deployLoading').style.display = 'none';
    }
}

async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://api.lighthouse.storage/api/v0/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.LIGHTHOUSE_API_KEY}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('IPFS upload failed');
        }

        const data = await response.json();
        return data.Hash;
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw error;
    }
}

=
function setupFileInput() {
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewImage = document.getElementById('preview-image');
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}


async function uploadAndMint() {
    try {
        if (!appState.signer) {
            throw new Error('Please connect your wallet first');
        }

        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (!file) {
            throw new Error('Please select a file to mint');
        }

        document.getElementById('mintLoading').style.display = 'block';
        updateStatus('Uploading file to IPFS...', 'info');

      
        const ipfsHash = await uploadToIPFS(file);

      
        const metadata = {
            name: file.name,
            description: "NFT File Storage",
            image: `ipfs://${ipfsHash}`,
            type: file.type
        };

      
        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const metadataHash = await uploadToIPFS(metadataBlob);


        const contractAddress = localStorage.getItem('contractAddress');
        if (!contractAddress) {
            throw new Error('Please deploy the contract first');
        }

 
        const toAddress = document.getElementById('mint-address').value || appState.userAddress;
        if (!ethers.utils.isAddress(toAddress)) {
            throw new Error('Invalid recipient address');
        }

        appState.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, appState.signer);
        const tx = await appState.contract.safeMint(toAddress, `ipfs://${metadataHash}`);
        const receipt = await tx.wait();

        updateStatus(`NFT minted successfully!`, 'success');


        fileInput.value = '';
        document.getElementById('preview-image').style.display = 'none';

    } catch (error) {
        console.error('Minting error:', error);
        updateStatus('Minting error: ' + error.message, 'error');
    } finally {
        document.getElementById('mintLoading').style.display = 'none';
    }
}


async function transferNFT() {
    try {
        if (!appState.signer) {
            throw new Error('Please connect your wallet first');
        }

        const contractAddress = localStorage.getItem('contractAddress');
        if (!contractAddress) {
            throw new Error('Please deploy the contract first');
        }

        document.getElementById('transferLoading').style.display = 'block';

        const fromAddress = document.getElementById('from-address').value;
        const toAddress = document.getElementById('to-address').value;
        const tokenId = document.getElementById('token-id').value;

        if (!ethers.utils.isAddress(fromAddress) || !ethers.utils.isAddress(toAddress)) {
            throw new Error('Invalid address');
        }

        if (!tokenId) {
            throw new Error('Please enter a token ID');
        }

        appState.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, appState.signer);
        const tx = await appState.contract.safeTransferFrom(fromAddress, toAddress, tokenId);
        await tx.wait();
        
        updateStatus('NFT transferred successfully!', 'success');
    } catch (error) {
        console.error('Transfer error:', error);
        updateStatus('Transfer error: ' + error.message, 'error');
    } finally {
        document.getElementById('transferLoading').style.display = 'none';
    }
}

async function checkBalance() {
    try {
        if (!appState.signer) {
            throw new Error('Please connect your wallet first');
        }

        const contractAddress = localStorage.getItem('contractAddress');
        if (!contractAddress) {
            throw new Error('Please deploy the contract first');
        }

        const address = document.getElementById('balance-address').value;
        if (!ethers.utils.isAddress(address)) {
            throw new Error('Invalid address');
        }

        appState.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, appState.signer);
        const balance = await appState.contract.balanceOf(address);
        
        document.getElementById('balance-result').textContent = 
            `Balance: ${balance.toString()} NFTs`;
        updateStatus('Balance checked successfully!', 'success');
    } catch (error) {
        console.error('Balance check error:', error);
        updateStatus('Balance check error: ' + error.message, 'error');
        document.getElementById('balance-result').textContent = '';
    }
}

async function fetchIPFSMetadata(tokenURI) {
    const url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const response = await fetch(url);
    return await response.json();
}

window.connectWallet = connectWallet;
window.deployContract = deployContract;
window.uploadAndMint = uploadAndMint;
window.transferNFT = transferNFT;
window.checkBalance = checkBalance;

document.addEventListener('DOMContentLoaded', () => {
    setupFileInput();
    
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        connectWallet();
    }

    const contractAddress = localStorage.getItem('contractAddress');
    if (contractAddress) {
        document.getElementById('contract-address').textContent = 
            `Contract deployed at: ${contractAddress}`;
    }
});
