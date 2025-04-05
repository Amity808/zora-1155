import { http, createConfig } from 'wagmi'
import { zoraTestnet, zoraSepolia, zora } from 'wagmi/chains'
import { createPublicClient, Chain } from "viem";
// import { walletConnect, safe, coinbaseWallet } from "wagmi/connectors"
import { createCreatorClient, createCollectorClient, create1155} from "@zoralabs/protocol-sdk"

export const config = createConfig({
  chains: [zoraSepolia, zoraTestnet, zora],
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
    [zora.id]: http(),
    [zoraTestnet.id]: http(),
    [zoraSepolia.id]: http(),
  },
})



 
export const chain = zora;
 
export const publicClient = createPublicClient({
  chain: chain as Chain,
  transport: http(),
});



export const creatorClient = createCreatorClient({
  chainId: zoraSepolia.id,
  publicClient,
})

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