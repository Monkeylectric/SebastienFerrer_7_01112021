const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/getUser/:id', auth, userCtrl.getUser);
router.get('/getUserPosts/:id', auth, userCtrl.getUserPosts);
router.put('/modifyUser/:id', auth, multer, userCtrl.modifyUser);
router.delete('/deleteUser/:id', auth, userCtrl.deleteUser);
//router.get('/getAllUsers', auth, userCtrl.getAllUsers);

module.exports = router;