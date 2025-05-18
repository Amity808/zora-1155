import React, { useState } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { tradeCoin } from "@zoralabs/coins-sdk";
import { toast } from 'react-toastify';

interface BuyTokenProps {
    targetAddrress: `0x${string}`;
}


const BuyToken = ({ targetAddrress }: BuyTokenProps) => {

    const publicClient = usePublicClient()!;
    const { data: walletClientc } = useWalletClient()!;
    const { address } = useAccount();
    const [orderAmountBuy, setorderAmountBuy] = useState("");


    const buyParams = {
        direction: "buy" as const,
        target: targetAddrress as `0x${string}`,
        args: {
            recipient: address as `0x${string}`, // Where to receive the ETH
            orderSize: parseEther(orderAmountBuy?.toString()),
            minAmountOut: parseEther("0.0000005"),
            sqrtPriceLimitX96: BigInt(1),
            tradeReferrer: "0xbA5a586b0aCeD5be0daC760554eeDcf8C71c168c" as `0x${string}`, // Optional
        }
    };

    const buyCoinMuse = async () => {
        try {

            const result = await  tradeCoin(buyParams, walletClientc!, publicClient);
            if (result) {
                toast.success("Coin successfully bought!");
            }
        } catch (error) {
            console.log("Error trading coin:", error);
            toast.error("Error trading coin: " + error);
        }
    }

    return (
        <div>
            

            <button className="btn" onClick={() => {
                const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
                if (modal) modal.showModal();
            }}>Buy coin</button>
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
                        <input type="number" name="orderAmount" className=' text-black border-2 border-black' value={orderAmountBuy}
                            onChange={(e) => setorderAmountBuy(e.target.value)} />
                        <a type="submit" className='btn' onClick={buyCoinMuse}>Buy</a>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default BuyToken