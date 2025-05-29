import React, { useState } from 'react'
// import CustomButton from './ui/CustomButton'

import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

// import { creatorClient, walletClient } from '../config/wagmi-config';
// import { create1155 } from '@zoralabs/protocol-sdk';
import { makeContractMetadata } from '@/helper/Upload';
// import { makeTextNftMetadata } from '@/helper/tokenMetaData';
import { createCoin } from '@zoralabs/coins-sdk';
import useLoading from '@/hooks/useLoading';

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true, // Only use this in a secure environment
});



const MintArtifact = () => {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoAnime, setVideoAnime] = useState<string>('')
    const [prompt, setPrompt] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [name, setName] = useState<string>('')

    const { startLoading, stopLoading, isLoading } = useLoading()



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




    // TODO implement a generative AI that generate Description to Video

    const generateImageWithOpenAI = async (prompt: string) => {
        try {
            const response = await openai.images.generate({
                model: "dall-e-3", // Use DALL·E 3 model
                prompt: prompt,
                n: 1, // Number of images to generate
                size: "1024x1024", // Image size
            });

            const imageUrl = response?.data?.[0].url || null;
            if (!imageUrl) {
                throw new Error("Failed to generate image");
            }
        
             // Set the generated image in state
            return imageUrl;
        } catch (error) {
            console.error("Error generating image with OpenAI:", error);
            throw error;
        }
    };


    const createToken = async () => {
        startLoading();
        try {
            if (!address) {
                alert("Please connect your wallet.");
                return;
            }
            if (!imageFile) {
                alert("Please upload an image file.");
                return;
            }

           

            const animeFile = await generateImageWithOpenAI(prompt);
            setVideoAnime(animeFile)

            const resContractMetaData = await makeContractMetadata({
                imageFile,
                name: "Museum Art",
                description: description,
                videoFile: animeFile
            });


            const coinParams = {
                name: name,
                symbol: 'MUSE',
                //'ipfs://bafkreiausuhse4h7c3i4g6jalnasxu5jjondktr335f45elow3epbhog3y'
                uri: resContractMetaData,
                payoutRecipient: address as `0x${string}`,
                platformReferrer: address as `0x${string}`,
            };

            const contractCallParams = await createCoin(coinParams, walletClientc!, publicClient);


            console.log(contractCallParams, "response")

        } catch (error) {
            console.log(error);
            stopLoading();
        }
    }



  




    return (
        <div className=' flex justify-center items-center mt-[24px] flex-col'>

            <div className=' flex items-center flex-col justify-center'>
            <div className="image">
          <img src={videoAnime || "./image.png"} 
          className="w-32 h-32"  alt="AI Generated Image" />
        </div>

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
                        <input
                            type='text'
                            placeholder='Prompt for Image Video' 
                            value={prompt}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className='form-group mb-8'>
                        <input type='text' className='input'
                            value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder='Token Artifact Name' />
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
            <button type='submit' className='text-black p-2 bg-white rounded-2xl' disabled={isLoading} onClick={createToken}>
                {isLoading ? "Creating..." : "Create Token"}
            </button>

            

        </div>
    )
}

export default MintArtifact
