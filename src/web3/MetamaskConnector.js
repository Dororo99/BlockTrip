/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: MetamaskConnector.js

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

import React from 'react';
import Web3 from 'web3';

export async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    }
}

export async function getAccounts() {
    const web3 = window.web3;
    return await web3.eth.getAccounts();
}

export async function connectMetamask() {
    if (window.ethereum) {
        await window.ethereum.enable();
        return true;
    } else {
        window.alert('Please install MetaMask!');
        return false;
    }
}

function MetamaskConnector({ setAccount, isUserLoggedIn, className }) {
    const handleConnect = async () => {
        const isConnected = await connectMetamask();
        if (isConnected) {
            const accounts = await getAccounts();
            setAccount(accounts[0]);
        }
    };

    return (
        <button className={className} onClick={handleConnect}>
            Connect Metamask
        </button>
    );
}


export default MetamaskConnector;
