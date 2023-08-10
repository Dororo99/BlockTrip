// SPDX-License-Identifier: MIT

// ----------------------------------------------------------------------------
// Developed by:
// Sueun Cho and DoHyun Lim
// If you find our code helpful or cool, consider buying us a beer! 🍻 Cheers!
// ----------------------------------------------------------------------------

pragma solidity ^0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract MarketPlace is IERC721Receiver, Ownable, ReentrancyGuard {
    uint256 public nftListedCount = 0;
    address public allowedNftAddress;
    address payable thisAddress;
    
    mapping(uint256 => ActiveList) public fixedAuctions;
    mapping(uint256 => EnglandAuction) public englandAuctions;
    mapping(uint256 => DutchAuction) public dutchAuctions;

    ERC721 nft;

    struct ActiveList {
        uint256 NFTId;
        address payable NFTSeller;
        address payable thisAddress;
        uint256 NFTPrice;
        bool isSold;
    }

    struct EnglandAuction {
        uint256 NFTId;
        address payable seller;
        uint256 startingPrice;
        uint256 endTime;
        address payable highestBidder;
        uint256 highestBid;
        bool ended;
        bool cancelled;
        uint256 dueDate;
    }

    struct DutchAuction {
        uint256 NFTId;
        address payable seller;
        uint256 startingPrice;
        uint256 finalLowPrice;
        uint256 declineRate;
        uint256 startTime;
        bool ended;
    }

    event NFTListCreated (
        uint256 indexed NFTId,
        address NFTSeller,
        address thisAddress,
        uint256 NFTPrice,
        bool isSold
    );

    event AuctionCreated(uint256 indexed NFTId, uint256 startingPrice, uint256 endTime);
    event NewBid(uint256 indexed NFTId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed NFTId, address winner, uint256 amount);

    constructor(ERC721 _nft) Ownable(msg.sender) {
        thisAddress = payable(msg.sender);
        nft = _nft;
        allowedNftAddress = address(_nft);
    }

    function checkTime() public view returns(uint256){
        return block.timestamp;
    }

    function isAllowedNFT(address _nftAddress) internal view returns(bool) {
        return _nftAddress == allowedNftAddress;
    }

    //AUDIT END - SUEUN CHO
    // 어떤 NFT를 살건지 = NFTId
    function buyListedNft(uint256 NFTId) public payable nonReentrant {
        ActiveList storage auction = fixedAuctions[NFTId];
        uint256 NFTPrice = auction.NFTPrice;
    
        require(msg.value == NFTPrice, "msg.value and NFTPrice are not same");
        require(!auction.isSold, "NFT already sold");
    
        // 바로 삭제하기 전에 판매자 주소를 임시 변수에 저장합니다.
        address payable sellerAddress = auction.NFTSeller;
    
        // 판매된 상태로 표시
        auction.isSold = true;
        
        // NFT를 구매자에게 전송
        nft.safeTransferFrom(address(this), msg.sender, NFTId); 
    
        // 판매자에게 ether 전송
        sellerAddress.transfer(msg.value);
    
        // 이제 해당 목록을 삭제합니다.
        delete fixedAuctions[NFTId];
    }


    //AUDIT END - SUEUN CHO
    //fixedAuctions에 한정된 코드
    function cancelNFTSale(uint256 NFTId) public nonReentrant {
        //nft 판매자인지 확인
        require(fixedAuctions[NFTId].NFTSeller == msg.sender, "NFT is not yours");
        nft.safeTransferFrom(address(this), msg.sender, NFTId);
        nftListedCount--;
        delete fixedAuctions[NFTId];
    }

    //AUDIT END - SUEUN CHO
    //fixedAuctions에 한정된 코드
    function NFTlistSale(uint256 NFTId, uint256 NFTPrice) public payable nonReentrant {
        //먼저 NFT가 본인껀지 확인
        require(nft.ownerOf(NFTId) == msg.sender, "NFT is not yours"); 
        ////ID가 0번인 NFT는 어떻게 처리할것인가?
        require(fixedAuctions[NFTId].NFTId == 0, "NFT already listed"); 
        //내가 정한 NFT 컨트랙트만 사용가능
        require(isAllowedNFT(address(nft)), "Only allowed NFT can be listed");
        require(NFTPrice > 0, "NFT Price over than 0!"); 

        fixedAuctions[NFTId] =  ActiveList(NFTId, payable(msg.sender), thisAddress, NFTPrice, false);
        nft.safeTransferFrom(msg.sender, address(this), NFTId);
        nftListedCount++;
        emit NFTListCreated(NFTId, msg.sender, address(this), NFTPrice, false);
    }

//    //좀더 좋은 방향으로 수정필요
//    function showNFTListings() public view returns (ActiveList[] memory) {
//        ActiveList[] memory listItems = new ActiveList[](nftListedCount);
//        uint256 counter = 0;
//        for (uint256 i = 1; i <= nftListedCount; i++) {
//            if (fixedAuctions[i].thisAddress == address(this)) {
//                listItems[counter] = fixedAuctions[i];
//                counter++;
//            }
//        }
//        return listItems;
//    }

    //AUDIT END - SUEUN CHO
    function createAuction(uint256 NFTId, uint256 startingPrice, uint256 duration) public payable nonReentrant {
        require(nft.ownerOf(NFTId) == msg.sender, "NFT is not yours");
        require(isAllowedNFT(address(nft)), "Only allowed NFT can be listed");
        require(startingPrice > 0 && duration > 60 , "NFT Price over than 0! and over 60 sec(approx) of duration");
        englandAuctions[NFTId] = EnglandAuction({
            NFTId: NFTId,
            seller: payable(msg.sender),
            startingPrice: startingPrice,
            endTime: block.timestamp + duration,
            highestBidder: payable(address(0)),
            highestBid: 0,
            ended: false,
            cancelled: false,
            dueDate : duration
        });

        // Contract Address로 NFT 이동. 본인(msg.sender)이 이 주소로 N번째 nft 이동
        nft.transferFrom(msg.sender, address(this), NFTId);

        // Event log
        emit AuctionCreated(NFTId, startingPrice, block.timestamp + duration);
    }

    //AUDIT END - SUEUN CHO
    function bid(uint256 NFTId) public payable nonReentrant {
        EnglandAuction storage auction = englandAuctions[NFTId];
        require(block.timestamp < auction.endTime, "England auction already done");
        require(msg.value > auction.highestBid, "There is a higher bid");
        require(isAllowedNFT(address(nft)), "Only allowed NFT can be listed");

        if (auction.highestBid != 0) { // auction.highestBid != 0 : 경매가 시작 됨
        //그순간 최고 입찰자였던 사람에게 입찰 금액을 돌려줌
            auction.highestBidder.transfer(auction.highestBid);
        }

        // payable로 인하여 이렇게 msg.sender가 받을 수 있음
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = msg.value;
        
        emit NewBid(NFTId, msg.sender, msg.value);
    }

    //AUDIT END - SUEUN CHO
    function endAuction(uint256 NFTId) public nonReentrant {
        EnglandAuction storage auction = englandAuctions[NFTId];
        require(block.timestamp > auction.endTime, "England auction not over yet");
        require(!auction.ended, "England auction has already been done");

        auction.ended = true;

        if (auction.highestBidder != address(0)) { // 주소가 있다면,
            // If there was at least one bid, transfer funds to the seller
            // auction seller가 높은 금액 전송
            auction.seller.transfer(auction.highestBid);
            // Contract에서 highestBidder에게 NFT 전송
            nft.transferFrom(address(this), auction.highestBidder, NFTId);
            emit AuctionEnded(NFTId, auction.highestBidder, auction.highestBid);
        } else {
            // If there were no bids, return NFT to the seller
            nft.transferFrom(address(this), auction.seller, NFTId);
            emit AuctionEnded(NFTId, auction.seller, 0);
        }
    }

    //AUDIT END - SUEUN CHO
    function createDutchAuction(uint256 NFTId, uint256 startingPrice, uint256 finalLowPrice, uint256 declineRate) public payable nonReentrant {
        require(nft.ownerOf(NFTId) == msg.sender, "NFT is not yours!");
        require(isAllowedNFT(address(nft)), "Only allowed NFT can be listed");

        dutchAuctions[NFTId] = DutchAuction({
            NFTId: NFTId,
            seller: payable(msg.sender),
            startingPrice: startingPrice,
            finalLowPrice: finalLowPrice,
            declineRate: declineRate,
            startTime: block.timestamp,
            ended: false
        });

        nft.transferFrom(msg.sender, address(this), NFTId);
    }

    //AUDIT END - SUEUN CHO
    function getCurrentPrice(uint256 NFTId) public view returns (uint256) {
        DutchAuction storage auction = dutchAuctions[NFTId];
        uint256 elapsedTime = block.timestamp - auction.startTime;
        uint256 priceDecline = elapsedTime * auction.declineRate;
        uint256 currentPrice = auction.startingPrice - priceDecline;

        return currentPrice > auction.finalLowPrice ? currentPrice : auction.finalLowPrice;
    }

    //AUDIT END - SUEUN CHO
    function buyDutchAuction(uint256 NFTId) public payable nonReentrant {
        DutchAuction storage auction = dutchAuctions[NFTId];
        uint256 currentPrice = getCurrentPrice(NFTId);
        require(msg.value >= currentPrice, "The value is below the current price");
        require(!auction.ended, "Dutch Auction already done");

        auction.ended = true;

        auction.seller.transfer(currentPrice);

        nft.transferFrom(address(this), msg.sender, NFTId);
    }

    //AUDIT END - SUEUN CHO
    function cancelDutchAuction(uint256 NFTId) public nonReentrant {
        DutchAuction storage auction = dutchAuctions[NFTId];
        require(msg.sender == auction.seller, "You are not the seller!");
        require(!auction.ended, "Dutch Auction already done");
        
        uint256 currentPrice = getCurrentPrice(NFTId);
        require(currentPrice <= auction.finalLowPrice, "The auction cannot be cancelled above reserve price!");
    
        auction.ended = true;
        
        nft.transferFrom(address(this), msg.sender, NFTId);
    }

    //AUDIT END - SUEUN CHO
    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from != address(0x0), "Cannot send nfts to Vault directly");

        return IERC721Receiver.onERC721Received.selector;
    }
}