import { http, createConfig } from 'wagmi'
import { zoraTestnet, zoraSepolia, zora, base, baseSepolia } from 'wagmi/chains'
import { createPublicClient } from "viem";


export const config = createConfig({
  chains: [zoraSepolia, zoraTestnet, zora, base, baseSepolia],
  connectors: [
    // injected(),
    // safe(),
    // coinbaseWallet(),
    // metaMask()
    // walletConnect({
    //   projectId: '3fcc6bba6f1de962d911bb5b5c3dba68',
    // })
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
    [zoraTestnet.id]: http(),
    [zoraSepolia.id]: http(),
  },
})



 

export const chain = zora;
 

// const { address } = useAccount();
export const publicClient = createPublicClient({
  chain: base,
  transport: http('https://base.llamarpc.com'),
});

// export const walletClient = createWalletClient({
//   account: address as Hex,
//   chain: baseSepolia,
//   transport: http(),
// });

// export const creatorClient = createCreatorClient({
//   chainId: baseSepolia.id,
//   publicClient,
// })

// export const client1155 = creatorClient.create1155({
//   contract: {
//     name: "Museum Art",
//     uri: "http://"

//   }
//   // account: "0xYourAccountAddress",  // Replace with your account address
//   // token: {
//   //   // Add token details here
//   // }
//   ,})