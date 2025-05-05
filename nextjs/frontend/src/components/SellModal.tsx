import React,{ useState } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { tradeCoin } from "@zoralabs/coins-sdk";




const SellToken = () => {
    const [tokenAmount, setTokenAmount] = useState('');

    const publicClient = usePublicClient()!;
    const { data: walletClientc } = useWalletClient()!;
    const { address} = useAccount();
    const [orderAmountSell, setOrderAmountSell] = useState("");


    const sellParams = {
        direction: "sell" as const,
        target: "0xCoinContractAddress" as `0x${string}`,
        args: {
          recipient: address as `0x${string}`, // Where to receive the ETH
          orderSize: parseEther(orderAmountSell.toString()), // Amount of coins to sell
          minAmountOut: parseEther("0.0000005"), // Minimum ETH to receive
          tradeReferrer: "0x0000000000000000000000000000000000000000" as `0x${string}`, // Optional
        }
      };

      const sellCoinMuse = async () => {
        try {
            // add !
            const result = await tradeCoin(sellParams, walletClientc!, publicClient);
        } catch (error) {
            console.error("Error trading coin:", error);
        }
      }

    return (
        <div>
            <a href="#my_modal_8" className="btn">sell coin</a>

            {/* Put this part before </body> tag */}
            <div className="modal" role="dialog" id="my_modal_8">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Hello!</h3>
                    <p className="py-4">Sell Your token here input amount.</p>
                    <div className="modal-action">
                       <input type="text" name="orderAmount" id="orderamount" value={orderAmountSell}
                       onChange={(e) => setOrderAmountSell(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellToken