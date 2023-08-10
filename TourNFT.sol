// SPDX-License-Identifier: MIT

// ----------------------------------------------------------------------------
// Developed by:
// Sueun Cho and DoHyun Lim
// If you find our code helpful or cool, consider buying us a beer! 🍻 Cheers!
// ----------------------------------------------------------------------------

pragma solidity ^0.8.18;

import "https://github.com/sueun-dev/ERC721A_GOMZ/blob/main/contracts/ERC721A.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

contract TourNFT is ERC721A, Ownable, ReentrancyGuard {
    uint8 constant private mintAmount = 1;

    mapping (uint256 => string) private _tokenURIs;
    mapping (address => uint256[]) private _tokensOfOwner;

    constructor() ERC721A("Tour_NFT", "T_NFT") Ownable(msg.sender) {
    }

    function mintByETH(string memory _tokenURI) external payable nonReentrant {
        _safeMint(msg.sender, _tokenURI);
    }

    function _safeMint(address to, string memory _tokenURI) internal virtual {
        uint256 newTokenId = totalSupply();
        _mint(to, mintAmount);
        _setTokenURI(newTokenId, _tokenURI);
        _tokensOfOwner[to].push(newTokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        payable(owner()).transfer(address(this).balance);
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _tokensOfOwner[owner];
    }

    function ownerTokenURIs(address owner) public view returns (string[] memory) {
        uint256[] memory tokenIds = tokensOfOwner(owner);
        string[] memory tokenURIs = new string[](tokenIds.length);

        for (uint i = 0; i < tokenIds.length; i++) {
            tokenURIs[i] = tokenURI(tokenIds[i]);
        }

        return tokenURIs;
    }

}
