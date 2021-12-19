const multer = require('multer');
const router = require('express').Router();
const file_controller = require('../controllers/fileController');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const files = multer({ storage: storage });

router.post('/', files.single('file'), file_controller.file2Base64);

module.exports = router;
