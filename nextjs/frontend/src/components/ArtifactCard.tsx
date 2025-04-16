import React, { useState, useEffect, useCallback } from 'react'
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from 'viem/chains';


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
    const [tokenDetails, setTokenDetails] = useState<TokenDetails>({})

    const fetchCoinDetails = useCallback(async () => {
        const response = await getCoin({
            address: "0x224Ba15a5762A1114B0532143d91Fe0B37b1c247",
            chain: base.id,
        })
        if (response?.data) {
            setTokenDetails(response.data);
        }
        return response;
    }, [])

    useEffect(() => {
        fetchCoinDetails()
    },[fetchCoinDetails])

    console.log(tokenDetails)
    return (
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
    )
}

export default ArtifactCard