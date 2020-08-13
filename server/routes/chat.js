const express = require('express'),
    router = express.Router(),
    multer = require("multer"),
    fs = require("fs");
    
const { Chat } = require("../models/chat");
const { auth } = require("../middleware/auth");

router.get("/getChat", (req, res) => {
    Chat.find()
        .populate("sender")
        .exec((err, chat) => {
            if (err) return res.status(400).send(err)
            res.status(200).send(chat)
        })
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.mp4'){
            return cb(res.status(400).end('only jpg, png and mp4 are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single('file')

router.post("/uploadFiles", auth, (req, res) => {
    upload(req, res, err => {
        if (err) return res.json({ success: false, err })
        return res.json({ success: true, url: res.req.file.path })
    })
});


module.exports = router;