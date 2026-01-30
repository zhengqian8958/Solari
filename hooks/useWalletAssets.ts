import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { fetchAssetsByOwner } from '../utils/helius'
import { TOKEN_CATEGORY_MAP, FALLBACK_CATEGORY } from '../constants/tokenMap'
import { Asset } from '../types/portfolio.types'

export interface WalletAsset {
    id: string
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

            // 1. Fetch Assets from Helius (Balances & Metadata)
            const heliusAssets = await fetchAssetsByOwner(publicKey.toBase58())
            console.log('Fetched assets count:', heliusAssets.length)

            if (heliusAssets.length === 0) return []

            // 2. Map to Portfolio Asset Structure
            try {
                return heliusAssets.map(asset => {
                    // Safe access with optional chaining and fallbacks
                    const tokenInfo = asset?.token_info || {};
                    const content = asset?.content || {};
                    const metadata = content.metadata || {};

                    const decimals = tokenInfo.decimals || 0;
                    const balanceRaw = tokenInfo.balance || 0;

                    // Compute UI Amount
                    const uiAmount = decimals > 0 ? balanceRaw / Math.pow(10, decimals) : balanceRaw;

                    // Get Price from Helius
                    const priceInfo = (tokenInfo.price_info || {}) as any;
                    const price = priceInfo.price_per_token || 0;

                    // Compute Value
                    const value = uiAmount * price;

                    // Determine Category
                    const categoryId = TOKEN_CATEGORY_MAP[asset.id] || FALLBACK_CATEGORY;

                    const finalAsset = {
                        id: asset.id || `unknown_${Math.random()}`,
                        mint: asset.id,
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

                    // Debug log for first few items
                    if (Math.random() < 0.1) {
                        console.log(`Processes asset: ${finalAsset.symbol} -> Cat: ${categoryId}, Val: ${value}`)
                    }

                    return finalAsset
                });
            } catch (error) {
                console.error('Error mapping wallet assets:', error);
                return [];
            }
        },
        enabled: !!publicKey,
        refetchInterval: 30000,
    })
}
