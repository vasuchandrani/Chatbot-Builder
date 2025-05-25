const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array("documents", 20);

const saveFilesToDisk = (req) => {
    const userId = req.body.userId;
    const chatbotName = req.body.chatbotName;

    if (!userId || !chatbotName) {
        throw new Error("Missing user ID or chatbot name in request body");
    }

    const userDir = path.join(__dirname, "../upload", userId, chatbotName);
    fs.mkdirSync(userDir, { recursive: true });

    req.files.forEach((file) => {
        const filePath = path.join(userDir, `${Date.now()}-${file.originalname}`);
        fs.writeFileSync(filePath, file.buffer);
    });
};

module.exports = {
    upload,
    saveFilesToDisk,
};