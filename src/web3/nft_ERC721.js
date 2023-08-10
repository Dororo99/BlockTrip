/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: nft_ERC721.js

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

export const mintToken = async (ipfsAddressh, contract, web3, getAccount) => {
    console.log(ipfsAddressh)
    if (contract && web3) {
      const data = contract.methods.mintByETH(ipfsAddressh).encodeABI();
      
      await web3.eth.sendTransaction({ from: getAccount, to: contract.options.address, data: data });
    }
  };

  export const approvalForAll = async (contract, web3, getAccount) => {
    //contractAddress
    if (contract && web3) {
      //!! 마켓플레이스 주소가 들어가야 함
      const data = contract.methods.setApprovalForAll("0xA856c387fE837A919F55BE802461DbC9D3e2F1dB", true).encodeABI();

      await web3.eth.sendTransaction({ from: getAccount, to: contract.options.address, data: data });
    }
  };

  export const getOwnerTokenURIs = async (contract, web3, getAccount) => {
    const imageUrls = [];
    if (contract && web3) {
        const totalSupply = await contract.methods.totalSupply().call();
        for (let i = 0; i < totalSupply; i++) {
            const owner = await contract.methods.ownerOf(i).call();
            if (owner.toLowerCase() === getAccount.toLowerCase()) {
                const uri = await contract.methods.tokenURI(i).call();
                console.log(`Fetching URI: ${uri}`);
                const response = await fetch(uri);
                console.log(uri)
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                    console.log(await response.text());
                } else {
                    console.log(response)
                    const data = await response.json();
                    imageUrls.push(data.image);
                }
            }
        }
        console.log(imageUrls);
    }
    return imageUrls;
};


  export const isNumber = async (contract, web3, getAccount) => {
    const myNFTIds = []; // 사용자가 소유한 NFT의 ID만 저장할 배열

    if (contract && web3) {
        try {
            const total = await contract.methods.totalSupply().call();
            console.log(total)
            for (let i = 0; i <= total; i++) {
                const tokenOwner = await contract.methods.ownerOf(i).call();
                console.log(tokenOwner)
                if (tokenOwner.toLowerCase() === getAccount.toLowerCase()) {
                    myNFTIds.push(i); // 해당 NFT의 토큰 ID만 배열에 추가합니다.
                }
            }
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        }
    }
    console.log(myNFTIds);
    return myNFTIds; // 반환되는 배열에는 사용자가 소유한 NFT의 ID만 포함됩니다.
};