# NFT-based Subscription Model for Service Authentication

## General
In this project we provide an implementation of NFT-based Subscription Model for Service Authentication. Where users can claim NFTs and pre-pay them for certain dates to gain access to restricted APIs of our backend service. This project is composed of 3 parts:

1. nft\_auth\_contract: contains the source code of our smart contract + deployment code
2. nft\_auth\_backend: miniml example implementation of an API service, which is capable of NFT authentication after which it provides a JWT token which can be later used to access restricted API endpoint
3. nft\_auth\_dapp: react DApp which lets the users connect to their wallets. After a user connects their wallet, they
are able to view their AuthNFTs, pre-pay them and use them authenticate with our backend service

## How to run the project
1. navigate to nft\_auth\_contract and follow the instruction described in README.md of that folder, afterwards you should have obtained the address of the deployed contract
2. navigate to nft\_auth\_backend, update `.env` with correct contract address and folow the instruction described in README.md of that folder.
3. navigate to nft\_auth\_dapp, update `.env` with correct contract address and folow the instruction described in README.md of that folder.
4. open [http://localhost:3000](http://localhost:3000) in your browser

Here you can connect your wallet, mint NFTs and pre-pay them. Then you can use them to obtain JWT token which is necessary for restricted APIs of our backend service. You can test the token right there or via another app such as Postman.

