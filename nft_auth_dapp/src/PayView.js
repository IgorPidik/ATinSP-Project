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
                        <div className={`col-3 nft ${subItems === false && 'month-payed' } 
                            ${selectedMonth === sIndex && 'nft-selected'}`} key={sIndex}
                             onClick={() => setSelectedMonth(sIndex)}>
                            <span>{index}</span>
                        </div>
                    )
                })}
            </div>
        )
    })


    return (
        <div className="card text-white bg-dark mb-3">
            <div className="card-body container-fluid">
                <h5 className="card-title text-center">Payment</h5>
                <p>1. Select NFT token</p>
                    <div className={'row'}>
                        {nftTokenViews}
                    </div>
                <p>2. Select month</p>
                    {paymentDataView}
                <DatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                />
                <p>3. Payment</p>
                <button className={'btn btn-primary w-100 mb-2'} disabled={selectedNFT == null}
                        onClick={payMonth}>
                    Subscribe
                </button>
            </div>
        </div>
    );
}

export default PayView;