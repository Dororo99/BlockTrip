/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: Z_NOT_USE_dalle_2.js

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

//import Location from './location.js';
//import API_Setting from './api_setting.js';
//import Metadata from './metadata.js';
//import Ipfs from './ipfs.js';
//
////////////////////////////////////////
////  Dalle가 실행되면 아래 파일이 자동 실행  //
////  CONSTRUCTOR ARTOPTIONS          //
////  LOCATION, API SETTING           //
////  OPENAI_API_SETTING, IPFS        //
////  MYPROMPT HAS A ARTOPTION        //
////////////////////////////////////////
//export default class Dalle {
//  constructor(artOption) {
//    this.artOptions = [
//      'abstract',
//      'oil',
//      'watercolor',
//      'cubism',
//      'impressionism',
//      'expressionism',
//      'surrealism',
//      'pop',
//    ];
//
//    this.location = new Location();
//    this.apiSetting = new API_Setting();
//    this.openai = this.apiSetting.openai;
//    this.meta = new Metadata();
//    this.ipfs = new Ipfs();
//    this.myprompt = artOption;
//  }
//
//  ////////////////////////////////////
//  //  GET PROMPT AND THEN PAINTING  //
//  ////////////////////////////////////
//  async prompt(locationPrompt) {
//    const response = await this.openai.createImage({
//      prompt: `${locationPrompt} Please draw a ${this.myprompt} painting.`,
//      n: 1,
//      size: '256x256',
//    });
//    console.log("HELLO")
//    return `${locationPrompt} Please draw a ${this.myprompt} painting.`;
//  }
//
//  //////////////////////////////////////////////////////////////////
//  //  GET LOCATION AND SEND IT TO PROMPT                          //
//  //  RESPONSE GET LOCATIONP PROMPT                               //
//  //  IMGCID GET RESPONSE                                         //
//  //  METADATAIPFSHASH GET LOCATIONPROMPT, RESPONSE AND IMGCID    //
//  //  RETURN MEETADATAIPFSHASH                                    //
//  //////////////////////////////////////////////////////////////////
//  async generateImage() {
//    try {
//      
//      const locationPrompt = await this.location.myLocation();
//      const response = await this.prompt(locationPrompt);
//      const imgCID = await this.ipfs.pinImageToIPFS(response.data.data[0].url);
//      // Here we create and upload the metadata
//      const metadataIPFSHash = await this.meta.sendToIPFS(locationPrompt, response, imgCID);
//      // Instead of the image CID, we now return the metadata CID
//      return metadataIPFSHash;
//    } catch (error) {
//      console.error(error);
//    }
//  }
//  
//}