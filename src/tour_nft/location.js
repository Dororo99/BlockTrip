/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: location.js

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

const fetch = require('node-fetch');
let i = 0;
/////////////////////
//  USER LOCATION  //
/////////////////////
function Location(mood, weather, artOption) {

  /////////////////////
  //  GET CITY DATA  //
  /////////////////////
  async function getCityData() {
    try {
      const response = await fetch(`https://ipinfo.io/json?token=${process.env.REACT_APP_MY_LOCATION}`);
      const cityData = await response.json();
      return cityData.city;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

////////////////////////////
//  MAKE LOCATION PROMPT  //
////////////////////////////
//!! 어떤 그림형식으로 할건지도 추가하면 좋을듯 함
async function myLocation() {
  i++;
  console.log(i)
  const cityData = await getCityData();
  console.log(`I'm in a ${mood} mood. Please draw ${cityData} with the current weather of ${weather} in the style of ${artOption} art.`);
  return `I'm in a ${mood} mood. Please draw ${cityData} with the current weather of ${weather} in the style of ${artOption} art.`;
}

async function getLocationInGPT_3() {
  i++;
  console.log(i)
  const cityData = await getCityData();
  return cityData
}


// Then you'll need to pass `mood`, `weather` and `artOption` from the front-end.


  //////////////////////////////////////
  //  Return the necessary functions  //
  //////////////////////////////////////
  return {
    myLocation,
    getLocationInGPT_3,
  };
}

module.exports = Location;
