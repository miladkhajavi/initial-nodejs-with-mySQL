const multer = require('multer');
var express = require('express');
var app = express();
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

let UploadImage = {}
UploadImage.middleware = (folder) => {
    var storage = multer.diskStorage({
        destination: `./public/images/${folder}`,
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '__' + Date.now() + path.extname(file.originalname))
        }
    })
    return upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(null, false, new Error('Only images are allowed'))
            }

            callback(null, true);


        },
        limits: {
            fileSize: 1024 * 1024 * 1
        },
    }).single(`${folder}`);
}

module.exports = UploadImage;