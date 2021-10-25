import './App.css';
import {useWeb3React} from "@web3-react/core"
import React, {useEffect} from "react";

const ethers = require('ethers');


function AuthView(props) {
    const {account, library} = useWeb3React()

    const getNFTs = async (contract, account) => {
        const balance = await contract.balanceOf(account)
        let nftIds = []
        for (let i = 0; i < balance; i++) {
            const nftId = await contract.tokenOfOwnerByIndex(account, i)
            nftIds.push(nftId)
        }
        console.log(nftIds)
    }

    useEffect(() => {
        getNFTs(props.contract, account)
    }, [account, props.contract])

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
                    <p>Auth view</p>
                </div>
            </div>
        </div>
    );
}

export default AuthView;
