const express = require('express');
const router = express.Router();
const { uploadMedia ,GetAllUploadMedia} = require('../controller/media.controller');
const {uploadImage} = require('../utills/fileUpload');
router.post('/upload', uploadImage, uploadMedia);
router.post('/getAll-upload-media', uploadImage, GetAllUploadMedia);
module.exports = router;