
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { fetchAssetsByOwner, fetchAssetBatch, fetchSolBalance, HeliusAsset } from '../utils/helius' // Ensure HeliusAsset is exported
import { TOKEN_CATEGORY_MAP, FALLBACK_CATEGORY } from '../constants/tokenMap'
import { Asset } from '../types/portfolio.types'

export interface WalletAsset {
    id: string
    mint: string // Mint address for price lookup
    name: string
    symbol: string
    amount: number
    decimals: number
    uiAmount: number
    price: number
    value: number
    categoryId: string
    change: number
    changePercentage: number
}

export function useWalletAssets(publicKey: PublicKey | null) {
    return useQuery({
        queryKey: ['wallet-assets', publicKey?.toBase58()],
        queryFn: async (): Promise<WalletAsset[]> => {
            if (!publicKey) return []

            console.log('Fetching assets for:', publicKey.toBase58())

            // 1. Fetch Basic List (IDs)
            const heliusAssetsBasic = await fetchAssetsByOwner(publicKey.toBase58())
            console.log('Fetched basic assets count:', heliusAssetsBasic.length)

            // 1b. Fetch Native SOL Balance manually (since displayOptions seems flaky)
            const solLamports = await fetchSolBalance(publicKey.toBase58());
            console.log('Fetched SOL Balance (lamports):', solLamports);

            const allAssetsCombined = [...heliusAssetsBasic];

            const SOL_MINT = 'So11111111111111111111111111111111111111112';

            // Handle Native SOL Balance
            // Strategy: ALWAYS use fetchSolBalance for accurate balance, 
            // either by updating existing SOL entry or injecting a new one
            const existingSolIndex = allAssetsCombined.findIndex(a =>
                a.id === publicKey.toBase58() ||
                a.id === SOL_MINT ||
                a.content?.metadata?.symbol === 'SOL'
            );

            if (existingSolIndex >= 0) {
                // SOL exists in the list, UPDATE its balance AND metadata with correct values
                console.log('Updating existing SOL balance from', allAssetsCombined[existingSolIndex].token_info?.balance, 'to', solLamports);
                allAssetsCombined[existingSolIndex] = {
                    ...allAssetsCombined[existingSolIndex],
                    content: {
                        metadata: {
                            name: 'Solana',
                            symbol: 'SOL'
                        }
                    },
                    token_info: {
                        balance: solLamports,
                        decimals: 9,
                        price_info: allAssetsCombined[existingSolIndex].token_info?.price_info
                    }
                };
            } else if (solLamports > 0) {
                // SOL doesn't exist, inject it
                console.log('Injecting SOL with balance:', solLamports);
                const solAsset: HeliusAsset = {
                    id: publicKey.toBase58(),
                    content: {
                        metadata: {
                            name: 'Solana',
                            symbol: 'SOL'
                        }
                    },
                    token_info: {
                        balance: solLamports,
                        decimals: 9,
                        price_info: undefined
                    }
                };
                allAssetsCombined.push(solAsset);
            }

            if (allAssetsCombined.length === 0) return []

            // 2. Fetch Detailed Info (Prices) via Batch
            // Helius returns the *Account Address* for native SOL in getAssetsByOwner, but getAssetBatch needs the *Mint Address* to return price info.
            // We strip out the minimal info and get full info which includes price_info
            const assetIds = allAssetsCombined.map(a => {
                // Map SOL (wallet ID) to SOL Mint for price lookup
                if (a.id === publicKey.toBase58() || a.content?.metadata?.symbol === 'SOL') {
                    return SOL_MINT;
                }
                return a.id;
            });

            const detailedAssets = await fetchAssetBatch(assetIds)
            console.log('Fetched detailed assets count:', detailedAssets.length)

            // 3. Create a Price Map from detailed assets
            // Map both the mint address and the original request ID to handle SOL special case
            const priceMap: Record<string, number> = {};
            detailedAssets.forEach((asset, index) => {
                if (!asset?.token_info) return;

                const priceInfo = asset.token_info.price_info;
                const price = priceInfo?.price_per_token || 0;

                // Map the returned asset ID to the price
                if (asset.id) {
                    priceMap[asset.id] = price;
                }

                // Also map the original requested ID (in case they differ)
                // This handles SOL where we request SOL_MINT but need to look it up
                const requestedId = assetIds[index];
                if (requestedId && requestedId !== asset.id) {
                    priceMap[requestedId] = price;
                }
            });

            console.log(`Price Map keys: ${Object.keys(priceMap).length}`);
            console.log(`Price Map has SOL mint (${SOL_MINT}):`, priceMap[SOL_MINT] !== undefined);

            // 4. Map to Portfolio Asset Structure using Basic Assets (preserves Balance)
            try {
                const mappedAssets = allAssetsCombined.map(asset => {
                    // Safe access with optional chaining and fallbacks
                    const tokenInfo = asset?.token_info || {};
                    const content = asset?.content || {};
                    const metadata = content.metadata || {};

                    const decimals = tokenInfo.decimals || 0;
                    const balanceRaw = tokenInfo.balance || 0;

                    // Compute UI Amount
                    const uiAmount = decimals > 0 ? balanceRaw / Math.pow(10, decimals) : balanceRaw;

                    // Determine Mint ID for Price Lookup
                    let mintId = asset.id;
                    if (asset.content?.metadata?.symbol === 'SOL' || asset.id === publicKey.toBase58()) {
                        mintId = SOL_MINT;
                    }

                    // Get Price from Map
                    const price = priceMap[mintId] || 0;

                    // Debug logging for price lookup issues
                    if (price === 0 && (asset.content?.metadata?.symbol === 'SOL' || mintId === SOL_MINT)) {
                        console.warn(`SOL price is 0! MintId: ${mintId}, PriceMap has key: ${priceMap[mintId] !== undefined}`);
                    }

                    // Compute Value
                    const value = uiAmount * price;

                    // Determine Category
                    // Fix: Native SOL logic
                    let categoryId = FALLBACK_CATEGORY;
                    if (mintId === SOL_MINT) categoryId = 'crypto';
                    else categoryId = TOKEN_CATEGORY_MAP[asset.id] || FALLBACK_CATEGORY;

                    const finalAsset = {
                        id: asset.id, // Keep original ID (Account Address for SOL, Mint for others usually)
                        mint: mintId,
                        name: metadata.name || 'Unknown Token',
                        symbol: metadata.symbol || 'UNK',
                        amount: balanceRaw,
                        decimals: decimals,
                        uiAmount: uiAmount,
                        price: price,
                        value: value,
                        categoryId: categoryId,
                        change: 0,
                        changePercentage: 0
                    }

                    // Enhanced logging for debugging (10% sample + all SOL)
                    if (Math.random() < 0.1 || finalAsset.symbol === 'SOL') {
                        console.log(`Processed: ${finalAsset.symbol} -> ID: ${finalAsset.id.substring(0, 8)}..., Mint: ${finalAsset.mint.substring(0, 8)}..., Amt: ${uiAmount.toFixed(4)}, Price: $${price.toFixed(2)}, Val: $${value.toFixed(2)}`);
                    }

                    return finalAsset
                });

                // Filter out assets with no value (as requested by user)
                // "Please only shows the crypto asset, which the value is bigger than 0"
                return mappedAssets.filter(a => a.value > 0);

            } catch (error) {
                console.error('Error mapping wallet assets:', error);
                return [];
            }
        },
        enabled: !!publicKey,
        refetchInterval: 30000,
    })
}
