const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        const chatbotName = req.body.chatbotName;

        if (!userId || !chatbotName) {
            return cb(new Error("Missing user ID or chatbot name"), null); // ✅ FIX: Handle missing values
        }

        const userDir = path.join(__dirname, '../upload', userId, chatbotName);
        fs.mkdirSync(userDir, { recursive: true });

        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;