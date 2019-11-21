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

    console.log(req.files['image'])

    if(!userId)
        res.status(500).send({ error: 'no user' });
    else {
        fs.mkdir(dirName, { recursive: true }, err => {
            let image = sharp(imgData);
            image.metadata()
                 .then(metadata => {
                // 高度大於900的才縮到900
                if(metadata.height > 900)
                    image.resize({ height: 900 })
                image.toFile(fullName)
                     .then(info => {
                    console.log(`save to ${fullName}`);
                    res.send(devUrl)
                });
            });
        });
    }
})



app.listen(port, () => {
    console.log(`listening on port ${host}:${port}`)
})