import React, { useState } from 'react'
import CustomInput from './ui/CustomInput'
// import CustomButton from './ui/CustomButton'
import useValidation from '@/hooks/useValidation'
import { validateAmount } from '@/helper/validation'
import { abi } from '../contract/MuseumFactory';
import { abiMuseum } from '@/contract/Museum';
import { useReadContract, useAccount, useSimulateContract, useWriteContract, usePublicClient } from 'wagmi';
import { FactoryAddress, Address_Zero } from '@/helper/constant'
import { parseEther } from 'viem';
import Link from 'next/link';
// import { creatorClient } from '../config/wagmi-config';
import { create1155 } from '@zoralabs/protocol-sdk';
import { makeContractMetadata } from '@/helper/Upload';
import { makeTextNftMetadata } from '@/helper/tokenMetaData';


const MintArtifact = () => {


    const [ticketPice, setTicketPice] = useState<string>('')
    const [imageURL, setImageURL] = useState<string>('')
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('')



    const isTicketPiceValid = useValidation(ticketPice, validateAmount);

    const { address } = useAccount();
    const publicClient = usePublicClient()!;
    const { writeContractAsync, writeContract } = useWriteContract();

    const { data: DeployAddressToNewContract } = useReadContract({
        abi: abi,
        address: FactoryAddress,
        functionName: "deployedAddressR",
        args: [address as `0x${string}`]
    })


    console.log(DeployAddressToNewContract, "token")

    const { data: simulateWriteContract, error: simulateWriteContractError, isLoading } = useSimulateContract({
        abi: abiMuseum,
        address: DeployAddressToNewContract,
        functionName: "createArtifact",
        args: [parseEther(ticketPice), imageURL]
    })


    const handleCreatArtifact = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await writeContractAsync(simulateWriteContract!.request)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }




    const handleCreateZoraNFT = async () => {
        

        try {
            if (!imageFile) {
                alert("Please upload an image file.");
                return;
            }

            const resTokenMeta = await makeTextNftMetadata({
                text: "MuseumArt"
            })

            const resContractMetaData = await makeContractMetadata({
                imageFile,
                name: "Museum Art",
                description: description
            });
            const { parameters, contractAddress } = await create1155({
                contract: {
                    name: "MuseumArtContract",
                    uri: resContractMetaData,
                },
                token: {
                    tokenMetadataURI: resTokenMeta,
                    salesConfig: {
                        erc20Name: "MuseumArt",
                        erc20Symbol: "MAT",
                        saleStart: BigInt(0),
                        marketCountdown: BigInt(24 * 60 * 60),
                        minimumMintsForCountdown: BigInt(1111),
                    },
                },
                account: address!,
                publicClient,
            });

            console.log(contractAddress);

        } catch (error) {
            console.log(error);
        }
    }





    return (
        <div className=' flex justify-center items-center mt-[24px] flex-col'>
            {
                DeployAddressToNewContract == Address_Zero ? (<>
                    <div className="flex justify-center items-center flex-col gap-4">
                        <h3 className=' font-bold'>You need to visit Get Started Page</h3>
                        <Link href="/start">
                            <p className="btn">Go to Get Started</p>
                        </Link>
                    </div>
                </>) : (
                    <>
                        <form action="" onSubmit={handleCreatArtifact}>
                            {/* <p className="text-red-900">{notification?.message}</p> */}

                            <CustomInput placeholder='Enter amount' error={isTicketPiceValid?.message ?? ""} type='number' value={ticketPice}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    //setTicketPice(e.target.value ?? 0);
                                    setTicketPice(e.target.value);
                                }} />

                            <div className='form-group mb-8'>
                                <input type='url' placeholder='Enter image URL' value={imageURL}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setImageURL(e.target.value)
                                    }} className='input' />
                            </div>

                            <button type='submit'>Create Artifact</button>
                            {simulateWriteContractError && <div className="text-red-900 text-sm">{simulateWriteContractError?.message}</div>}


                        </form>
                    </>
                )
            }
            <div>
                <div className='form-group mb-8'>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                        className='input'
                    />
                    <div className='form-group mb-8'>
                        <input type='test' placeholder='Enter image URL' value={description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDescription(e.target.value)
                            }} className='input' />
                    </div>
                </div>
                <button type='submit' className='text-white' onClick={handleCreateZoraNFT}>Mint</button>

            </div>


        </div>
    )
}

export default MintArtifact