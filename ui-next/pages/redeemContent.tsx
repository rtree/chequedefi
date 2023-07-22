import React,
       { useState, useEffect   } from "react";
import { useAccount,useNetwork,
         useContractWrite  , usePrepareContractWrite,
         useSendTransaction, usePrepareSendTransaction } from "wagmi";
import { ethers } from "ethers";
import { useRouter } from 'next/router';

export function RedeemContent() {
  const [domLoaded, setDomLoaded] = useState(false);
  const contractJson                          = require("../../truffle/build/contracts/ChequeDefi.json");

  /* for reading */
  const wagmi_account                         = useAccount()
  const wagmi_network                         = useNetwork()
  const [networkId, setNetworkId]             = useState(5);
  const [networkName, setNetworkName]         = useState("");
  const [account, setAccount]                   = useState("");
  const [contractAddress, setContractAddress]   = useState("");
  const [blockExplorerUrl, setBlockExplorerUrl] = useState("");

  const router = useRouter();
  const { secretq = '', networkIdq = 0 } = router.query;

  const secret = secretq?(Array.isArray(secretq)?'yourSecretHere---':secretq):'yourSecretHere---';
  const hash   = ethers.keccak256(ethers.toUtf8Bytes(secret));
  const depositedNetwork = Number(networkIdq?(Array.isArray(networkIdq)?0:networkIdq):0);
  
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    setAccount(wagmi_account.address?wagmi_account.address:"");
    setNetworkId(wagmi_network.chain?.id   ?wagmi_network.chain?.id:5);
    setNetworkName(wagmi_network.chain?.name   ?wagmi_network.chain?.name:"goerli");
    setContractAddress(contractJson.networks[networkId].address?contractJson.networks[networkId].address:"");
    setBlockExplorerUrl(wagmi_network.chain?.blockExplorers?.[0]?.url?wagmi_network.chain?.blockExplorers?.[0]?.url:"");
    console.log("useEffect wagmi_network.chain?.id: ", wagmi_network.chain?.id);
  }, [wagmi_network.chain?.id])


  /* for writing to contract */
  const contractABI                           = contractJson.abi
  const { config: configContractWrite }       = usePrepareContractWrite({
    abi          : contractABI,
    chainId      : wagmi_network.chain?.id,
    address      : contractJson.networks[networkId].address,
    functionName : "redeem",
    args         : [hash, secret],
    onSuccess(data){
      console.log("Prepare ContractWrite: success" + data)
    },
    onError(error){
      console.log("Prepare ContractWrite: error: " + error)
    }
  }) 
  const { data, isLoading, isSuccess, write } = useContractWrite(configContractWrite)
  const buttonContractWriteClicked = () => { 
    if (write){
      write();
    }
  }

  console.log("re-rendered content.tsx")
  return (
    <>
      <div>
        {domLoaded &&
          !wagmi_account.address && <p>Wagmi not connected.</p>
        }
        {domLoaded &&
          wagmi_account.address && 
          <div>
            <svg height="1">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="yellow" strokeWidth="5" />
            </svg>
            <br/>
            <br/>
            <button onClick={buttonContractWriteClicked}>[Redeem]</button><br />
            { wagmi_network.chain?.id != depositedNetwork &&
            <p>
              Warning: Fund to redeem is in different network. Please connect to &nbsp;
              {wagmi_network.chains[depositedNetwork] 
                ? wagmi_network.chains[depositedNetwork].name 
                : depositedNetwork
              }.
            </p>
            }
            <svg height="1">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="yellow" strokeWidth="5" />
            </svg>
            <p>Account         : {account}</p>
            <p>Network ID      : {networkId}</p>
            <p>Network Name    : {networkName}</p>
            <p>Contract Address: {contractAddress}</p>
            <p>Block Explorer  : {blockExplorerUrl}</p>
            {isLoading && <p>Loading...</p>}
            {isSuccess && <p>Success: {blockExplorerUrl?blockExplorerUrl:"" } { data?.hash } </p>}
          </div>
        }
      </div>
    </>
  )  
}

