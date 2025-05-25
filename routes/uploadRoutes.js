const express = require('express');
const multer = require('multer');

const router = express.Router();
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

router.post('/upload', upload.single('document'), (req, res) => {
    res.json({ message: "File uploaded successfully", filePath: req.file.path });
});

module.exports = router;