import './App.css';
import {useWeb3React} from "@web3-react/core"
import {injected} from "./connectors";
import React, {useEffect, useState} from "react";
import AuthView from "./AuthView";
import axios from "axios";

const ethers = require('ethers');


function App() {
    const {active, account, library, activate, deactivate} = useWeb3React()
    const [authNFTContract, setAuthNFTContract] = useState(null)
    const [nftIds, setNftIds] = useState([])

    const contractAddress = '0x0290FB167208Af455bB137780163b7B7a9a10C16'

    useEffect(() => {
        if (library) {
            loadContract()
        }
    }, [library])

    useEffect(() => {
        setNftIds([])
        fetchNFTs()
    }, [authNFTContract, account])

    const loadContract = () => {
        axios.get('compiled_contracts/AuthNFT.json').then(response => {
            const abi = response.data['abi']
            setAuthNFTContract(new ethers.Contract(contractAddress, abi, library))
        });
    }

    const fetchNFTs = async () => {
        if (authNFTContract && account) {
            const balance = await authNFTContract.balanceOf(account)
            let nftIds = []
            for (let i = 0; i < balance; i++) {
                const nftId = await authNFTContract.tokenOfOwnerByIndex(account, i)
                nftIds.push(nftId.toNumber())
            }
            setNftIds(nftIds)
        }
    }

    const connect = async () => {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    const disconnect = () => {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    const mintNFT = async () => {
        const rawTransaction = await authNFTContract.populateTransaction.mint(account)
        const mintTransaction = await library.getSigner(account).sendTransaction(rawTransaction)
        console.log(mintTransaction)
        mintTransaction.wait().then((receipt) => {
            console.log(receipt)
            fetchNFTs()
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
                <div className={'col-md-3 col-offset'}>
                    <AuthView nftIds={nftIds} onMint={mintNFT}/>
                </div>

                <div className={'col-md-3 col-offset'}>
                    {/*    Pre-pay view*/}
                </div>
            </div>
            }
        </div>
    );
}

export default App;
