import React, { useState, useCallback, useEffect } from 'react'
// import { useParams } from 'next/navigation';
import BuyToken from './BuyModal';
import SellToken from './SellModal';
import { truncateAddress } from '@/utils/truncateAddress';
import { useRouter } from 'next/router';
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
const SingleProject = () => {
    const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null)

    // const { id } = useParams();

    const router = useRouter();
    const { query } = router.query;

    // const params = useParams();
    
    // const addressZero = "0x0000000000000000000000000000000000000000"
    const fetchCoinDetails = useCallback(async () => {
        if (!query) return;
        try {
            const url = new URL('https://api-sdk.zora.engineering/coin');
            url.searchParams.append('address', `${query}`);
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
    }, [query])

    useEffect(() => {
        fetchCoinDetails()
    }, [fetchCoinDetails])

    if (!query) return null;


    const dummyImage = "https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMGljb258ZW58MHx8MHx8fDA%3D";
    return (
        <div className="bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className='text-3xl font-bold mb-6'>Project Details</h1>
                <div className='flex flex-col md:flex-row'>
                    <div className='w-full md:w-1/2'>
                        <img src={tokenDetails?.zora20Token?.mediaContent?.previewImage?.medium || dummyImage} alt="Project Image" className="rounded-lg shadow-lg" />
                    </div>
                    <div className='w-full md:w-1/2 p-4'>
                        <h2 className='text-2xl font-semibold mb-4'>{tokenDetails?.zora20Token?.name}</h2>
                        <p className='text-gray-300 mb-6'>{tokenDetails?.zora20Token?.description}</p>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Research Auth Address</h3>
                            <p className="text-gray-400">{truncateAddress(tokenDetails?.zora20Token?.address as `0x${string}`)}</p>
                        </div>
                        <button className='btn mt-4 bg-blue-600 hover:bg-blue-700 text-white'>Buy Coin</button>
                        <button className='btn mt-4 ml-4 bg-red-600 hover:bg-red-700 text-white'>Sell Coin</button>
                        <BuyToken targetAddrress={(tokenDetails?.zora20Token?.address || "0x0000000000000000000000000000000000000000") as `0x${string}`} />
                    <SellToken targetAddrress={(tokenDetails?.zora20Token?.address || "0x0000000000000000000000000000000000000000") as `0x${string}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProject