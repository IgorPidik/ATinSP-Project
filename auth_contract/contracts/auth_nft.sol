// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// To read more about NFTs, checkout the ERC721 standard:
// https://eips.ethereum.org/EIPS/eip-721

/**
NOTE: THIS WILL NOT BE AUTOMATICALLY COMPILED.
If you want it to compile, either import it into contract.sol or copy and paste the contract directly into there!
**/

contract AuthNFT is ERC721Enumerable, Ownable {
    uint256 public tokenCounter = 0;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => bool))) public prepaidDates;

    constructor() ERC721("AuthNFT", "ANFT") {}

    function mint(address recipient) public returns (uint256) {
        // _mint is a built in function that actually puts your NFT onto the blockchain
        _safeMint(recipient, tokenCounter);
        // every time you mint, increment the amount of tokens you've created by 1.
        tokenCounter = tokenCounter + 1;
        // we return the current token count, which is being used as the ID of the NFT.
        return tokenCounter;
    }

    function authenticate(address owner, uint256 tokenId, uint256 year, uint256 month) public view returns (bool) {
        return (ownerOf(tokenId) == owner) && prepaidDates[tokenId][year][month];
    }
}
