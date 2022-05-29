const fs = require('fs');
const path = require("path");
const bodyParser = require('body-parser')
const express = require('express');
const multer = require('multer')
const {put} = require('./oss_upload')

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//文件上传 -- 不需要 , 如果想要本地存一个备份可以将storage放在multer中  ;)
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './upload/')
    },
    filename: (request, file, callback) => {
        //null , 错误
        callback(null, Date.now() + path.extname(file.originalname))
    },
})

//const upload = multer(storage)
const upload = multer()

// 单图上传

app.post('/upload', upload.single('file'), async function (req, response, next) {
    if (req.file.mimetype === 'image/jpeg') {
        const {res, url} = await put(req.file)
        if (res.status === 200) {
            response.status(200)
            response.send({code: '20000', data: url, msg: "上传成功!"});
        } else {
            response.status(400)
            response.send({code: '40000', data: null, msg: "上传错误,请检查配置是否正确"})
        }
    } else {
        response.status(400)
        response.send({code: '40000', data: null, msg: "上传错误,上传文件仅限图片格式"})
    }
})


app.use((err, req, res, next) => {
    res.status(400).json({code: "40001", data: null, msg: err.message})
})


app.listen(8855, (err) => {
    console.log("启动成功")
    if (err) {
        throw new Error(`启动失败:${err}`)
    }
});

