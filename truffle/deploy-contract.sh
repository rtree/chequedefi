#!/bin/bash
truffle compile
truffle migrate --network local
truffle migrate --network goerli
truffle migrate --network mumbai
truffle migrate --network mantleTestnet
truffle migrate --network neonTestnet
