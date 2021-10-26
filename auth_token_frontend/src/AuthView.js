import './App.css';
import {useWeb3React} from "@web3-react/core"
import React, {useEffect, useState} from "react";
import axios from "axios";

function AuthView(props) {
    const {account, library} = useWeb3React()
    const [selectedNFT, setSelectedNFT] = useState(null)
    const [jwt, setJwt] = useState(null)
    const [jwtError, setJwtError] = useState(null)
    const [requestResponse, setRequestResponse] = useState(null)

    useEffect(() => {
        setSelectedNFT(null)
    }, [account, props.nftIds])

    useEffect(() => {
        setJwt(null)
        setJwtError(null)
    }, [account, selectedNFT])

    const authenticate = async () => {
        const signature = await library.getSigner(account).signMessage('auth')
        const requestData = {
            'signed_message': signature,
            'nftId': selectedNFT
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
            console.log(response.data)
            setRequestResponse(JSON.stringify(response.data))
        }).catch((e) => {
            console.log(e)
            setRequestResponse(JSON.stringify(e.message))
        })
    }

    const nftTokenViews = props.nftIds.map((nftId) => {
        return <div className={'col'} key={nftId} onClick={() => setSelectedNFT(nftId)}>{nftId}</div>
    })

    return (
        <div className="card text-white bg-dark mb-3">
            <div className="card-body container-fluid">
                <h5 className="card-title text-center">Authentication</h5>
                <p><b>Step 1:</b> Select or mint NFT token to authenticate with</p>
                <div className={'row'}>
                    {nftTokenViews}
                    <div className={'col'} onClick={props.onMint}>+</div>
                </div>
                <p><b>Step 2:</b> Authenticate</p>
                {jwt ? <p>Your JWT token: {jwt}</p> :
                    <button className={'btn btn-primary w-100'} disabled={selectedNFT == null}
                            onClick={authenticate}>Authenticate</button>}
                {jwtError && <p>Authentication error: {jwtError}</p>}
                <p><b>Step 3:</b> Make a request to restricted API</p>
                <button className={'btn btn-primary w-100'} disabled={jwt == null} onClick={makeRequestToRestrictedAPI}>Make a request</button>
                {requestResponse && <p>Response: {requestResponse}</p>}
            </div>
        </div>
    );
}

export default AuthView;
