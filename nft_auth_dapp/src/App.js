import './App.css';
import {useWeb3React} from "@web3-react/core"
import {injected} from "./connectors";
import React, {useEffect, useState} from "react";
import AuthView from "./AuthView";
import PayView from "./PayView";
import axios from "axios";

const ethers = require('ethers');


function App() {
    const {active, account, library, activate, deactivate} = useWeb3React()
    const [authNFTContract, setAuthNFTContract] = useState(null)
    const [nftIds, setNftIds] = useState([])
    const [paymentData, setPaymentData] = useState([])

    // automatically load contract when library (w3 provider) is loaded
    useEffect(() => {
        if (library) {
            loadContract()
        }
    }, [library])

    // automatically fetch NFTs when contract is ready or the user changed their account
    useEffect(() => {
        setNftIds([])
        fetchNFTs()
    }, [authNFTContract, account])

    useEffect(() => {
        setPaymentData([])
        fetchMonthsPayed()
    }, [authNFTContract, account, nftIds])

    // load and instantiate contract from local json file
    const loadContract = () => {
        axios.get('compiled_contracts/AuthNFT.json').then(response => {
            const abi = response.data['abi']
            setAuthNFTContract(new ethers.Contract(process.env.REACT_APP_AUTH_TOKEN_CONTRACT_ADDRESS, abi, library))
        });
    }

    // fetch the ids of NFTs owned by the active account
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

    // connect to a wallet
    const connect = async () => {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    // disconnect from a wallet
    const disconnect = () => {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    const mintNFT = async () => {
        // create and sign minting transaction
        const rawTransaction = await authNFTContract.populateTransaction.mint(account)
        const mintTransaction = await library.getSigner(account).sendTransaction(rawTransaction)
        // wait for the transaction to finish and re-fetch NFTs
        mintTransaction.wait().then((_) => {
            fetchNFTs()
        })
    }

    const payMonthNFT = async (nftId, year, month) => {
        const overrides = {
            value: ethers.utils.parseEther("0.1")
        }
        const rawTransaction = await authNFTContract.populateTransaction.payMonth(nftId, year, month, overrides)
        const payMonthTransaction = await library.getSigner(account).sendTransaction(rawTransaction)

        payMonthTransaction.wait().then((_) => {
            fetchMonthsPayed()
        });
    }

    const fetchMonthsPayed = async () => {
        let paymentData = []
        if (authNFTContract && account) {
            for (let nftId of nftIds) {
                let paymentDataNft = await authNFTContract.getPayedMonths(nftId)
                let paymentDataProcessed = paymentDataNft.map(p => p.map(x => x.toNumber()))
                paymentData.push(paymentDataProcessed)
            }
            setPaymentData(paymentData)
        }
    }

    const activeAndReady = active && authNFTContract

    return (
        <div className={'container-fluid mt-4'}>
            <div className={'row justify-content-md-center'}>
                <div className={'col-auto col-offset'}>
                    {active ?
                        <div>
                            <span>Connected with <b>{account}</b></span>
                            <button onClick={disconnect}
                                    className={'btn btn-danger ms-2'}>Disconnect
                            </button>
                        </div>
                        :
                        <button onClick={connect} className={'btn btn-primary'}>Connect to MetaMask</button>
                    }
                </div>
            </div>
            {activeAndReady &&
            <div className={'row justify-content-md-center mt-4'}>
                <div className={'col-md-3 col-offset'}>
                    <AuthView nftIds={nftIds} onMint={mintNFT}/>
                </div>
                <div className={'col-md-3 col-offset'}>
                    <PayView nftIds={nftIds} onPayment={payMonthNFT} paymentData={paymentData}/>
                </div>
            </div>
            }
        </div>
    );
}

export default App;
