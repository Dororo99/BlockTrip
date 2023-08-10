 /*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: nft_market.js

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-------------------------------------------------------------------------------
*/


 //!! 판매자가 NFT를 올리는것
  export const fixedSaleSetting = async (martketContract, contract, web3, getAccount, NFTId, NFTPriceInEther) => {
    try {
        console.log(martketContract);
        if (contract && web3 && martketContract) {
            const NFTPriceInWei = web3.utils.toWei(NFTPriceInEther.toString(), 'ether');
            console.log(NFTId)
            console.log(NFTPriceInWei)
            const data = martketContract.methods.NFTlistSale(NFTId, NFTPriceInWei).encodeABI();
            await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data });
        }
    } catch (error) {
        console.error("Failed to list NFT for sale: ", error);
    }
};



//  export const getAuctionFee = async (martketContract, contract, web3, getAccount) => {
//    if (martketContract && web3) {
//      const auctionFee = await martketContract.methods.auctionFee().call(); // Using .call() here to read the value
//      console.log(auctionFee); // Log or use the value
//      }
//    };
//    
//    //NFTlistSale
//    export const cancelNFTSaleSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.cancelNFTSale(2).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data });
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

    //createAuction
//    export const createAuctionSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.createAuction(2, 30, 10000).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data });
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

    //bid (England Auction)
    //value를 받아오는걸로 수정해야함
    //기본 변수 수정해
//    export const bidSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.bid(2).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data, value: 10000000000000000 });
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

//    export const endAuctionSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.endAuction(2).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data});
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

    //createDutchAuction
    //value를 솔리디티 코드를 수정해서 없애야함
    //기본 변수 수정해야함
//    export const createDutchAuctionSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.createDutchAuction(3, 1000000000000000, 100000000, 50).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data, value : 1000000000000000000});
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

    //create buy Listed NFT Setting
    //value를 솔리디티 코드를 수정해서 없애야함
    //기본 변수 수정해야함
    //!! 구매가격 입력 받아야함
    export const buyListedNftSetting = async (martketContract, contract, web3, getAccount, nftId) => {
      try {
        if (contract && web3 && martketContract) {
          const getPriceABI = await martketContract.methods.fixedAuctions(nftId).call();
          const price = getPriceABI[3]; 
          const data = await martketContract.methods.buyListedNft(nftId).encodeABI();
    
          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data, value : price});
        }
      } catch (error) {
        console.error("Failed to buy NFT: ", error);
      }
  };
  


//    export const buyDutchAuctionSetting = async (martketContract, contract, web3, getAccount) => {
//      try {
//        console.log(martketContract)
//        if (contract && web3 && martketContract) {
//          const data = martketContract.methods.buyDutchAuction(3).encodeABI();
//    
//          await web3.eth.sendTransaction({ from: getAccount, to: martketContract.options.address, data: data, value : 1000000000000000000});
//        }
//      } catch (error) {
//        console.error("Failed to list NFT for sale: ", error);
//      }
//    };

//    export const getCheckTime = async (martketContract, contract, web3, getAccount) => {
//      //console.log(ipfsAddressh)
//      
//      if (martketContract && web3) {
//        const checkTime = await martketContract.methods.checkTime().call(); // Using .call() here to read the value
//    
//        console.log(checkTime); // Log or use the value
//      }
//    };

//    export const getEnglandAuctions = async (martketContract, contract, web3, getAccount) => {
//      //console.log(ipfsAddressh)
//      
//      if (martketContract && web3) {
//        const checkTime = await martketContract.methods.englandAuctions(2).call(); // Using .call() here to read the value
//    
//        console.log(checkTime); // Log or use the value
//      }
//    };


    //!! 몇번째 NFT를 옥션 정보를 얻을 수 있음
    export const getFixedAuctions = async (martketContract, contract, web3) => {
      if (martketContract && web3) {
          const zeroAddress = '0x0000000000000000000000000000000000000000';
          const nftCount = await contract.methods.totalSupply().call();
          const validAuctions = [];
          const getImageNumber = [];
          const getPrice = [];
    
          for (let i = 0; i < nftCount; i++) {
              const auction = await martketContract.methods.fixedAuctions(i).call();
              if (auction.NFTSeller !== zeroAddress) { 
                  validAuctions.push(auction); 
              }
          }
    
          for(let j = 0; j < validAuctions.length; j++) {
              getImageNumber.push(validAuctions[j][0]);
              getPrice.push(validAuctions[j][3]);
          }
          console.log(getImageNumber)
          console.log(getPrice)
          const stringPrice = getPrice.map(price => web3.utils.fromWei(price, 'ether'));

          const stringIds = getImageNumber.map(id => id.toString());
          return {
            ids: stringIds,
            prices: stringPrice
          };
          
      }
      return { ids: [], prices: [] };
    };
    
  
    

    export const getDutchAuctions = async (martketContract, contract, web3, getAccount) => {
      //console.log(ipfsAddressh)
      
      if (martketContract && web3) {
        const checkTime = await martketContract.methods.dutchAuctions(2).call(); // Using .call() here to read the value
    
        console.log(checkTime); // Log or use the value
      }
    };