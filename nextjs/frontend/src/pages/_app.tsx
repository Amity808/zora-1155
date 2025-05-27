'use client'
import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from "next/app";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { Museum } from "@/context/AppContext";
// import { config } from '../config/wagmi-config'; 
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  baseSepolia,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
// import { connectorsForWallets } from '@rainbow-me/rainbowkit';
// import {
//   metaMaskWallet,
//   rainbowWallet,
//   walletConnectWallet,
//   coinbaseWallet,
// } from '@rainbow-me/rainbowkit/wallets';

const queryClient = new QueryClient()



const config = getDefaultConfig({
  appName: 'Museum Arts',
  projectId: '81239f92cd9d7b46c2f91986d4b0f5c2',
  chains: [baseSepolia, base],
  
  ssr: true, // If your dApp uses server side rendering (SSR)
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <WagmiProvider config={config}>
      
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        {/* <Museum> */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Component {...pageProps} />
        {/* </Museum> */}
        </RainbowKitProvider>
        
      </QueryClientProvider>

    </WagmiProvider>

  </>
  )
 
}
