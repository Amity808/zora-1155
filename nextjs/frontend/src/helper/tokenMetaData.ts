import {
    generateTextNftMetadataFiles,
    makeTextTokenMetadata,
  } from "@zoralabs/protocol-sdk";
  import { pinFileWithPinata, pinJsonWithPinata } from "@/lib/pinta";
   
  export async function makeTextNftMetadata({ text, description }: { text: string, description: string }) {
    
    const {
      name,
      // file containing the text
      mediaUrlFile,
      thumbnailFile,
    } = await generateTextNftMetadataFiles(text);
   
    // upload text file and thumbnail to ipfs with Pinata
    const mediaFileIpfsUrl = await pinFileWithPinata(mediaUrlFile);
    const thumbnailFileIpfsUrl = await pinFileWithPinata(thumbnailFile);
   
   
    const metadataJson = makeTextTokenMetadata({
      name,
      description: description,
      textFileUrl: mediaFileIpfsUrl,
      thumbnailUrl: thumbnailFileIpfsUrl,
    });
    // convert json object to json file
    const jsonMetadataUri = await pinJsonWithPinata(metadataJson);
   
    return jsonMetadataUri;
  }

  