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


    struct TokenMeta {
        string valid;
    }

    mapping(uint256 => TokenMeta) private _tokenMetas;

    // You can pass in your own NFT name and symbol (like a stock ticker) here!
    constructor() ERC721("NFT Name", "SYMBOL") {
        // Put any initialization code inside of the constructor
    }

    function _setTokenMeta(uint256 tokenId, TokenMeta memory meta) internal {
        require(_exists(tokenId), "User: Meta set for nonexistent user");
        _tokenMetas[tokenId] = meta;
    }

    function mint(address recipient) public returns (uint256) {
        // _mint is a built in function that actually puts your NFT onto the blockchain
        _safeMint(recipient, tokenCounter);
        _setTokenMeta(tokenCounter, TokenMeta("valid"));

        // this will set the tokenURI of the NFT to the tokenURI that you pass in through this function.
        // _setTokenURI(tokenCounter, tokenURI);

        // every time you mint, increment the amount of tokens you've created by 1.
        tokenCounter = tokenCounter + 1;
        // we return the current token count, which is being used as the ID of the NFT.
        return tokenCounter;
    }

    function _getMeta(address owner, uint256 ownedTokenId) public view returns (TokenMeta memory) {
        uint256 tokenId = tokenOfOwnerByIndex(owner, ownedTokenId);
        return _tokenMetas[tokenId];
    }

    function paid(address owner, uint256 year, uint256 month) public view returns (bool) {
        return month > 6;
    }

    function authenticate() public returns (bool) {
        return false;
    }
}
