# NFT Auth Backend
This service serves as a example for minimal implementation of an API backend, which supports authentication with a NFT. If the requirements (payment, ownership of the NFT) are met, then the caller receives JWT token which can then be used to access restricted APIs of this service. 

## Installing dependencies
To install dependencies run `pipenv install`

## Run the project
1. Replace the contract address in the `.env` file with the address where the contract is deployed
2. Reactivate the `pipenv` by running `exit` in the terminal, followed by `pipenv shell` to load in the new environment variables
3. Run `python3 main.py` to start the Flask application
