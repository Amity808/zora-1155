import React, { useCallback, useState, useEffect } from 'react'
import { BackgroundGradient } from '../ui/background-gradient'
import Image from 'next/image'
import { useReadContract } from "wagmi"
import { abi } from "@/contract/MuseumFactory";
import { abiMuseum } from '@/contract/Museum';
import { FactoryAddress } from "@/helper/constant";

// interface ArtifactInterface {
//     id: string | number;
//     addressDeploy: `0x${string}`
// }
interface ResultFect {
    _imageURI: string;
    ticketPrice: number;
    totalRevenue: number;
    totalVisitors: number;
    status: number;
    owner: `0x${string}`
}

// interface DeployDetails {
//     name: string;
//     location: string;
//     address: `0x${string}`
// }

// { id, addressDeploy }: ArtifactInterface

const ArtifactCard = () => {

    // if (id === undefined || id === null) {
    //     console.error("Error: id is undefined or null");
    //     return null; // Prevent rendering if id is invalid
    // }

    // const parsedId = BigInt(id); 
    const [artifacts, setArtifacts] = useState<ResultFect>()
    
    // const [deployFactoryDetails, setDeployFactoryDetails] = useState<DeployDetails>()

    // const { data: DeployFactoryDetails } = useReadContract({
    //     abi: abi,
    //     address: FactoryAddress,
    //     functionName: "_deployed",
    //     args: [BigInt(0)]
    // })



    const { data: getData } = useReadContract({
        abi: abiMuseum,
        address: "0x88Bb98F7863Af8Ee544102d5da1364c4f0392AAe",
        functionName: "artifact",
        args: [BigInt(0)]
    })

    console.log(getData)

    // const getFactoryDetails = useCallback(() => {
    //     if (!DeployFactoryDetails) return null;
    //     setDeployFactoryDetails({
    //         name: DeployFactoryDetails[0],
    //         location: DeployFactoryDetails[1],
    //         address: `0x${DeployFactoryDetails[2]}`
    //     })
    // }, [])

    


    const getAllArtifacts = useCallback(() => {
        if (!getData) return null;
        setArtifacts({
            _imageURI: getData[0],
            ticketPrice: Number(getData[1]),
            totalRevenue: Number(getData[2]),
            totalVisitors: Number(getData[3]),
            status: Number(getData[4]),
            owner: `0x${getData[5]}`
        })

    }, [getData])

    useEffect(() => {
        getAllArtifacts()
    }, [getAllArtifacts])


    // if(!artifacts) return;

    return (
        <div>
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                <Image
                    src={`/artifact.webp`}
                    alt="jordans"
                    height="400"
                    width="400"
                    className="object-contain"
                />
                <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {/* {artifacts?._name} */}
                </p>

                <div>
                    <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                        {/* {artifacts?.location} */}
                    </p>
                    <p>{artifacts?.status}</p>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
                    February 17, 2024. Your best opportunity to get these right now is by
                    entering raffles and waiting for the official releases.
                </p>
                <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                    <span>Buy now </span>
                    <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                        $100
                    </span>
                </button>
            </BackgroundGradient>

        </div>
    )
}

export default ArtifactCard