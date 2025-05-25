const express = require("express");
const router = express.Router();
const upload = require("../services/localUpload");
const chatbotController = require("../controllers/chatbotController");

router.post("/upload", upload.array("documents", 10), chatbotController.uploadFiles);
router.post("/showData", chatbotController.showData);
router.post("/getChatbotId", chatbotController.getChatbotId);
router.post("/deploy", chatbotController.deployChatbot);

// ✅ NEW: Render chatbot page locally
router.get("/render", chatbotController.renderChatbot);

module.exports = router;