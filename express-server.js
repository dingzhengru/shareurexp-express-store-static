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

// app.get('/public/*', (req, res) => {
//     res.send('Hello World!')
// })

app.use(cors());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(fileupload()); // for upload file

app.post('/upload-image', (req, res) => {
    let userId = req.body['user'];
    let imgData = req.files['image'].data;

    // uuid.v4 隨機產生字串
    let dirName = path.join('public', 'users', userId, 'img')
    let imgName = `${uuid.v4()}.png`
    let fullName = path.join('public', 'users', userId, 'img', imgName)

    // development url (../dirname/imgname) 需要往前一個資料夾

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
        
        // sharp(imgData)
        // .resize({ height: 900 })
        // .toBuffer()
        // .then(data => {
        //     fs.mkdir(dirName, { recursive: true }, err => {
        //         fs.writeFile(fullName, data, 'binary', err => { 
        //             console.log(`save to ${fullName}`);
        //             res.send(devUrl)
        //         });
        //     });
        // });
    }
})



app.listen(port, () => {
    console.log(`listening on port ${host}:${port}`)
})