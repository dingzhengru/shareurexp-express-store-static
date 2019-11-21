# shareurexp static file by express

**此專案用來另外處理靜態檔案(圖檔上傳、儲存、修改、提供get)**  
**下面是額外有用到的library**  
**最下面放express程式碼(express-server.js)**
*  <a href="#cors">cors</a>
*  <a href="#express-fileupload">express-fileupload</a>
*  <a href="#url">url</a>
*  <a href="#uuid">uuid</a>
*  <a href="#sharp">sharp</a>
*  <a href="#express-serverjs">express-server.js</a>

## cors
**避免跨站資源分享錯誤(Cross-Origin Resource Sharing)**  
```app.use(cors())```
## express-fileupload
**處理上傳檔案，設置好後可以用res.files來取得上傳的檔案**  

```
app.use(fileupload())

app.post('/upload-image', (req, res) => {
    let imgData = req.files['image'].data;
}
```
## url
**處理字串中 http:// 的雙斜線送出後會變只有一個的問題**
**第一個放協定跟port，第二個放路徑**
```
// url.resolve(from, to)
// url.resolve(`http://hostname:port`, file-path)
url.resolve(`${host}:${port}`, `users/${userId}/img/${imgName}`)
```
## uuid
**自動產生字串(詳細可查uuid)**  
```uuid.v1() // v1 ~ v4```  
## sharp
**用於處理圖片(resize, toFile)**  
**resize只填寬跟高其中一個，另一個會依比例自動縮放**  
```
sharp(imgData)
    .resize({ height: 900 })
    .toFile('path/filename.jpg')
    .then(info => {})
    .catch(err => {})
```

## express-server.js
```
const express = require('express')
const cors = require('cors')
const fileupload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const url = require('url');
const uuid = require('uuid');
const sharp = require('sharp');

const app = express()
const host = `http://localhost`
const port = 3000


app.use(express.static('public')) // 靜態檔案
app.use(cors());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(fileupload()); // for upload file


// 處理上傳圖片
app.post('/upload-image', (req, res) => {
    let userId = req.body['user'];
    let imgData = req.files['image'].data;

    // uuid.v4 隨機產生字串(v1~v4)
    let dirName = path.join('public', 'users', userId, 'img')
    let imgName = `${uuid.v4()}.png`
    let fullName = path.join('public', 'users', userId, 'img', imgName)

    // development url 
    let devUrl = url.resolve(`${host}:${port}`, `users/${userId}/img/${imgName}`)

    console.log('devurl', devUrl)

    if(!userId)
        res.status(500).send({ error: 'no user' });
    else {
        fs.mkdir(dirName, { recursive: true }, err => {
            sharp(imgData)
            .resize({ height: 900 })
            .toFile(fullName)
            .then(info => {
                console.log(`save to ${fullName}`);
                res.send(devUrl)
            });
        });
    }
})



app.listen(port, () => {
    console.log(`listening on port ${host}:${port}`)
})
```