import './App.css';
import {useWeb3React} from "@web3-react/core"
import {injected} from "./connectors";
import React, {useEffect, useState} from "react";
import AuthView from "./AuthView";

const ethers = require('ethers');


function App() {
    const {active, account, library, activate, deactivate} = useWeb3React()
    const [authNFTContract, setAuthNFTContract] = useState(null)

    const contractAddress = '0x689fD8094594f6E62a6AF65bE25738e024bF7987'

    function loadContract() {
        fetch('compiled_contracts/AuthNFT.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then((response) => {
            return response.json();
        }).then(contractJson => {
            const abi = contractJson['abi']
            setAuthNFTContract(new ethers.Contract(contractAddress, abi, library))
        });
    }

    useEffect(() => {
        if (library) {
            loadContract()
        }
    }, [library])

    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    function generateSignedMessage() {
        library.getSigner(account).signMessage('auth').then((signature) => {
            console.log(signature)
        }).catch((error) => {
            console.log(error)
        })
    }

    const activeAndReady = active && authNFTContract

    return (
        <div className={'container-fluid m-2'}>
            <div className={'row justify-content-md-center'}>
                <div className={'col-auto col-offset'}>
                    {active ?
                        <div>
                            <span>Connected with <b>{account}</b></span>
                            <button onClick={disconnect}
                                    className={'btn btn-danger mx-2'}>Disconnect
                            </button>
                        </div>
                        :
                        <button onClick={connect} className={'btn btn-primary'}>Connect to MetaMask</button>
                    }
                </div>
            </div>
            {activeAndReady &&
            <div className={'row justify-content-md-center my-2'}>
                <div className={'col-auto col-offset'}>
                    <AuthView contract={authNFTContract}/>
                </div>
            </div>
            }
        </div>
    );
}

export default App;
