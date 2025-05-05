import React,{ useState } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { tradeCoin } from "@zoralabs/coins-sdk";
import { toast } from 'react-toastify';

interface SellTokenProps {
    targetAddrress: `0x${string}`;
}

const SellToken = ({ targetAddrress }: SellTokenProps) => {
    const publicClient = usePublicClient()!;
    const { data: walletClientc } = useWalletClient()!;
    const { address} = useAccount();
    const [orderAmountSell, setOrderAmountSell] = useState("");


    const sellParams = {
        direction: "sell" as const,
        target: targetAddrress as `0x${string}`,
        args: {
          recipient: address as `0x${string}`, // Where to receive the ETH
          orderSize: parseEther(orderAmountSell.toString()), // Amount of coins to sell
          minAmountOut: parseEther("0.0000005"), // Minimum ETH to receive
          sqrtPriceLimitX96: BigInt(0),
          tradeReferrer: "0xbA5a586b0aCeD5be0daC760554eeDcf8C71c168c" as `0x${string}`, // Optional
        }
      };

      const sellCoinMuse = async () => {
        try {
            // add !
            const result = await tradeCoin(sellParams, walletClientc!, publicClient);
        } catch (error: any) {
            console.log("Error trading coin:", error);
            toast.error(error)

        }
      }

    return (
        <div>

            <button className="btn" onClick={() => {
                const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
                if (modal) modal.showModal();
            }}>Sell Coin</button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                    <p className="py-4">Input Your token amount here.</p>

                    <div className="modal-action">
                        <input type="number" name="orderAmount" className=' text-black border-2 border-black' value={orderAmountSell}
                            onChange={(e) => setOrderAmountSell(e.target.value)} />
                        <a type="submit" className='btn' onClick={sellCoinMuse}>Buy</a>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default SellToken