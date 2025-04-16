import React, { useState } from 'react'
// import CustomButton from './ui/CustomButton'

import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

// import { creatorClient, walletClient } from '../config/wagmi-config';
import { create1155 } from '@zoralabs/protocol-sdk';
import { makeContractMetadata } from '@/helper/Upload';
import { makeTextNftMetadata } from '@/helper/tokenMetaData';
import { createCoin } from '@zoralabs/coins-sdk';


const MintArtifact = () => {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [symbol, setSymbol] = useState<string>('')



    // const isTicketPiceValid = useValidation(ticketPice, validateAmount);

    const { address } = useAccount();
    const publicClient = usePublicClient()!;
    const { data: walletClientc } = useWalletClient()!;
    // const { writeContractAsync, writeContract, status } = useWriteContract();

    // const { data: DeployAddressToNewContract } = useReadContract({
    //     abi: abi,
    //     address: FactoryAddress,
    //     functionName: "deployedAddressR",
    //     args: [address as `0x${string}`]
    // })



    // const { data: simulateWriteContract, error: simulateWriteContractError, isLoading } = useSimulateContract({
    //     abi: abiMuseum,
    //     address: DeployAddressToNewContract,
    //     functionName: "createArtifact",
    //     args: [parseEther(ticketPice), imageURL]
    // })


    // const handleCreatArtifact = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     try {
    //         const result = await writeContractAsync(simulateWriteContract!.request)
    //         console.log(result)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }





    const createToken = async () => {
        try {
            if (!address) {
                alert("Please connect your wallet.");
                return;
            }
            if (!imageFile) {
                alert("Please upload an image file.");
                return;
            }

            const resContractMetaData = await makeContractMetadata({
                imageFile,
                name: "Museum Art",
                description: description
            });

            // console.log(resContractMetaData, "resContractMetaData")
            const coinParams = {
                name: name,
                symbol: symbol,
                //'ipfs://bafkreiausuhse4h7c3i4g6jalnasxu5jjondktr335f45elow3epbhog3y'
                uri: resContractMetaData,
                payoutRecipient: address as `0x${string}`,
                platformReferrer: address as `0x${string}`,
            };

            const contractCallParams = await createCoin(coinParams, walletClientc, publicClient);


            console.log(contractCallParams, "response")

        } catch (error) {
            console.log(error);
        }
    }



    const handleCreateZoraNFT = async () => {


        try {
            if (!imageFile) {
                alert("Please upload an image file.");
                return;
            }

            const resTokenMeta = await makeTextNftMetadata({
                text: "MuseumArt",
                description: "Museum Art Tradable token"
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

            <div className=' flex items-center flex-col justify-center'>

                <div className='form-group mb-8'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Pick a file</legend>
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
                        <label className="fieldset-label">Max size 2MB</label>
                    </fieldset>
                    <div className='form-group mb-8'>
                        <input type='text' className='input'
                            value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder='Token Artifact Name' />
                    </div>
                    <div className='form-group mb-8'>
                        <input type='text' className='input'
                            value={symbol} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.target.value)}
                            placeholder='Artifact Symbol' />
                    </div>
                    <div className='form-group mb-8'>
                        <textarea placeholder='Enter description' value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setDescription(e.target.value)
                            }
                            } className='input' />

                    </div>
                </div>

            </div>
            <button type='submit' className='text-black p-2 bg-white rounded-2xl' onClick={createToken}>Create Token</button>


        </div>
    )
}

export default MintArtifact