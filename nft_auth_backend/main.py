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

    signer = recover_signer(signed_message)
    print(f'signer: {signer}')
    print(f'token: {check_token_paid(signer)}')
    token = jwt.encode({'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, SECRET_KEY)
    return jsonify({'token': token})


def recover_signer(signed_message):
    message_hash = defunct_hash_message(text='auth')
    return w3.eth.account.recoverHash(message_hash, signature=signed_message)


def check_token_paid(account):
    return app.auth_nft.functions.paid(account, 0, 7).call()


if __name__ == '__main__':
    contract_json = json.load(open('compiled_contracts/AuthNFT.json', 'r'))
    auth_nft = w3.eth.contract(address='0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab', abi=contract_json['abi'])

    app.auth_nft = auth_nft
    app.run(debug=True)
