import datetime
import json
import os

from dotenv import load_dotenv
import jwt
from web3 import Web3
from flask import Flask, request, jsonify
from eth_account.messages import defunct_hash_message
from flask_cors import CORS
import random

from token_required_wrapper import token_required

app = Flask(__name__)
CORS(app)


@app.route('/restricted_service', methods=['GET'])
@token_required
def restricted_service():
    """
    restricted service (random number generator) which can be accessed only with a valid JWT token
    """
    return jsonify({'random_number': random.randint(0, 9)})


@app.route('/auth', methods=['POST'])
def auth():
    """
    authentication method which first securely recovers signer address and uses smart contract to decide whether the
    requester should be authenticated
    """
    signed_message = request.json['signed_message']
    nft_id = request.json['nft_id']
    # recover address of the signer
    signer = recover_signer(signed_message)
    # use smart contract to check whether the signer is owner of the NFT and whether payment requirements were satisfied
    if authenticate(signer, nft_id):
        token = jwt.encode(
            # Make JWT valid till the midnight
            {'exp': datetime.datetime.utcnow().replace(hour=23, minute=59)},
            os.environ.get('JWT_SECRET')
        )
        return jsonify({'token': token})
    else:
        return jsonify({'message': 'unable to authenticate with provided NFT'}), 401


def recover_signer(signed_message):
    """
    gets the address of the account that signed the message with their private key
    """
    message_hash = defunct_hash_message(text='auth')
    return app.w3.eth.account.recoverHash(message_hash, signature=signed_message)


def authenticate(account, token_id):
    now = datetime.datetime.utcnow()
    # use smart contract to check whether the signer is owner of the NFT and whether payment requirements were satisfied
    # for current month and year
    return app.auth_nft.functions.authenticate(account, token_id, now.year, now.month).call()


if __name__ == '__main__':
    load_dotenv()
    # inject w3 instance
    app.w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

    # load contract
    contract_json = json.load(open('compiled_contracts/AuthNFT.json', 'r'))
    auth_nft = app.w3.eth.contract(address=os.environ.get('AUTH_TOKEN_CONTRACT_ADDRESS'), abi=contract_json['abi'])

    # inject contract instance
    app.auth_nft = auth_nft

    # run flask app
    app.run(debug=True)
