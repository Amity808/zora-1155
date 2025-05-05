import React, { useState, useEffect, useCallback } from 'react'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import BuyToken from './BuyModal';
import SellToken from './SellModal';


type TokenDetails = {
    zora20Token?: {
        id: string;
        name: string;
        description: string;
        address: string;
        symbol: string;
        totalSupply: string;
        totalVolume: string;
        volume24h: string;
        createdAt?: string;
        creatorAddress?: string;
        creatorEarnings: Array<{
            amount: {
                currencyAddress: string;
                amountRaw: string;
                amountDecimal: number;
            };
            amountUsd?: string;
        }>;
        marketCap: string;
        marketCapDelta24h: string;
        chainId: number;
        creatorProfile?: {
            id: string;
            handle: string;
            avatar?: {
                previewImage: {
                    blurhash?: string;
                    medium: string;
                    small: string;
                };
            };
        };
        mediaContent?: {
            mimeType?: string;
            originalUri: string;
            previewImage?: {
                small: string;
                medium: string;
                blurhash?: string;
            };
        };
        transfers: {
            count: number;
        };
        uniqueHolders: number;
        zoraComments: {
            pageInfo: {
                endCursor?: string;
                hasNextPage: boolean;
            };
            count: number;
        };
    };
};


const ArtifactCard = () => {
    const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null)
    const publicClient = usePublicClient()!;
    const { data: walletClientc } = useWalletClient()!;
    const [orderAmountBuy, setorderAmountBuy] = useState("");
    const [orderAmountSell, setOrderAmountSell] = useState("");
    

    const { address } = useAccount();

   
    const fetchCoinDetails = useCallback(async () => {
        // const response = await getCoin({
        //     address: "0x224Ba15a5762A1114B0532143d91Fe0B37b1c247",
        //     chain: base.id,
        // })
        // if (response?.data) {
        //     setTokenDetails(response.data);
        // }
        // return response;
        try {
            const url = new URL('https://api-sdk.zora.engineering/coin');
            url.searchParams.append('address', '0x224Ba15a5762A1114B0532143d91Fe0B37b1c247');
            url.searchParams.append('chain', '8453');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch coin details');
            }

            const data = await response.json();
            if (data) {
                setTokenDetails(data);
            }
        } catch (error) {
            console.error("Error fetching coin details:", error);
        }
    }, [])

    useEffect(() => {
        fetchCoinDetails()
    }, [fetchCoinDetails])

    console.log(tokenDetails)
    return (
        <div>


            <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                    <img
                        src={tokenDetails?.zora20Token?.mediaContent?.previewImage?.medium || "/artifact.webp"}
                        alt="Shoes" className='w-[250px]' />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        {tokenDetails?.zora20Token?.name}
                        <div className="badge badge-secondary">{tokenDetails?.zora20Token?.symbol}</div>
                    </h2>
                    <p>{tokenDetails?.zora20Token?.description} Read for ....</p>
                    <div className="card-actions justify-end">
                    <BuyToken targetAddrress={(tokenDetails?.zora20Token?.address || "0x0000000000000000000000000000000000000000") as `0x${string}`} />
                    <SellToken targetAddrress={(tokenDetails?.zora20Token?.address || "0x0000000000000000000000000000000000000000") as `0x${string}`} />
                    </div>
                </div>
            </div>
            {/* second dummy  */}
            <div className="card bg-base-100 w-96 shadow-sm">
                <figure>
                    <img
                        src="/artifact.webp"
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        Mongolia Tomb
                        <div className="badge badge-secondary">Artifact</div>
                    </h2>
                    <p>This is a mongolia tomb, which serves as a sacred tomb for the mongolia. Read for ....</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">Historical</div>
                        <div className="badge badge-outline cursor-pointer" >Read More</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtifactCard