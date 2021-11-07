import './App.css';
import {useWeb3React} from "@web3-react/core"
import React, {useEffect, useState} from "react";
import axios from "axios";
import NFTTokenViewsList from "./NFTTokenViewsList";

function AuthView(props) {
    const {account, library} = useWeb3React()
    const [selectedNFT, setSelectedNFT] = useState(null)
    const [jwt, setJwt] = useState(null)
    const [jwtError, setJwtError] = useState(null)
    const [requestResponse, setRequestResponse] = useState(null)

    // automatically unselect NFT when the account changes
    useEffect(() => {
        setSelectedNFT(null)
    }, [account])

    // reset JWT and JWT values when different NFT is selected or the account changes
    useEffect(() => {
        setJwt(null)
        setJwtError(null)
    }, [account, selectedNFT])

    const authenticate = async () => {
        // create a signed message using the accounts private key to prove ownership
        const signature = await library.getSigner(account).signMessage('Please sign this message to confirm wallet ownership.')

        // make a request to the backend service to obtain JWT
        const requestData = {
            'signed_message': signature,
            'nft_id': selectedNFT
        }
        axios.post('http://localhost:5000/auth', requestData).then((response) => {
            setJwt(response.data.token)
        }).catch((e) => {
            console.log(e)
            setJwtError(e.message)
        })
    }

    const makeRequestToRestrictedAPI = () => {
        const headers = {
            'Authorization': 'Bearer ' + jwt
        }
        axios.get('http://localhost:5000/restricted_service', {headers: headers}).then((response) => {
            setRequestResponse(JSON.stringify(response.data.random_number))
        }).catch((e) => {
            console.log(e)
            setRequestResponse(JSON.stringify(e.message))
        })
    }

    return (
        <div className="card text-white bg-dark mb-3">
            <div className="card-body container-fluid">
                <h5 className="card-title text-center">Authentication</h5>
                <div className={'card text-white bg-dark'}>
                    {/* Mint */}
                    <h6 className={'card-header'}>Mint NFT</h6>
                    <div className={'card-body'}>
                        <button className={'btn btn-primary w-100 mb-2 mt-3'}
                                onClick={props.onMint}>
                            Mint
                        </button>
                    </div>
                </div>
                {/* select NFT */}
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Select NFT token to authenticate with</h6>
                    <div className={'card-body'}>
                        <NFTTokenViewsList nftIds={props.nftIds} selectedNFT={selectedNFT}
                                           onNFTSelected={setSelectedNFT}/>
                    </div>
                </div>

                {/* Auth */}
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Authenticate</h6>
                    <div className={'card-body'}>
                        <button className={'btn btn-primary w-100 mb-2'} disabled={selectedNFT == null}
                                onClick={authenticate}>Authenticate
                        </button>
                        {jwt && <p>Your JWT token: {jwt}</p>}
                        {jwtError && <p>Authentication error: {jwtError}</p>}
                    </div>
                </div>

                {/* Request to restricted API */}
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Make a request to restricted API</h6>
                    <div className={'card-body'}>
                        <button className={'btn btn-primary w-100 mb-2'} disabled={jwt == null}
                                onClick={makeRequestToRestrictedAPI}>Make a request
                        </button>
                        {requestResponse && <p>Response: {requestResponse}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthView;
