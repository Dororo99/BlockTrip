/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: App.js

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

import './App.css';

import React, { useEffect, useState } from 'react';
import MetamaskStatus from './web3/MetamaskStatus';
import BalanceChecker from './web3/BalanceChecker';
import MetamaskConnector, { loadWeb3, getAccounts } from './web3/MetamaskConnector';
import UserIcon from './web3/UserIcon';
import Web3 from 'web3';
import contractABI from './web3/ABI/solABI.json';
import martketABI from './web3/ABI/marketABI.json';

import {
  fixedSaleSetting,
  //cancelNFTSaleSetting,
  //createAuctionSetting,
  //bidSetting,
  //endAuctionSetting,
  //createDutchAuctionSetting,
  buyListedNftSetting,
  //buyDutchAuctionSetting,
  //getCheckTime,
  //getEnglandAuctions,
  getFixedAuctions,
  //getDutchAuctions,
  //getAuctionFee,
} from './web3/nft_market';
import {
  mintToken,
  approvalForAll,
  getOwnerTokenURIs,
  isNumber
} from './web3/nft_ERC721';

//IPFS 주소를 db에 남기고, (민팅을 했던 안했던) 버튼 보여주기. 메타마스크가 없으면 IPFS 이미지 주소를 화면에 보여주기

