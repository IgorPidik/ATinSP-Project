# AuthNFT
We need to add some general info

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
