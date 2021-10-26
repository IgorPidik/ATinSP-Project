import datetime
import json
from functools import wraps
import jwt
from web3 import Web3
from flask import Flask, request, jsonify
from eth_account.messages import defunct_hash_message
from flask_cors import CORS

SECRET_KEY = 'secret'
app = Flask(__name__)
CORS(app)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))


def abort_invalid_token():
    return jsonify({'message': 'a valid token is missing'}), 401


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        if 'Authorization' not in request.headers:
            return abort_invalid_token()

        header_data = request.headers['Authorization']
        header_parts = header_data.split(' ')
        if len(header_parts) != 2 or header_parts[0] != 'Bearer':
            return abort_invalid_token()
        token = header_parts[1]
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return abort_invalid_token()

        return f(*args, **kwargs)

    return decorator


@app.route('/restricted_service', methods=['GET'])
@token_required
def restricted_service():
    return jsonify({'message': 'protected service'})


@app.route('/auth', methods=['POST'])
def auth():
    signed_message = request.json['signed_message']
    nft_id = request.json['nft_id']
    signer = recover_signer(signed_message)
    if authenticate(signer, nft_id):
        token = jwt.encode({'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, SECRET_KEY)
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
    contract_json = json.load(open('compiled_contracts/AuthNFT.json', 'r'))
    auth_nft = w3.eth.contract(address='0x0290FB167208Af455bB137780163b7B7a9a10C16', abi=contract_json['abi'])

    app.auth_nft = auth_nft
    app.run(debug=True)
