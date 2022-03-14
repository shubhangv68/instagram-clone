const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { getUser, updateUser, followUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profile-pics';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProfilePic = multer({ storage: profilePicStorage });

router.get('/:id', authMiddleware, getUser);

router.put('/:id', authMiddleware, uploadProfilePic.single('avatar'), updateUser);

router.put('/follow/:id', authMiddleware, followUser);

router.put('/follow/:id', authMiddleware, followUser);

module.exports = router;
