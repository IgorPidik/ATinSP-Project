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
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))


@app.route('/restricted_service', methods=['GET'])
@token_required
def restricted_service():
    return jsonify({'random_number': random.randint(0, 9)})


@app.route('/auth', methods=['POST'])
def auth():
    signed_message = request.json['signed_message']
    nft_id = request.json['nft_id']
    signer = recover_signer(signed_message)
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
    message_hash = defunct_hash_message(text='auth')
    return w3.eth.account.recoverHash(message_hash, signature=signed_message)


def authenticate(account, token_id):
    now = datetime.datetime.utcnow()
    return app.auth_nft.functions.authenticate(account, token_id, now.year, now.month).call()


if __name__ == '__main__':
    load_dotenv()
    contract_json = json.load(open('compiled_contracts/AuthNFT.json', 'r'))
    auth_nft = w3.eth.contract(address=os.environ.get('AUTH_TOKEN_CONTRACT_ADDRESS'), abi=contract_json['abi'])

    app.auth_nft = auth_nft
    app.run(debug=True)
