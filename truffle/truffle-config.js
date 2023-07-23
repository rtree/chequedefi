require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, MNEMONIC, LOCAL_MNEMONIC } = process.env;

module.exports = {
  networks: {
    local: {
      host: "172.25.48.1",
      port: 7545,
      network_id: "1337"
    },
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY), //Infura
      network_id: '5',
      gas: 4465030,
    },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://floral-wider-borough.matic-testnet.discover.quiknode.pro/1ca338a69ef1ab27e9090a156dbb179b1191dadc/`), //QuickNode
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
      },
    mantleTestnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://mantle-testnet.rpc.thirdweb.com`), 
      network_id: 5001 // mantle testnet
    },
    neonTestnet: {
      //provider: () => new HDWalletProvider(MNEMONIC, `https://devnet.neonevm.org`),
      provider: () => new HDWalletProvider(MNEMONIC, `https://proxy.devnet.neonlabs.org/solana`),
      network_id: 245022926 // neon testnet
    },
  },
  mocha: {
    // timeout: 100000
  },      
  compilers: {
    solc: {
    version: "0.8.13",
    }
  }
};
