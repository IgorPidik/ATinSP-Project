# AuthNFT
This project contains the smart contract of our AuthNFT. Our implementation extends the ERC721Enumerable implementation by OpenZeppelin. This smart contract acts as a source of truth for authentication in our backend service. It checks whether a given address is the owner of selected NFT and whether all the payment requirements have been satisfied. Furthermore, it contains convinience methods to pre-pay and gain access to our restricted APIs for certain months.

## Installing dependencies
### ganache-cli
Ganache CLI is the command line version of Ganache, your personal blockchain for Ethereum development. 

To install ganache-cli run the following command: `npm install -g ganache-cli`

More info: https://www.npmjs.com/package/ganache-cli

### brownie
Brownie is a Python-based development and testing framework for smart contracts targeting the Ethereum Virtual Machine.

To install brownie run the following commands:
```
python3 -m pip install --user pipx
python3 -m pipx ensurepath
pipx install eth-brownie
```
More info: https://eth-brownie.readthedocs.io/en/stable/install.html

## Run the project
1. Start Ganache CLI with `ganache-cli`
2. Connect your crypto wallet application (MetaMask for example) to the address where your personal blockchain is running (default: http://localhost:8545/).
3. Navigate to the project directory from a separate terminal
4. Compile the contract with `brownie compile`
5. Deploy the contract with `brownie run scripts/deploy.py`
6. Note the address where the contract is deployed, we will need to copy this to `.env` files later
