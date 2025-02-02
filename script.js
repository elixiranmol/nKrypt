// Balance Check Functionality
document.querySelector('.check-balance-btn').addEventListener('click', () => {
    document.querySelector('.balance-popup').style.display = 'flex';
});

document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.balance-popup').style.display = 'none';
});

document.querySelector('.balance-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.balance-popup')) {
        document.querySelector('.balance-popup').style.display = 'none';
    }
});

document.getElementById('balanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const accountNumber = document.querySelector('#balanceForm input').value;
    // Add your actual balance check logic here
    alert(`Balance check requested for account: ${accountNumber}`);
    document.querySelector('.balance-popup').style.display = 'none';
});

// Add any other needed JavaScript here
// Balance Check Functionality
document.querySelector('.check-balance-btn').addEventListener('click', () => {
    document.querySelector('.balance-popup').style.display = 'flex';
});

document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.balance-popup').style.display = 'none';
});

document.querySelector('.balance-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.balance-popup')) {
        document.querySelector('.balance-popup').style.display = 'none';
    }
});

document.getElementById('balanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const accountNumber = document.querySelector('#balanceForm input').value;
    // Add your actual balance check logic here
    alert(`Balance check requested for account: ${accountNumber}`);
    document.querySelector('.balance-popup').style.display = 'none';
});

// Transfer Ownership Functionality
document.querySelector('.nav-item.transfer-ownership-btn').addEventListener('click', () => {
    document.querySelector('.transfer-popup').style.display = 'flex';
});

document.querySelector('.close-transfer-popup').addEventListener('click', () => {
    document.querySelector('.transfer-popup').style.display = 'none';
});

document.querySelector('.transfer-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.transfer-popup')) {
        document.querySelector('.transfer-popup').style.display = 'none';
    }
});

document.getElementById('transferForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tokenID = document.querySelector('#transferForm input:first-of-type').value;
    const accountNumber = document.querySelector('#transferForm input:last-of-type').value;
    // Add your actual transfer logic here
    alert(`Transferring ownership of token ${tokenID} to account: ${accountNumber}`);
    document.querySelector('.transfer-popup').style.display = 'none';
});

// Upload File Functionality
document.querySelector('.file-card.upload-file-btn').addEventListener('click', () => {
    document.querySelector('.upload-popup').style.display = 'flex';
});

document.querySelector('.close-upload-popup').addEventListener('click', () => {
    document.querySelector('.upload-popup').style.display = 'none';
});

document.querySelector('.upload-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.upload-popup')) {
        document.querySelector('.upload-popup').style.display = 'none';
    }
});

document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('fileInput').files[0];
    const recipientAddress = document.querySelector('#uploadForm input[type="text"]').value;
    
    // Add your actual upload logic here
    if(file) {
        alert(`Uploading ${file.name} to address: ${recipientAddress}`);
        document.querySelector('.upload-popup').style.display = 'none';
    } else {
        alert('Please select a file to upload');
    }
});

// View Shared Files Functionality
document.querySelector('.file-card.view-shared-btn').addEventListener('click', () => {
    document.querySelector('.view-popup').style.display = 'flex';
});

document.querySelector('.close-view-popup').addEventListener('click', () => {
    document.querySelector('.view-popup').style.display = 'none';
});

document.querySelector('.view-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.view-popup')) {
        document.querySelector('.view-popup').style.display = 'none';
    }
});

document.getElementById('viewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const metamaskID = document.querySelector('#viewForm input').value;
    // Add your actual view logic here
    alert(`Fetching shared files for MetaMask ID: ${metamaskID}`);
    document.querySelector('.view-popup').style.display = 'none';
});

// Share Access Functionality
document.querySelector('.nav-item.share-access-btn').addEventListener('click', () => {
    document.querySelector('.share-popup').style.display = 'flex';
});

document.querySelector('.close-share-popup').addEventListener('click', () => {
    document.querySelector('.share-popup').style.display = 'none';
});

document.querySelector('.share-popup').addEventListener('click', (e) => {
    if(e.target === document.querySelector('.share-popup')) {
        document.querySelector('.share-popup').style.display = 'none';
    }
});

document.getElementById('shareForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const recipientAddress = document.querySelector('#shareForm input').value;
    // Add your actual share access logic here
    alert(`Sharing access with address: ${recipientAddress}`);
    document.querySelector('.share-popup').style.display = 'none';
});
