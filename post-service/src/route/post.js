const express = require('express')
const router = express()
const { createPost, getPosts ,getSinglePost,deletePost} = require('../controller/post')
const { verifyToken } = require('../middleware/verifyToken')
console.log(`router`);

router.post('/create', verifyToken, createPost)
router.get('/get',verifyToken, getPosts)
router.get('/single-get/:id', verifyToken, getSinglePost);
router.post('/delete/:id', verifyToken, deletePost);

module.exports = router