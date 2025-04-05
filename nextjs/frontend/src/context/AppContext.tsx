import React, { useContext, useEffect, createContext, useCallback, useState} from "react"
import { useAccount, useReadContract, useWriteContract}  from "wagmi"
import { FactoryAddress  } from "@/helper/constant";
// import { abiMuseum } from "@/contract/Museum";
import { abi } from "@/contract/MuseumFactory";


interface DeployDetails {
    name: string;
    location: string;
    address: `0x${string}`
}

const MuseumContext = createContext({});

export const Museum = ({ children } : { children: React.ReactNode }) => {

    const id = 0;
    const [deployArray, setDeployArray] = useState<number[]>([]);
    const [deployFactoryDetails, setDeployFactoryDetails] = useState<DeployDetails>()



    const { address } = useAccount();
    // const { writeContractAsync } = useWriteContract();

    const { data: DeployAddressToNewContract } = useReadContract({
        abi: abi,
        address: FactoryAddress,
        functionName: "deployedAddressR",
        args: [address as `0x${string}`]
    })
    console.log(DeployAddressToNewContract);
    const { data: DeployAddressCount } = useReadContract({
        abi: abi,
        address: FactoryAddress,
        functionName: "deploymentCount",
        args: []
    })

     const { data: getDeployAddress } = useReadContract({
        abi: abi,
        address: FactoryAddress,
        functionName: "deployedAddress",
        args: [BigInt(id)]
    })
    

    const { data: DeployFactoryDetails } = useReadContract({
        abi: abi,
        address: FactoryAddress,
        functionName: "_deployed",
        args: [BigInt(0)]
    })

    const getFactoryDetails = useCallback(() => {
        if (!DeployFactoryDetails) return null;
        setDeployFactoryDetails({
            name: DeployFactoryDetails[0],
            location: DeployFactoryDetails[1],
            address: `0x${DeployFactoryDetails[2]}`
        })
    }, [])

    console.log(getDeployAddress)
    // console.log(DeployAddressCount)
    const deployaddress = DeployAddressCount ? Number(DeployAddressCount.toString()) : 0;
    
    const getAllDeployAddress = () => {
        if(!deployaddress) return null;
        // const deployAddressArray = []
        const deployAddressArray = Array.from({ length: Number(deployaddress) }, (_, i) => i);
       
        setDeployArray(deployAddressArray);
    }

    useEffect(() => {
        getAllDeployAddress();
    }, [deployaddress])

    console.log(deployArray)

   




    return (
        <MuseumContext.Provider value={[deployArray]}>
            {children}
        </MuseumContext.Provider>
    )

}

export const useMuseum = () => {
    return useContext(MuseumContext);
}