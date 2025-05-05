import { ContractMetadataJson, TokenMetadataJson } from "@zoralabs/protocol-sdk";
import { pinFileWithPinata, pinJsonWithPinata } from "@/lib/pinta";


export async function makeContractMetadata({
    imageFile,
    videoFile,
    name,
    description,
  }: {
    imageFile: File;
    videoFile: string;
    name: string;
    description?: string;
  }) {
    // upload image to Pinata
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
    // const animationVideo = await pinFileWithPinata(videoFile)
   
    // build contract metadata json
    const metadataJson = {
      description,
      image: imageFileIpfsUrl,
      name,
      animation_url: videoFile,
      "properties": {
        "category": "social"
      },
    };
   
    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }