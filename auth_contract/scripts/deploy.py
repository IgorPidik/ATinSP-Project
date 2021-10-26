from brownie import AuthNFT
from brownie import accounts


def deploy_auth_nft():
    auth_nft = AuthNFT.deploy({'from': accounts[0]})
    print(f'Deployed on {auth_nft.address}')
    auth_nft.mint(accounts[0], {'from': accounts[0]})


def main():
    deploy_auth_nft()
