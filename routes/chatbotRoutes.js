const express = require("express");
const router = express.Router();
const upload = require("../services/localUpload");
const chatbotController = require("../controllers/chatbotController");

router.post("/upload", upload, chatbotController.uploadFiles);
router.post("/showData", chatbotController.showData);
router.post("/deploy", chatbotController.deployChatbot);
router.get("/render", chatbotController.renderChatbot);
router.get("/getBot", chatbotController.getBot);


module.exports = router;