from brownie import AuthNFT
from brownie import accounts


def deploy_auth_nft():
    auth_nft = AuthNFT.deploy({'from': accounts[0]})
    print(f'Deployed on {auth_nft.address}')
    tx = auth_nft.mint(accounts[0], {'from': accounts[0]})
    print(accounts[0])
    print(auth_nft.balanceOf(accounts[0]))
    print(auth_nft._getMeta(accounts[0], 0))

def main():
    deploy_auth_nft()