const App = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [getAccount, setAccount] = useState("");
  const [web3, setWeb3] = useState("");
  const [contract, setContract] = useState("");
  const [martketContract,setMarketContract] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [artOption, setArtOption] = useState("abstract");
  const [userInput, setUserInput] = useState('');
  const [chatMessage, setChatMessage] = useState("");
  const [mood, setMood] = useState("happy");
  const [weather, setWeather] = useState("sunny");
  const [images, setImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [canGenerate, setCanGenerate] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // NFT 판매 (Fixed)
  const [NFTId, setNFTId] = useState('');
  const [NFTPrice, setNFTPrice] = useState('');
  
  const [auctionIds, setAuctionIds] = useState([]);
  const [auctionPrices, setAuctionPrices] = useState([]);
  
  const [nftNumber, setNftNumber] = useState("");

  useEffect(() => {
    async function initializeBlockchainData() {
      if (window.ethereum) {
        try {
          await new Promise((resolve, reject) => {
            const check = setInterval(() => {
              if (window.ethereum) {
                clearInterval(check);
                resolve();
              }
            }, 100);
          });
  
          await loadWeb3();

          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts(); // Use the web3 instance to get accounts
          
          // Check if any accounts are connected
          if (!accounts.length) {
            console.error("No Ethereum accounts are connected.");
            return; // Exit if no accounts are connected
          }
  
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          //!!수정해야함. contractAddress와 marketContractAddress 수정해야함
          const contractAddress = '0x1767DD426de565391aAd98395b71caBf22A66AfE';
          const marketContractAddress = "0xA856c387fE837A919F55BE802461DbC9D3e2F1dB";
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          const marketContractInstance = new web3Instance.eth.Contract(martketABI, marketContractAddress);
          setContract(contractInstance);
          setMarketContract(marketContractInstance);
        } catch (error) {
          console.error("Failed to load blockchain data: ", error);
        }
      }
    }
  
    initializeBlockchainData();
  }, []);

  

  useEffect(() => {
    async function fetchOwnedNFTs() {
      if(window.ethereum) {
        const ids = await isNumber(contract, web3, getAccount);

        // 새로운 상태 변수를 초기화
        let fetchedIds = [];

        // 각 ID를 2초 간격으로 가져오기
        for (let i = 0; i < ids.length; i++) {
          setTimeout(async () => {
            fetchedIds.push(ids[i]);

            setOwnedNFTs([...fetchedIds]);
          }, i * 1000);  // i * 2000 은 각 ID마다 2초의 딜레이를 의미
        }
      }
    }

    fetchOwnedNFTs();
  }, [getAccount, contract, web3]);


  useEffect(() => {
    
    const fetchImages = async () => {
      if (window.ethereum) {
        const imageUrls = await getOwnerTokenURIs(contract, web3, getAccount);
        console.log(imageUrls);
        setImages(imageUrls);
      }
    };
    
    fetchImages();
  }, [contract, web3, getAccount]);


    useEffect(() => {
      // 웹페이지 로딩 후 첫 15초 동안은 이미지 생성 불가능 (악성 방지)
      const timer = setTimeout(() => {
          setCanGenerate(true);
      }, 15000);

      // 컴포넌트가 unmount될 때 타이머를 clear
      return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            setTimeLeft(prevTime => prevTime - 1);
        } else {
            setCanGenerate(true);
            clearInterval(timerInterval);
        }
    }, 1000);

    return () => clearInterval(timerInterval);
}, [timeLeft]);

  const getMyLocation = (mood, weather, artOption) => {
    return new Promise(async (resolve, reject) => {
      try {
        //정상작동
        const response = await fetch('http://localhost:8000/my-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood, weather, artOption }),
        });
        const data = await response.json();
        resolve(data.location);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };
  
  //정상작동
  const generateImage = async () => {
    if (!canGenerate) {
      alert('🕒 타이머를 기달려주세요');
      return;
  }
    setIsLoading(true);
    await getMessage(mood, weather, artOption);
    console.trace();
    const prompt = await getMyLocation(mood, weather, artOption); // getMyLocation 함수가 프롬프트를 반환합니다.
    const options = {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
        size: "256x256",
        n: 1,
        mood: mood, // Added
        weather: weather, // Added
        artOption: artOption, // Added
      }),
      headers: {
        "Content-Type" : "application/json"
      }
    }
    console.log(prompt)
    try {
      const response = await fetch('http://localhost:8000/generate-image', options);
      const data = await response.json();
      console.log(data)
      setImageUrl(data.imageUrl);
      console.log('Metadata address:', data.ipfsAddress);
      if(window.ethereum) {
        await mintToken(data.ipfsAddress)
        setTokenURI(data.ipfsAddress); // 위치를 변경함
      }
      else {
        console.log("NO META")
      }
    } catch(error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
    setCanGenerate(false);
    setTimeout(() => {
        setCanGenerate(true);
    }, 1000);
  }
  
  const isUserLoggedIn = getAccount != null;

  const getMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        messages: [{role: "user", content: userInput}],
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();

      // Set the chat message
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setChatMessage(data.choices[0].message.content);
      }
    } catch (error) {
      console.log(error)
    }
  
  }

  const handleCopyTokenURI = () => {
    navigator.clipboard.writeText(tokenURI).then(function() {
      alert('Token URI copied to clipboard!');
    }, function(err) {
      alert('Failed to copy text: ' + err);
    });
  };

  async function handleGetFixedAuctions() {
    const results = await getFixedAuctions(martketContract, contract, web3);
    setAuctionIds(results.ids);
    setAuctionPrices(results.prices);
  }
  
  const handleNftNumberChange = (event) => {
    setNftNumber(event.target.value);
  };

  return (
    <div className="app">
    {/* 제목 및 메타마스크 연결 버튼 */}
    <div className="header-container">
            <h1 className="title">BlockTrip</h1>
            <div className="user-icon-container">
                <MetamaskConnector className="connect-button" setAccount={setAccount} isUserLoggedIn={isUserLoggedIn} />
                <div className="icon-spacer"></div>
                <UserIcon account={getAccount} />
            </div>
        </div>


      <div className="blocktrip-container">
      🌍✨ <h1 className="blocktrip-title">BlockTrip: 여행의 마법, 당신만의 AI NFT로!</h1> ✨🌍
      <p>안녕하세요, 여행자님! 💼✈️블록트립에서 당신의 특별한 순간을 마법처럼 예술로 변환하는 여행을 소개합니다!</p>
      <ul>
        <li><strong>여행지에서의 특별한 순간🌅</strong> - 서울의 화려한 야경? 제주도의 아름다운 해안선? 여행지의 위치를 알고싶어요!</li>
        <li><strong>당신의 감정, 그대로💖</strong> - 행복한 순간? 아니면 그리운 감정? 여행의 감정을 저와 공유해보세요!</li>
        <li><strong>오늘의 날씨와 함께🌦️</strong> - 비 오는 서울의 카페 거리, 혹은 맑은 하늘 아래의 제주도? 오늘의 날씨와 함께 여행의 감성을 더해보세요!</li>
      </ul>
      <p>블록트립의 AI가 당신의 감성을 받아와 🎨 <em>독특하고 아름다운 이미지</em>로 그려드립니다. 그리고 그 예술은 당신만의 특별한 NFT로 저장됩니다. 언제든지 그 순간으로 돌아갈 수 있어요!</p>
      <p><em>✨ 여행은 잠시, 추억은 영원히.당신의 여행을 블록트립의 아트워크로, 영원히 간직하세요! ✨</em></p>
      <p>🎒 블록트립과 함께, 여행의 감성을 AI 예술로 만나보세요! 🎨</p>
      <h3>✨ 체인은 폴리곤 뭄바이 테스트넷에서 만나요~ ✨</h3>
      </div>


      {/* 다양한 섹션 */}
      {/* 토큰 개수가 자동으로 나오면 더 좋을거같다. */}
      <div className="content-container">
       <div className="section">
         <div className="wallet-info">
           <MetamaskStatus account={getAccount} />
           <BalanceChecker account={getAccount} />
         </div>
       </div>

        <div className="section instruction-section">
          <p>💫 이미지 메타데이터를 깜짝 선물로 받아보세요! 🎉 메타마스크가 아직 없다구요? 또는 지금 바쁘신가요? 괜찮아요~ 나중에 편한 시간에 다시 오셔서 아래 상자에 주소를 넣어주면 됩니다. 💌✨ (이미지를 만들고 나오는 주소는 소중하니, 꾹꾹 눌러서 꼭! 안전하게 보관해 주세요~💕)</p>
          <div className="token-row">
              <input type="text" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} placeholder="Enter token URI" className="token-input" />
              <div className="tokenURI-display" onClick={handleCopyTokenURI}>
                  Token URI: <span>{tokenURI}</span> <em>(URL Click to Copy)</em>
              </div>
          </div>
        </div>
      </div>

      <div className="content-container">
      <div className="art-selection-container">
        <div className="art-info">
          ✨ AI와 NFT로 평생의 추억을 만들어보세요! ✨
        </div>
        <div className="selectors-container">
          <div className="selector">
            <select value={artOption} onChange={(e) => setArtOption(e.target.value)}>
              <option value="abstract">추상화</option>
              <option value="oil">오일 페인팅</option>
              <option value="watercolor">수채화</option>
              <option value="cubism">입체주의</option>
              <option value="impressionism">인상주의</option>
              <option value="expressionism">표현주의</option>
              <option value="surrealism">초현실주의</option>
              <option value="pixel">픽셀 아트</option>
              <option value="pop">팝 아트</option>
              <option value="realism">사실주의</option>
            </select>
          </div>

          <div className="selector">
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="very happy">매우 행복</option>
              <option value="happy">행복</option>
              <option value="sad">슬픔</option>
              <option value="excited">즐거움</option>
              <option value="bored">지루함</option>
              <option value="calm">차분함</option>
              <option value="longing">그리움</option>
            </select>
          </div>
          <div className="selector">
            <select value={weather} onChange={(e) => setWeather(e.target.value)}>
              <option value="sunny">맑음</option>
              <option value="cloudy">흐림</option>
              <option value="rainy">비</option>
              <option value="windy">선선</option>
              <option value="foggy">안개</option>
              <option value="stormy">폭풍우</option>
              <option value="dry">건조</option>
            </select>
          </div>
        </div>
      </div>
      
        <div className="container">
          <section className="side-bar">
              <button onClick={generateImage}>🌈 추억 만들기 🌈</button>
              {!canGenerate && <div className="timer">🕒 {timeLeft}초 남았습니다.</div>}
              <button onClick={() => mintToken(tokenURI, contract, web3, getAccount)}>🎁 만들어진 추억을 NFT로 🎁</button>
              {imageUrl && <img src={imageUrl} alt="Generated" className="cute-image" />}
          </section>
          <div className="history">
              <section className="side-bar">
                  <ul>🎡 MY TRIP NFT 🎡</ul>
                  <ul>😊 이미지가 조금 늦게 나타나도 기다려주세요. 데이터가 IPFS의 세계에서 코~ 자고있을수도 있어요~ 🌟</ul>
                  <ul><a href="https://testnets.opensea.io/collection/blocktrip-1" target="_blank" rel="noopener noreferrer">오픈씨 바로가기</a></ul>
                  <div className="history-images">
                      {images.map((imageUrl, index) => {
                          if (ownedNFTs.includes(index)) {
                              return (
                                  <div key={index}>
                                      <img src={imageUrl} alt={`NFT ${index}`} />
                                      <div>🎨 {index}번 NFT</div> {/* 혹은 원하는 다른 포맷으로 숫자 표시 */}
                                  </div>
                              );
                          }
                          return null;
                      })}
                  </div>
                </section>
            </div>
      </div>
    </div>
    {isLoading && (
            <div className="loader-container">
                <div className="loader"></div>
                <h1>🌸 그거 아세요? 🌸</h1>
                <ul className="feed">
                    <li>{chatMessage}</li>
                </ul>
            </div>
        )}

      <div className="content-container">
      <div className="container">
        <section className="side-bar">
          {/* Left Half */}
              <div className="button-group">
                  <button onClick={() => approvalForAll(contract, web3, getAccount)}>🌍 여행 기록장 오픈하기 🌍</button>
                  <p>여행의 특별한 순간들을 마켓플레이스에 판매하기 전, 여행 기록장의 허락을 받아주세요! 🧳✈️</p>
                  <div className="token-row">
                    <input className="token-input"
                      type="number"
                      value={NFTId}
                      onChange={(e) => setNFTId(e.target.value)}
                      placeholder="Enter NFT ID"
                    />
                    <input className="token-input"
                      type="number"
                      value={NFTPrice}
                      onChange={(e) => setNFTPrice(e.target.value)}
                      placeholder="Enter NFT Price"
                    />
                  </div>
                  <button onClick={() => fixedSaleSetting(martketContract, contract, web3, getAccount, NFTId, NFTPrice)}>💼 여행가방에 담긴 추억 팔아볼까요? ✈️</button>
                  <button onClick={handleGetFixedAuctions}>구매 가능한 여행 추억 리스트 보기</button>

                  <div className="K-purchase-section">
                    <input className="K-token-input"
                      type="number" 
                      value={nftNumber} 
                      onChange={handleNftNumberChange} 
                      placeholder="NFT 번호 입력"
                    />
                    <button onClick={() => buyListedNftSetting(martketContract, contract, web3, getAccount, nftNumber)}>추억 구매하기</button>
                </div>
              </div>
            </section>

            <section className="side-bar">
              {/* Right Half */}
              <div className="nft-explanation">
                ✨ 다른사람의 아름다운 여행 추억 NFT를 눈이 아닌 마음으로 구입해보세요! ✨
              </div>
              <div className="listed-nfts">
                {auctionIds.map((id, index) => (
                  <div key={index} className="nft-box">
                    <div className="nft-label">추억 상자</div>
                    <div className="nft-id">{id}번 NFT</div>
                    {/* 여기에 NFT 가격을 추가 */}
                    <div className="nft-price">{auctionPrices[index]} Matic</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </div>

    {/* <div className="card-container">
      <button onClick={() => getAuctionFee(martketContract, contract, web3, getAccount)}>this AuctionFee</button>
        <button onClick={() => cancelNFTSaleSetting(martketContract, contract, web3, getAccount)}>cancelNFTSaleSetting</button>
        <button onClick={() => createAuctionSetting(martketContract, contract, web3, getAccount)}>create Auction</button>
        <button onClick={() => endAuctionSetting(martketContract, contract, web3, getAccount)}>end Action england</button>
      </div>

      <div className="card-container">
      <button onClick={() => bidSetting(martketContract, contract, web3, getAccount)}>bid</button>
        <button onClick={() => createDutchAuctionSetting(martketContract, contract, web3, getAccount)}>create Dutch Auction Setting</button>
        <button onClick={() => buyDutchAuctionSetting(martketContract, contract, web3, getAccount)}>buy fixed nft and check list</button>
        <button onClick={() => getCheckTime(martketContract, contract, web3, getAccount)}>check ethereum block time</button>
        <button onClick={() => getEnglandAuctions(martketContract, contract, web3, getAccount)}>get England Auction list</button>
        <button onClick={() => getDutchAuctions(martketContract, contract, web3, getAccount)}>get Dutch Auction list</button>
      </div>

      <button onClick={() => getOwnerTokenURIs(contract, web3, getAccount)}>get owner token uri array</button>*/}

      <footer className="footer">
        <p>© 2023 BlockTrip. All rights reserved.</p>
        <p>Developed by: 
          <a href="mailto:sueun.dev@gmail.com">Sueun Cho (sueun.dev@gmail.com)</a> & 
          <a href="mailto:99dororo@gmail.com">DoHyun Lim (99dororo@gmail.com)</a>
        </p>
      </footer>
       
    </div>
  );
}

export default App;
