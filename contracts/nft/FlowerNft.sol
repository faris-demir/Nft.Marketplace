// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error NotOwner();

contract FlowerNft is ERC721 {
    string public constant TOKEN_URI = "https://nftstorage.link/ipfs/bafkreif3hyqxquyd6wmvteygdtx44sahk4uu3au5gaok572cuxbpoxqmfu";
    uint256 private s_tokenCounter;

    event FlowerMinted(uint256 indexed tokenId);

    constructor() ERC721("Hyacinth", "FLOWER") {
        s_tokenCounter = 0;
    }

    //Function modifiers
    modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        emit FlowerMinted(s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function getTokenURI(uint256 tokenId, address nftOwnerAddress) 
        public 
        view
        isOwner(address(this), tokenId, nftOwnerAddress) 
        returns (string memory) 
    {
        require(_exists(tokenId), "ERC721Metadata: URI requested for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}