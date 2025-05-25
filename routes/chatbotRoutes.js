const express = require("express");
const router = express.Router();
const upload = require("../services/localUpload");
const chatbotController = require("../controllers/chatbotController");

router.post("/upload", upload.array("documents", 10), chatbotController.uploadFiles);
router.get("/showData", chatbotController.showData);
router.get("/getChatbotId", chatbotController.getChatbotId);
router.post("/deploy", chatbotController.deployChatbot);

module.exports = router;