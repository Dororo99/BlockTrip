/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: time.js

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

function myTime() {
    let nowTime = new Date().getHours();
    if (nowTime >= 5 && nowTime < 6) {
      return "dawn";
    } else if (nowTime >= 6 && nowTime < 12) {
      return "morning";
    } else if (nowTime >= 12 && nowTime < 13) {
      return "midday";
    } else if (nowTime >= 13 && nowTime < 18) {
      return "afternoon";
    } else if (nowTime >= 18 && nowTime < 22) {
      return "evening";
    } else if (nowTime >= 22 || nowTime < 5) {
      return "night";
    } else if (nowTime === 0) {
      return "midnight";
    }
  }
  
  module.exports = {
    myTime
  };
  