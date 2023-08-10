/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: server.js

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

const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const Location = require('./src/tour_nft/location');
const Metadata = require('./src/tour_nft/metadata.js');
const Ipfs = require('./src/tour_nft/ipfs.js');
require("dotenv").config();
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

// 아래 코드 모두 정상 작동
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/completions', async (req, res) => {
  try {
    const { mood, weather, artOption } = req.body;
    const location = new Location(mood, weather, artOption);
    const myLocation = await location.getLocationInGPT_3();
    console.log(myLocation)
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `${myLocation} in South Korea 에서 먹을만한 두 가지 음식은 무엇인지 한국어로 매우 간결하게 알려주시겠어요?`}],
        max_tokens: 500,
      })
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch(error) {
    console.log(error);
  }
});

app.post('/my-location', async (req, res) => {
  try {
    const { mood, weather, artOption } = req.body;
    const location = new Location(mood, weather, artOption);
    const myLocation = await location.myLocation();
    res.json({ location: myLocation });
    console.log(req.body);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.post('/generate-image', async (req, res) => {
  const { prompt, size, n, mood, weather, artOption } = req.body;
  let ipfs = new Ipfs();
  const meta = new Metadata();
  const location = new Location(mood, weather, artOption); 
  const description = await location.myLocation();
  console.log(description)

  try {
    const response = await openai.createImage({
      prompt,
      n,
      size,
    });
    
    const imageUrl = response.data.data[0].url;
    console.log("imageurl" + imageUrl)
    const ipfsHash = await ipfs.pinImageToIPFS(imageUrl);
    const ipfsAddress = await meta.sendToIPFS(
      description,
      response,
      ipfsHash
    );
    console.log(ipfsAddress)
    res.send({ imageUrl, ipfsHash, ipfsAddress });
    return ipfsAddress
  } catch(error) {
    console.error(error);
    res.status(500).send('Image generation failed');
  }
});

app.listen(PORT, () => console.log("RUN " + PORT));