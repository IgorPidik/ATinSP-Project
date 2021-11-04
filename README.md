# NFT-based Subscription Model for Service Authentication

## General
In this project we provide an implementation of an NFT-based Subscription Model for Service Authentication. With this, users can claim NFTs and pre-pay them for certain dates to gain access to restricted APIs of our backend service. The project is composed of 3 parts:

1. nft\_auth\_contract: This contains the source code of our smart contract + deployment code
2. nft\_auth\_backend: This contains a minimal example implementation of an API service, which is capable of NFT authentication after which it provides a JWT token which can be later used to access restricted API endpoint
3. nft\_auth\_dapp: This contains a React DApp which lets the users connect to their wallets. After a user connects their wallet, they
are able to view their AuthNFTs, pre-pay them and use them authenticate with our backend service

## How to run the project
1. Navigate to nft\_auth\_contract and follow the instructions described in README.md of that folder. Remember to note the address where the contract is deployed.
3. Navigate to nft\_auth\_backend and follow the instructions described in README.md of that folder.
4. Navigate to nft\_auth\_dapp, and follow the instruction described in README.md of that folder.
5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application

Here you can connect your wallet, mint NFTs and pre-pay them. For this you will need a wallet plugin such as MetaMask. Then you can use them to obtain JWT token which is necessary for restricted APIs of our backend service. You can test the token right there or via another app such as Postman.

