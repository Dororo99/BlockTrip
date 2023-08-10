/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: BalanceChecker.js

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

import React, { useState } from 'react';

function BalanceChecker({ account }) {
    const [balance, setBalance] = useState(null);

    async function getBalance() {
        if (window.web3) {
            const web3 = window.web3;

            const balanceInWei = await web3.eth.getBalance(account);
            const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
            setBalance(parseFloat(balanceInEther).toFixed(6));

        } else {
            window.alert('Please connect to MetaMask!');
        }
    }

    // 지갑이 연결되어 있지 않으면 아무 것도 표시하지 않는다.
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        return null;
    }

    return (
        <div className="balance-checker-container">
            <button className="check-button" onClick={getBalance}>Check Balance</button>
            {balance && <p className="balance-text">{balance} Matic</p>}
        </div>
    );
}


export default BalanceChecker;
