import React,
       { useState, useEffect   } from "react";
import { useAccount,useNetwork,
         useContractWrite  , usePrepareContractWrite,
         useSendTransaction, usePrepareSendTransaction } from "wagmi";
import { ethers } from "ethers";
import ComponentQR    from './componentQR';
import crypto from 'crypto';
import axios from 'axios';

export function DepositContent() {
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
  const [secretUponDeposit, setSecretUponDeposit] = useState("");
  const [hashUponDeposit  , setHashUponDeposit] = useState("");

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

  const secret = 'yourSecretHere' + crypto.randomBytes(16).toString('hex');;
  const hash   = ethers.keccak256(ethers.toUtf8Bytes(secret));

  /* for writing to contract */
  const contractABI                           = contractJson.abi
  /*
  const { config: configContractWrite }       = usePrepareContractWrite({
    abi          : contractABI,
    chainId      : wagmi_network.chain?.id,
    address      : contractJson.networks[networkId].address,
    functionName : "deposit",
    args         : [hash],
    value        : ethers.parseEther("0.02"),
    onSuccess(data){
      console.log("Prepare ContractWrite: success" + data)
      setSecretUponDeposit(secret);
      console.log("secretUponDeposit: " + secretUponDeposit)
    },
    onError(error){
      console.log("Prepare ContractWrite: error: " + error)
    }
  }) 
  */
  const { data, isLoading, isSuccess, write } = useContractWrite({
    abi          : contractABI,
    chainId      : wagmi_network.chain?.id,
    address      : contractJson.networks[networkId].address,
    functionName : "deposit",
  }) 
  const buttonContractWriteClicked = async () => { 
    if (write){
      write({
        args         : [hash],
        value        : ethers.parseEther("1"),    
      });
      setSecretUponDeposit(secret);
      setHashUponDeposit  (hash  );
      console.log("secretUponDeposit - useState Var  : " + secretUponDeposit)
      console.log("secretUponDeposit - original Sec. : " + secret)
      console.log("hashUponDeposit   - useState Var  : " + hashUponDeposit)
      console.log("hashUponDeposit   - original Sec. : " + hash)

      /*
      try {
        // Call the QRPDFMobile API
        const response = await axios.get(`/api/QRPDFmobile?hash=${hash}&secret=${secretUponDeposit}`);
        const url = response.data.url;

        // Open the URL in a new tab (or in a mobile app)
        window.open(url, '_blank');
      } catch (err) {
        console.error(err);
      }
      */
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
            <button onClick={buttonContractWriteClicked}> [Issue "Cheque DeFi" ] </button><br />
            {isSuccess &&
             <ComponentQR hash={hash} secret={secretUponDeposit} />}
            <br/>
            <svg height="1">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="yellow" strokeWidth="5" />
            </svg>
            <p>❤zkbob_polygon:Heg67BoayN2uWqmQjy983PYvP8kDMmd6EaR3qwyGYxVctDueefxZdDWSWBxJeDv❤</p>
            <p>Account         : {account}</p>
            <p>Network ID      : {networkId}</p>
            <p>Network Name    : {networkName}</p>
            <p>Contract Address: {contractAddress}</p>
            <p>Block Explorer  : {blockExplorerUrl}</p>
            {isLoading && <p>Loading...</p>}
            {isSuccess &&
             <p>Success: {blockExplorerUrl?blockExplorerUrl:"" } { data?.hash } </p>}
          </div>
        }
      </div>
    </>
  )  
}

