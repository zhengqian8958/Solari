import { Asset } from '../types/portfolio.types';

const HELIUS_API_KEY = process.env.EXPO_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Helius DAS API Types
export interface HeliusAsset {
    id: string; // Mint address
    content: {
        metadata: {
            name: string;
            symbol: string;
        };
    };
    token_info: {
        balance: number;
        decimals: number;
        price_info?: {
            price_per_token: number;
            total_price: number;
            currency: string;
        };
    };
}

export interface HeliusDasResponse {
    result: {
        total: number;
        limit: number;
        page: number;
        items: HeliusAsset[];
    };
}

/**
 * Fetch all assets (tokens) for a wallet using Helius DAS API
 * This returns metadata, balances, and prices (if available)
 */
export async function fetchAssetsByOwner(ownerAddress: string): Promise<HeliusAsset[]> {
    if (!HELIUS_API_KEY || HELIUS_API_KEY.includes('your-helius-api-key')) {
        console.warn('Missing Helius API Key. Real data fetching will fail.');
        return [];
    }

    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'seeker-wallet-assets',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress,
                    page: 1,
                    limit: 1000,
                    displayOptions: {
                        showFungible: true,
                        showNativeBalance: true, // Specifically ask for SOL
                    },
                },
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Helius API Error:', response.status, text);
            return [];
        }

        const data = await response.json();

        if (data.error) {
            console.error('Helius RPC Error:', data.error);
            return [];
        }

        return data.result.items;
    } catch (error) {
        console.error('Failed to fetch assets from Helius:', error);
        return [];
    }
}

/**
 * Fetch detailed asset information (including price) for a list of mint IDs
 */
export async function fetchAssetBatch(ids: string[]): Promise<HeliusAsset[]> {
    if (!ids.length) return [];

    if (!HELIUS_API_KEY || HELIUS_API_KEY.includes('your-helius-api-key')) {
        return [];
    }

    // Chunk into batches of 1000 (Helius limit is usually 1000 for getAssetBatch)
    const chunks = [];
    for (let i = 0; i < ids.length; i += 1000) {
        chunks.push(ids.slice(i, i + 1000));
    }

    const allAssets: HeliusAsset[] = [];

    for (const chunk of chunks) {
        try {
            const response = await fetch(HELIUS_RPC_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'seeker-asset-batch',
                    method: 'getAssetBatch',
                    params: {
                        ids: chunk,
                        displayOptions: {
                            showFungible: true,
                            showNativeBalance: true,
                        },
                    },
                }),
            });

            if (!response.ok) {
                console.error('Helius Batch Error:', response.status);
                continue;
            }

            const data = await response.json();
            if (data.error) {
                console.error('Helius Batch RPC Error:', data.error);
                continue;
            }

            if (data.result) {
                allAssets.push(...data.result);
            }
        } catch (error) {
            console.error('Failed to fetch batch assets:', error);
        }
    }

    return allAssets;
}

/**
 * Fetch native SOL balance
 */
export async function fetchSolBalance(address: string): Promise<number> {
    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'get-sol-balance',
                method: 'getBalance',
                params: [address],
            }),
        });
        const data = await response.json();
        return data.result?.value || 0;
    } catch (error) {
        console.error('Failed to fetch SOL balance:', error);
        return 0;
    }
}
