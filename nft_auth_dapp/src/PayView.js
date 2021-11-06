import './App.css';
import {useWeb3React} from "@web3-react/core"
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ethers = require('ethers');

function PayView(props) {
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedNFT, setSelectedNFT] = useState(null)
    const {account, library} = useWeb3React()
    const [date, setDate] = useState(new Date())
    const months = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]


    useEffect(() => {
        setSelectedNFT(null)
    }, [account])

    const payMonth = () => {
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        console.log(month)
        console.log(year)
        props.onPayment(selectedNFT, year, month)
        console.log('PaymentMonth')
    }

    const nftTokenViews = props.nftIds.map((nftId) => {
        return (
            <div className={`col-3 nft ${nftId === selectedNFT && 'nft-selected'}`} key={nftId}
                 onClick={() => setSelectedNFT(nftId)}>
                <span>AuthNFT#{nftId}</span>
            </div>
        )
    })

    const paymentDataView = props.paymentData.map((items, index) => {
        return (
            <div className={'row'} key={index}>
                {index === selectedNFT && items.map((subItems, sIndex) => {
                    return (
                        <div className={`col-3 nft ${selectedMonth === sIndex && 'nft-selected'}`} key={sIndex}
                             onClick={() => setSelectedMonth(sIndex)}>
                            <span>Year: {subItems[0]} Month: {subItems[1]}</span>
                        </div>
                    )
                })}
            </div>
        )
    })

    const paymentDataViewList = props.paymentData.map((items, index) => {
        return (
            <div key={index}>
                {index === selectedNFT && items.map((subItems, sIndex) => {
                    return (
                        <li className={`list-group-item d-flex justify-content-between align-items-center text-white 
                        bg-dark`} key={sIndex}>
                            <span>{months[subItems[1]-1]}</span>
                            <span className="badge bg-info text-dark rounded-pill">{subItems[0]}</span>
                        </li>
                    )
                })}
            </div>
        )
    })

    const nftTokenViewsList = props.nftIds.map((nftId) => {
        return (
            <li className={`list-group-item d-flex justify-content-between align-items-center text-white
            ${nftId === selectedNFT ? 'active' : 'bg-dark'}`} key={nftId} onClick={() => setSelectedNFT(nftId)}>
                Authentication NFT
                <span className="badge bg-info text-dark rounded-pill">
                    ID: {nftId}
                </span>
            </li>
        )
    })


    return (
        <div className="card text-white bg-dark mb-3">
            <div className="card-body container-fluid">
                <h5 className="card-title text-center">Subscription</h5>
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Owned NFTs</h6>
                    <div className={'card-body'}>
                        <ol className="list-group">
                            {nftTokenViewsList}
                        </ol>
                    </div>
                </div>
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Subscribed Months</h6>
                    <div className={'card-body'}>
                        <ol className="list-group">
                            {paymentDataViewList}
                        </ol>
                    </div>
                </div>
                <div className={'card text-white bg-dark'}>
                    <h6 className={'card-header'}>Payment</h6>
                    <div className={'card-body'}>
                        <p className="card-text">Select a month for which you would like to subscribe</p>
                        <form>
                            <div className={'form-group'}>
                                <DatePicker className={'form-control bg-dark text-white'} type={'text'}
                                    selected={date}
                                    onChange={(d) => setDate(d)}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                />
                            </div>
                        </form>
                        <button className={'btn btn-primary w-100 mb-2 mt-3'} disabled={selectedNFT == null}
                                onClick={payMonth}>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayView;