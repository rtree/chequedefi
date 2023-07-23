import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal, Web3NetworkSwitch   } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli, polygonMumbai, mantleTestnet       } from 'wagmi/chains'
import { DepositContent                             } from './depositContent'
import { RedeemContent } from './redeemContent'

const neonTestnet = {
  id: 245022926,
  name: "Neon Testnet",
  network: "neon",
  nativeCurrency: {
    decimals: 18,
    name: "NEON",
    symbol: "NEON",
  },
  rpcUrls: {
    /*
    default: {
      http: ["https://devnet.neonevm.org"],
    },
    public: {
      http: ["https://devnet.neonevm.org"],
    },
    */
    default: {
      http: ["https://proxy.devnet.neonlabs.org/solana"],
    },
    public: {
      http: ["https://proxy.devnet.neonlabs.org/solana"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Neon Testnet Explorer",
      url: "https://neonscan.org",
    },
    default: {
      name: "Neon Testnet Explorer",
      url: "https://neonscan.org",
    },
  },
  testnet: true,
};

const chains           = [goerli, polygonMumbai, mantleTestnet, neonTestnet ]
const projectId        = 'c28ab50b409578c6dcd2421279519bb9'
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig      = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function Redeem() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Web3Button></Web3Button>
        <Web3NetworkSwitch />
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <RedeemContent></RedeemContent>
      </WagmiConfig>
    </>
  )
}
