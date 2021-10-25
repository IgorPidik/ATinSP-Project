import './App.css';
import {useWeb3React} from "@web3-react/core"
import {injected} from "./connectors";
import React, {useEffect} from "react";

const ethers = require('ethers');


function App() {
    const {active, account, library, activate, deactivate} = useWeb3React()
    const contractAddress = '0x689fD8094594f6E62a6AF65bE25738e024bF7987'
    let authNFTContract = null

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
            authNFTContract = new ethers.Contract(contractAddress, abi, library);
        });
    }

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

    useEffect(() => {
        loadContract()
    })

    useEffect(() => {
        // listen for changes on an Ethereum address
        console.log(`effect, account: ${account}, active: ${active}`)
        // trigger the effect only on component mount
    }, [account, active])

    function generateSignedMessage() {
        library.getSigner(account).signMessage('auth').then((signature) => {
            console.log(signature)
        }).catch((error) => {
            console.log(error)
        })
    }

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
            {active &&
            <div className={'row justify-content-md-center my-2'}>
                <div className={'col-auto col-offset'}>
                    <button className={'btn btn-primary'} onClick={generateSignedMessage}>Generate message</button>
                </div>
            </div>
            }
        </div>
    );
}

export default App;
