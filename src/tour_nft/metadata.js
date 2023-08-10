/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: metadata.js

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

const CryptoJS = require("crypto-js");
const FormData = require('form-data');
const ipfs = require('./ipfs');

class Metadata {
  constructor() {
    this.ipfs = new ipfs();
    this.account = "BlockTrip_NFT";
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  setMetadata(locationPrompt, response, imgCID) {
    const name = "BlockTrip";
    const hash = new CryptoJS.SHA3(response.data.data[0].url).toString();
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const metadata = {
      'name': name,
      'NFT': this.account,
      'description': locationPrompt,
      'image': `https://aqua-statistical-wren-893.mypinata.cloud/ipfs/${imgCID}`,
      'hash': hash,
      'date': date,
    };
    return metadata;
  }

  async sendToIPFS(locationPrompt, response, imgCID) {

    const metadata = this.setMetadata(locationPrompt, response, imgCID);
    let data = new FormData();
    data.append('file', Buffer.from(JSON.stringify(metadata, null, 2)), {
      filename: `${this.account}_${this.getRandomInt(100000)}.json`,
      contentType: 'application/json'
    });
    const res = await this.ipfs.postIPFS(data);
    const ipfsAddress = `https://aqua-statistical-wren-893.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
    console.log(`Metadata file has been uploaded to IPFS with hash: ${ipfsAddress}`);
    return ipfsAddress;
  }
}

module.exports = Metadata;