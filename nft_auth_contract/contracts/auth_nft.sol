// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// To read more about NFTs, checkout the ERC721 standard:
// https://eips.ethereum.org/EIPS/eip-721


contract AuthNFT is ERC721Enumerable {
    struct Date {
        uint256 year;
        uint256 month;
    }

    uint256 private tokenCounter = 0;
    // mapping tokenId -> year -> month -> prepaid
    mapping(uint256 => mapping(uint256 => mapping(uint256 => bool))) private prepaidDates;
    // mapping from tokenId to array of pre-paid dates
    mapping(uint256 => Date[]) private payedMonths;

    constructor() ERC721("AuthNFT", "ANFT") {}

    function mint(address recipient) public returns (uint256) {
        // _mint is a built in function that actually puts your NFT onto the blockchain
        _safeMint(recipient, tokenCounter);
        // every time you mint, increment the amount of tokens you've created by 1.
        tokenCounter = tokenCounter + 1;
        // we return the current token count, which is being used as the ID of the NFT.
        return tokenCounter;
    }

    function payMonth(uint256 tokenId, uint256 year, uint256 month) public payable {
        // Users should only be able to pay subscription for their own NFTs
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        // Users can't pay double for a month
        require(
            !prepaidDates[tokenId][year][month],
            "This month has already been payed for"
        );
        // Users should pay a specific amount
        require(
            msg.value == 100000000000000000,
            "Incorrect amount of ETH provided"
        );
        // Mark month as payed
        prepaidDates[tokenId][year][month] = true;
        payedMonths[tokenId].push(Date(year, month));
    }

    function getPayedMonths(uint256 tokenId) public view returns (Date[] memory) {
        return payedMonths[tokenId];
    }

    function authenticate(address owner, uint256 tokenId, uint256 year, uint256 month) public view returns (bool) {
        // check whether the token belongs to the address and whether a certain year and month combination has been paid
        return (ownerOf(tokenId) == owner) && prepaidDates[tokenId][year][month];
    }
}
