/*
-------------------------------------------------------------------------------
Copyright (c) 2023, Sueun Cho, DoHyun Lim

Project: BlockTrip
Version: 2.0.0 (RC)
Date: August 8, 2023
File name: Z_NOT_USE_mysql.data.js

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

// mysql 모듈 불러오기
//var mysql = require('mysql');
//
//// fs 모듈 불러오기
//var fs = require('fs');
//
//// http 모듈 불러오기
//var http = require('http');
//
//// 데이터베이스 연결 설정
//var connection = mysql.createConnection({
//  host: 'localhost',
//  user: 'nodejs',
//  password: 'Tndmstkfkd8278!',
//  port: 3306,
//  database: 'test_database',
//  insecureAuth: true
//});
//
//connection.connect();
//
//// 사용자 추가 함수
//function addUser(name, imagePath) {
//  var user = { name: name, image_path: imagePath }; // 이미지 경로 추가
//  connection.query('INSERT INTO users SET ?', user, function(error, result) {
//    if (error) {
//      console.log(error);
//    } else {
//      console.log('User added: ' + name);
//    }
//  });
//}
//
//// 이미지 저장 함수
//function saveImage(imagePath, imageData) {
//  fs.writeFile(imagePath, imageData, function(error) {
//    if (error) {
//      console.log(error);
//    } else {
//      console.log('Image saved: ' + imagePath);
//    }
//  });
//}
//
//// 사용자 이미지 다운로드 함수
//function downloadUserImages(userName) {
//  connection.query('SELECT image_path FROM users WHERE name = ?', userName, function(error, results) {
//    if (error) {
//      console.log(error);
//    } else {
//      results.forEach(function(result) {
//        var imagePath = result.image_path;
//        var fileName = imagePath.split('/').pop(); // 이미지 파일 이름 추출
//        var fileStream = fs.createReadStream(imagePath);
//
//        // HTTP response 헤더 설정
//        var headers = {
//          'Content-Disposition': 'attachment; filename=' + fileName,
//          'Content-Type': 'application/octet-stream'
//        };
//
//        // HTTP response 전송
//        var server = http.createServer(function(req, res) {
//          res.writeHead(200, headers);
//          fileStream.pipe(res);
//        }).listen(8080); // 다운로드 서버 포트
//
//        console.log('Download link for ' + userName + ': http://localhost:8080');
//      });
//    }
//  });
//}
//
//// 사용자 추가 호출
//addUser('D', './img/6Incheon.png');
//addUser('E', './img/6Incheon.png');
//
//// 이미지 저장 호출
//var imageDataA = ''; // imageDataA에 실제 이진 이미지 데이터를 할당해야 합니다.
//var imageDataB = ''; // imageDataB에 실제 이진 이미지 데이터를 할당해야 합니다.
//
//// 이미지 저장
//saveImage('./img/62Incheon.png', imageDataA); // Replace imageDataA with the actual binary image data
//saveImage('./img/61Incheon.png', imageDataB); // Replace imageDataB with the actual binary image data
//
//var counter = 0; // 다운로드 카운터 변수
//
//// 사용자 이미지 다운로드 호출
//downloadUserImages('D');
//downloadUserImages('E');
//
//// 사용자 이미지 다운로드
//process.stdin.on('data', function(data) {
//  counter++;
//  if (counter === 3) {
//    downloadUserImages('D');
//    downloadUserImages('E');
//  }
//});
//
//connection.end();
//