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
1. start Ganache CLI with `ganache-cli`
2. in a separate terminal navigate to the project directory
3. compile the contract with `brownie compile`
4. deploy the contract with `brownie run scripts/deploy.py`
5. grab contract address from the transaction log and upload .env files in the backend and dApp projects
