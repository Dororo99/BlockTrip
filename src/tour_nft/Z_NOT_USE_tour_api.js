/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: Z_NOT_USE_tour_api.js

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

// const axios = require('axios');
// const xml2js = require('xml2js');
// require("dotenv").config();
// 
// const serviceKey = "EPzWpAV2N7asIJV3pzi6m1q1qtX1NBGQeuw2wW3a%2BXof9p9VTa0bNrXrxwk3LZVq2npwYZjmXW0LC9tRfSnndA%3D%3D";  
// const endPoint = 'http://apis.data.go.kr/B551011/GoCamping';  
// const operation = '/basedList'; 
// 
// const numOfRows = 10;  // 한 페이지 결과 수
// const mobileOS = 'ETC';  // OS 구분
// const mobileApp = 'test';  // 서비스명 (테스트용으로 'test'를 사용했습니다.)
// 
// axios.get(`${endPoint}${operation}?ServiceKey=${serviceKey}&MobileOS=${mobileOS}&MobileApp=${mobileApp}`)
//   .then(async response => {
//     const result = await xml2js.parseStringPromise(response.data);
//     const firstImageUrls = result.response.body[0].items[0].item.map(item => item.firstImageUrl[0]);
//     console.log(JSON.stringify(firstImageUrls, null, 2));
//     const firstImageUrls1 = result.response.body[0].items[0].item.map(item => item.featureNm[0]);
//     console.log(JSON.stringify(firstImageUrls1, null, 2));
//     
//   })
//   .catch(error => {
//     console.error(error);  
//   });
// 
// 유저테이블에 필요한것 
// 유저 아이디 (index값을 넣는게 날까?)