const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/createPost', auth, multer, postCtrl.createPost);
router.get('/getAllPost', auth, postCtrl.getAllPosts);
router.get('/getOnePost/:postId', auth, postCtrl.getOnePost);
router.get('/getUserPosts/:userId', auth, postCtrl.getUserPosts);
router.put('/modifyPost/:postid', auth, multer, postCtrl.modifyPost);
router.delete('/deletePost/:postid', auth, postCtrl.deletePost);

module.exports = router;