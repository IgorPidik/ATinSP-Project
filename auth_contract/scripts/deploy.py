from brownie import AuthNFT
from brownie import accounts


def main():
    # deploys the contract using one of the pre-generated accounts
    auth_nft = AuthNFT.deploy({'from': accounts[0]})
    print(f'Deployed on {auth_nft.address}')
