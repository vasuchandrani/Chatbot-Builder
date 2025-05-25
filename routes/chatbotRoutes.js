const express = require("express");
const router = express.Router();
const { upload, saveFilesToDisk } = require("../services/localUpload");
const chatbotController = require("../controllers/chatbotController");

// 👇 Wrap multer handler manually and then run your controller
router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      saveFilesToDisk(req); // Write files to disk
      chatbotController.uploadFiles(req, res); // Continue to controller
    } catch (saveErr) {
      return res.status(500).json({ message: saveErr.message });
    }
  });
});

router.post("/showData", chatbotController.showData);
router.post("/deploy", chatbotController.deployChatbot);
router.get("/render", chatbotController.renderChatbot);
router.post("/getChatbotId", chatbotController.getBot);

module.exports = router;