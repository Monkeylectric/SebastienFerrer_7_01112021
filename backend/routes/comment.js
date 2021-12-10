const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/createComment', auth, commentCtrl.createComment);
router.get('/:id', auth, commentCtrl.getComments);
router.delete('/deleteComment/:id', auth, commentCtrl.deleteComment);

module.exports = router;