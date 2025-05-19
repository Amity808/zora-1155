import React, { useContext, useEffect, createContext, useState, useCallback} from "react"
import { useAccount, useReadContract}  from "wagmi"
import { FactoryAddress  } from "@/helper/constant";
// import { abiMuseum } from "@/contract/Museum";
import { abi } from "@/contract/MuseumFactory";




const MuseumContext = createContext({});

export const Museum = ({ children } : { children: React.ReactNode }) => {

    const id = 0;
    const [deployArray, setDeployArray] = useState<number[]>([]);
    


    const { address } = useAccount();

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
    

 

    // const getFactoryDetails = useCallback(() => {
    //     if (!DeployFactoryDetails) return null;
    //     setDeployFactoryDetails({
    //         name: DeployFactoryDetails[0],
    //         location: DeployFactoryDetails[1],
    //         address: `0x${DeployFactoryDetails[2]}`
    //     })
    // }, [])

    console.log(getDeployAddress)
    // console.log(DeployAddressCount)
    const deployaddress = DeployAddressCount ? Number(DeployAddressCount.toString()) : 0;
    
    const getAllDeployAddress = useCallback(() => {
        if (!deployaddress) return null;
        const deployAddressArray = Array.from({ length: Number(deployaddress) }, (_, i) => i);
        setDeployArray(deployAddressArray);
    }, [deployaddress]);

    useEffect(() => {
        getAllDeployAddress();
    }, [deployaddress, getAllDeployAddress])

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