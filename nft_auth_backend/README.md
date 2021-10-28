# NFT Auth Backend
This service serves as a example for minimal implementation of an API backend, which supports authentication with a NFT. If requirements (payment, ownership of the NFT) are met, then the caller receives JWT token which can then be used to access restricted APIs of this service. 

## Installing dependencies
To install dependencies run `pipenv install`

## Run the project
1. make sure you have compiled and deployed the contract
2. replace contract address in the `.env` file with correct address
3. run `python3 main.py`
