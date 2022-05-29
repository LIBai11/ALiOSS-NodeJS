const path = require("path")
let OSS = require('ali-oss');
const app = require('express')()

//配置
let client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: "",
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: '',
    // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
    accessKeySecret: '',
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    bucket: '',
});

const headers = {
    // 指定该Object被下载时网页的缓存行为。
    'Cache-Control': 'no-cache',
    // 指定该Object被下载时的名称。
    'Content-Disposition': 'oss_download.txt',
    // 指定该Object被下载时的内容编码格式。
    'Content-Encoding': 'UTF-8',
    // 指定过期时间。
    // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'private',
    // 设置Object的标签，可同时设置多个标签。
    'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'true',
};

//定义上传到oss后的路径
const uploadPath = '/demo/'

async function put(file) {
    try {
        return await client.put(uploadPath + Date.now()  + path.extname(file.originalname), file.buffer, headers)
    } catch (err) {
        app.use((err, req, res, next) => {
            res.status(400).json({code: "40001", data: null, msg: err.message})
        })

    }
}

module.exports = {
    put
}