const fs = require('fs');
const path = require('path');

// 1. Read .env file manually
const envPath = path.resolve(__dirname, '../.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_HELIUS_API_KEY=(.+)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Error reading .env file:', e.message);
    process.exit(1);
}

if (!apiKey || apiKey === 'your-helius-api-key-here') {
    console.error('INVALID API KEY: Please update .env with a valid Helius API Key.');
    process.exit(1);
}

console.log('Using API Key:', apiKey.substring(0, 5) + '...');

const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
const OWNER_ADDRESS = 'ENoRpKD4vmVpZbAkHygZbgrchXhEonMCfzWFyMnmVeb3'; // User provided address

async function debugHelius() {
    console.log(`Fetching assets for: ${OWNER_ADDRESS}`);
    console.log(`URL: ${HELIUS_RPC_URL}`);

    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'debug-script',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress: OWNER_ADDRESS,
                    page: 1,
                    limit: 10, // Limit to 10 for debug
                    displayOptions: {
                        showFungible: true,
                        showNativeBalance: true,
                    },
                },
            }),
        });

        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response Body:', text);
            return;
        }

        const data = await response.json();

        if (data.error) {
            console.error('RPC Error:', JSON.stringify(data.error, null, 2));
            return;
        }

        console.log('SUCCESS! Found items:', data.result.items.length);
        if (data.result.items.length > 0) {
            console.log('Sample Item 0:', JSON.stringify(data.result.items[0], null, 2));
        } else {
            console.log('No assets found. Is this a Devnet or Mainnet address? The URL is configured for Mainnet.');
        }

    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

debugHelius();
