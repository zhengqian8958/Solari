export const TOKEN_CATEGORY_MAP: Record<string, string> = {
    // Cash (Stablecoins)
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'cash', // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'cash', // USDT
    'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB': 'cash', // USD1

    // Crypto (Default fallbacks or specific majors like SOL)
    'So11111111111111111111111111111111111111112': 'crypto', // SOL

    // Commodities (gold, silver, xStocks, and Ondo tokenized assets)
    'Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re': 'commodities', // Gold (GLDx)
    '7C56WnJ94iEP7YeH2iKiYpvsS5zkcpP9rJBBEBoUGdzj': 'commodities', // Silver (SLVr)
    'AEv6xLECJ2KKmwFGX85mHb9S2c2BQE7dqE5midyrXHBb': 'commodities', // GLDr

    // Stock (xStocks, and Ondo tokenized assets)
    '123mYEnRLM2LLYsJW3K6oyYh8uP1fngj732iG638ondo': 'stock', // AAPLon
    'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp': 'stock', // AAPLx
    '13qTjKx53y6LKGGStiKeieGbnVx3fx1bbwopKFb3ondo': 'stock', // AGGon
    '14diAn5z8kjrKwSC8WLqvBqqe5YmihJhjxRxd8Z6ondo': 'stock', // AMDon
    '14Tqdo8V1FhzKsE3W2pFsZCzYPQxxupXRcqw9jv6ondo': 'stock', // AMZNon
    'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg': 'stock', // AMZNx
    'PresTj4Yc2bAR197Er7wz4UUKSfqt6FryBEdAriBoQB': 'stock', // ANDURIL
    'Pren1FvFX6J3E4kXhJuCiAD5aDmGEb7qJRncwA8Lkhw': 'stock', // ANTHROPIC
    '1eLZPRsn8bAKmoxsqDMH9Q2m2k7GMNp6RLSQGm8ondo': 'stock', // ASMLon
    '1FWZtdWN7y38BSXGzbs8D6Shk88oL9atDNgbVz9ondo': 'stock', // AVGOon
    '1zvb9ELBFShBCWKEk5jRTJAaPAwtVt7quEXx1X4ondo': 'stock', // BABAon
    '5H1VpMzRuoNtRbPTRCz35ETtEUtnkt8hJuQb9v7ondo': 'stock', // BLKon
    'Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu': 'stock', // COINx
    'X7j77hTmjZJbepkXXBcsEapM8qNgdfihkFj6CZ5ondo': 'stock', // COPXon
    '6btaz134wjHkR8sqhAYrtSM6tavftfxnRvnyMd8ondo': 'stock', // COSTon
    'C3VLBJB2FhEb47s1WEgroyn3BnSYXaezqtBuu5WNmUGw': 'stock', // CPERr
    '6xHEyem9hmkGtVq6XGCiQUGpPsHBaoYuYdFNZa5ondo': 'stock', // CRCLon
    '5fKr9joRHpioriGmMgRVFdmZge8EVUTbrWyxDVdSrcuG': 'stock', // CRCLr
    'XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1': 'stock', // CRCLx
    'cdKfoNjbXgnSuxvoajhtH3uixfZhq1YXhQsS1Rwondo': 'stock', // CRWDon
    '7tgKziACteG26VjV5xKufojKxwTgCFyTwmWUmz5ondo': 'stock', // CVXon
    'Xs2yquAgsHByNzx68WJC55WHjHBvG9JsMB7CWjTLyPy': 'stock', // DFDVx
    '916SDKz7y5ZcEZC9CtnQ5Djs1Y8Yv3UAPb6bak8ondo': 'stock', // EEMon
    'AbvryMGnaba9oADMZk8Vp2Av6MtczsncGyfWaC4ondo': 'stock', // EFAon
    'bbahNA5vT9WJeYft8tALrH1LXWffjwqVoUbqYa1ondo': 'stock', // GOOGLon
    'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN': 'stock', // GOOGLx
    'BVdXGvmgi6A9oAiwWvBvP76fyTqcCNRJMM7zMN6ondo': 'stock', // HOODon
    'XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg': 'stock', // HOODx
    'M77ZvkZ8zW5udRbuJCbuwSwavRa7bGAZYMTwru8ondo': 'stock', // IAUon
    'C8bZkgSxXkyT1RgxByp2teJ24hgimPLoyEYoNa9ondo': 'stock', // IBMon
    'C9J9vZ8N79GzzxFoRkPWCkGtMKU8akg4FhUk4r9ondo': 'stock', // IEFAon
    'cdVNL7wK8mf1UCDqM6zdrziRv4hmvqWhXeTcck2ondo': 'stock', // IEMGon
    'cfPLN9WXD2BTkbZhRZMVXPmVSiRo44hJWRtnaC8ondo': 'stock', // IJHon
    'cJpUMp5R7rZ6fGeLHbHhrRuJzK9mkyKDjZqNpT3ondo': 'stock', // INTCon
    'CPWkMURVvcnX8hGjqCTb8i5LkzV3VSvyk7SeJi8ondo': 'stock', // ITOTon
    'CqW2pd6dCPG9xKZfAsTovzDsMmAGKJSDBNcwM96ondo': 'stock', // IVVon
    'dSHPFuMMjZqt7xDYGWrexXTSkdEZAiZngqymQF2ondo': 'stock', // IWFon
    'dvj2kKFSyjpnyYSYppgFdAEVfgjMEoQGi9VaV23ondo': 'stock', // IWMon
    'DX7g7WNjDpVzNK9CG81v7wb6ZbiNzYfkdzH2Xs5ondo': 'stock', // IWNon
    'E5Gczsavxcomqf6Cw1sGCKLabL1xYD2FzKxVoB4ondo': 'stock', // JPMon
    'PreLWGkkeqG1s4HEfFZSy9moCrJ7btsHuUtfcCeoRua': 'stock', // KALSHI
    'e6G4pfFcrdKxJuZ4YXixRFfMbpMvgXG2Mjcus71ondo': 'stock', // KOon
    'eGGxZwNSfuNKRqQLKaz2hc4QkA2mau7skyxPdj7ondo': 'stock', // LLYon
    'EoReHwUnGGekbXFHLj5rbCVKiwWqu32GrETMfw4ondo': 'stock', // LMTon
    'ETCJUmuhs5aY62xgEVWCZ5JR8KPdeXUaJz3LuC5ondo': 'stock', // MARAon
    'EsVHcyRxXFJCLMiuYLWhoDygrNe1BJGpYeZ17X7ondo': 'stock', // MAon
    'EUbJjmDt8JA222M91bVLZs211siZ2jzbFArH9N3ondo': 'stock', // MCDon
    'XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2': 'stock', // MCDx
    'fDxs5y12E7x7jBwCKBXGqt71uJmCWsAQ3Srkte6ondo': 'stock', // METAon
    'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu': 'stock', // METAx
    'XwFm5GiKPVTvPiEbQpdc6vJbFEpsUXRMf6TcSxnondo': 'stock', // MPon
    'FRmH6iRkMr33DLG6zVLR7EM4LojBFAuq6NtFzG6ondo': 'stock', // MSFTon
    'XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX': 'stock', // MSFTx
    'FSz4ouiqXpHuGPcpacZfTzbMjScoj5FfzHkiyu2ondo': 'stock', // MSTRon
    'B8GKqTDGYc7F6udTHjYeazZ4dFCRkrwK2mBQNS4igqTv': 'stock', // MSTRr
    'XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ': 'stock', // MSTRx
    'Fz9edBpaURPPzpKVRR1A8PENYDEgHqwx5D5th28ondo': 'stock', // MUon
    't7eN6cGwRMFaZvsNW2SmVwkedmHtDdrxA4ycNE5ondo': 'stock', // NEEon
    'G7pTVoSECz5RQWubEnTP7AC83KHUsSyoiqYR1R2ondo': 'stock', // NOWon
    'gEGtLTPNQ7jcg25zTetkbmF7teoDLcrfTnQfmn2ondo': 'stock', // NVDAon
    'ALTP6gug9wv5mFtx2tSU1YYZ1NrEc2chDdMPoJA8f8pu': 'stock', // NVDAr
    'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh': 'stock', // NVDAx
    'GeV7S8vjP8qdYZpdGv2Xi6e7MUMCk8NAAp2z7g5ondo': 'stock', // NVOon
    'PreweJYECqtQwBtpxHL171nL2K6umo692gTm7Q3rpgF': 'stock', // OPENAI
    'P7hTXnKk2d2DyqWnefp5BSroE1qjjKpKxg9SxQqondo': 'stock', // PALLon
    '9eS6ZsnqNJGGKWq8LqZ95YJLZ219oDuJ1qjsLoKcQkmQ': 'stock', // PALLr
    'PnjETBCLC318DRejo9cMQKAmET9PvW8AEFGWMNtondo': 'stock', // PDDon
    'gud6b3fYekjhMG5F818BALwbg2vt4JKoow59Md9ondo': 'stock', // PEPon
    'Gwh9fPsX1qWATXy63vNaJnAFfwebWQtZaVmPko6ondo': 'stock', // PFEon
    'GZ8v4NdSG7CTRZqHMgNsTPRULeVi8CpdWd9wZY8ondo': 'stock', // PGon
    'HfsnTS5qtdStwec9DfBrunRqnAMYMMz1kjv9Hu9ondo': 'stock', // PLTRon
    'EtTQ2QRyf33bd6B2uk7nm1nkinrdGKza66EGdjEY4s7o': 'stock', // PPLTr
    'HrYNm6jTQ71LoFphjVKBTdAE4uja7WsmLG8VxB8ondo': 'stock', // QQQon
    'Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ': 'stock', // QQQx
    'tiitb2Z1HtpB2DpVr6V7tdCFS3jmTinLeuGj9EVondo': 'stock', // REMXon
    'iy11ytbSGcUnrjE6Lfv78TFqxKyUESfku1FugS9ondo': 'stock', // SLVon
    'PreANxuXjsy2pvisWWMNB6YaJNzr7681wJJr2rHsfTh': 'stock', // SPACEX
    'k18WJUULWheRkSpSquYGdNNmtuE2Vbw1hpuUi92ondo': 'stock', // SPYon
    'AVw2QGVkXJPRPRjLAceXVoLqU5DVtJ53mdgMXp14yGit': 'stock', // SPYr
    'XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W': 'stock', // SPYx
    'k6BPp2Xmf2TYgrZiUyWfUoZBKeqaDbvPoAVgSx2ondo': 'stock', // TIPon
    'KaSLSWByKy6b9FrCYXPEJoHmLpuFZtTCJk1F1Z9ondo': 'stock', // TLTon
    'kbmF7ERJWMaaDswMprrH9gHSLya5D2RMBNgKqg3ondo': 'stock', // TMon
    'KeGv7bsfR4MheC1CkmnAVceoApjrkvBhHYjWb67ondo': 'stock', // TSLAon
    'FJug3z58gssSTDhVNkTse5fP8GRZzuidf9SRtfB2RhDe': 'stock', // TSLAr
    'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB': 'stock', // TSLAx
    'keybg184d4vyXeQdFqs4o99YsMg7xBthxTJ6Ky3ondo': 'stock', // TSMon
    'kPBGL8vAwKN3UGmr9cjkM2dU79SC3nzTC9yu7F8ondo': 'stock', // UNHon
    'XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe': 'stock', // UNHx
    'rpydAzWdCy85HEmoQkH5PVxYtDYQWjmLxgHHadxondo': 'stock', // USOon
    'MkN2TZSYTFBdMRLf9EVcfhstTwnazH8knd9hpepondo': 'stock', // VRTon
    'h6MW8GFpfzxFa1JNn6hZNnBF3t4fj9SHAXKy6LXondo': 'stock', // VSTon
    'jCCU4GwukjNxAXJowG2S4KCrr5g6YyUB61WHYvGondo': 'stock', // VTIon
    'LZddqAqKqJW9oMZSjTxCUmbmzBRQtv9gMkD9hZ3ondo': 'stock', // WMTon
    'PreC1KtJ1sBPPqaeeqL6Qb15GTLCYVvyYEwxhdfTwfx': 'stock', // XAI
    'qCYD74QnXzd9pzv6pGHQKJVwoibL6sNcPQDnpDiondo': 'stock', // XOMon
    'XsaHND8sHyfMfsWPj6kSdd5VwvCayZvjYgKmmcNL5qh': 'stock', // XOMx

}

export const FALLBACK_CATEGORY = 'crypto'
