import React from "react";

function NFTTokenViewsList(props) {
    const nftTokenViewsList = props.nftIds.map((nftId) => {
        return (
            <li className={`list-group-item d-flex justify-content-between align-items-center text-white
            ${nftId === props.selectedNFT ? 'active' : 'bg-dark'}`} key={nftId}
                onClick={() => props.onNFTSelected(nftId)}>
                Authentication NFT
                <span className="badge bg-info text-dark rounded-pill">
                    ID: {nftId}
                </span>
            </li>
        )
    })

    return (
        <ol className="list-group">
            {nftTokenViewsList}
        </ol>
    )
}

export default NFTTokenViewsList;
