import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'

export function useGetTokenAccountsQueryKey({ address, endpoint }: { address: PublicKey; endpoint: string }) {
  return ['get-token-accounts', { endpoint, address }]
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useMobileWallet()
  const queryKey = useGetTokenAccountsQueryKey({ address, endpoint: connection.rpcEndpoint })

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Reconstruct PublicKey to ensure proper prototype methods are available
      // This fixes issues where PublicKey objects lose methods during serialization
      const ownerAddress = new PublicKey(address.toString())
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(ownerAddress, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(ownerAddress, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ])
      return [...tokenAccounts.value, ...token2022Accounts.value]
    },
  })
}


export function useGetTokenAccountsInvalidate({ address }: { address: PublicKey }) {
  const { connection } = useMobileWallet()
  const queryKey = useGetTokenAccountsQueryKey({ address, endpoint: connection.rpcEndpoint })
  const client = useQueryClient()

  return () => client.invalidateQueries({ queryKey })
}
