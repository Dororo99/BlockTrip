/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: ipfs.js

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

const axios = require('axios');
const FormData = require('form-data');

///////////////////
//  MANAGE IPFS  //
///////////////////
class Ipfs {
  constructor() {
    this.PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
    this.PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;
  }

  ////////////////////////
  //  REQUEST IPFS API  //
  ////////////////////////
  async postIPFS(data) {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': this.PINATA_API_KEY,
        'pinata_secret_api_key': this.PINATA_API_SECRET,
      }
    });
    return res;
  }

  ///////////////////
  //  GET CONSOLE  //
  ///////////////////
  getConsole(res) {
    if (res.data.IpfsHash) {
      console.log(`Your file has been uploaded to IPFS with hash: https://aqua-statistical-wren-893.mypinata.cloud/ipfs/${res.data.IpfsHash}`);
      return res.data.IpfsHash;
    } else {
      console.log('Something went wrong while uploading to IPFS');
      return null;
    }
}

  /////////////////////////
  //  PIN IAMGE TO IPFS  //
  /////////////////////////
  async pinImageToIPFS(url) {
    console.log("PIN_IMAGE_TO_IPFS");
    let fileRandom = Math.floor(Math.random() * Math.floor(10000));
    let response = await axios.get(url, { responseType: 'stream' });
    let data = new FormData();
    data.append('file', response.data, {
      filename: 'filename' + fileRandom, // FILENAME
      contentType: response.headers['content-type']
    });

    const res = await this.postIPFS(data);
  
    console.log(res.data);
    this.getConsole(res);
  
    return res.data.IpfsHash;  // RETURN CID
  }
}

module.exports = Ipfs;