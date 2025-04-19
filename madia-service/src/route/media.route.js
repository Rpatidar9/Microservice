const express = require('express');
const router = express.Router();
const { uploadMedia ,GetAllUploadMedia,updateMedia} = require('../controller/media.controller');
const {uploadImage} = require('../utills/fileUpload');
router.post('/upload', uploadImage, uploadMedia);
router.patch('/update', updateMedia);
router.get('/getAll-upload-media', GetAllUploadMedia);
module.exports = router;