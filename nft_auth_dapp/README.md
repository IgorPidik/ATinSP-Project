# AuthNFT DApp
Our AuthNFT DApp is built in React and lets the users connect to their wallets. After a user connects their wallet, they
are able to view their AuthNFTs, pre-pay them and use them authenticate with our backend service and generate a JWT token
(if all payment requirements have been satisfied). Later, they can use the provided token to make requests to restricted APIs
of our backend service.

## Installing dependencies
To install dependencies run: `npm install`

## Run the project
1. make sure to replace `REACT_APP_AUTH_TOKEN_CONTRACT_ADDRESS` with your contract address in the `.env` file
2. run `npm start`
3. open [http://localhost:3000](http://localhost:3000) in your browser
