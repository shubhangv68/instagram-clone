const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addComment, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/', authMiddleware, getPosts);
router.put('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, addComment);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
