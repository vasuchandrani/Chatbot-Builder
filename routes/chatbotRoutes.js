const express = require('express');
const { createChatbot, uploadFiles, addMessage, addFAQ, deployChatbot } = require('../controllers/chatbotController');
const { restrictToLoggedinUserOnly } = require('../middlewares/authMiddleware');
const upload = require('../services/localUpload'); // Using local file storage now

const router = express.Router();

// File Upload Route (Local Server Storage)
router.post('/upload', restrictToLoggedinUserOnly, upload.array('documents', 5), uploadFiles);

// Chatbot CRUD Operations
router.post('/create', restrictToLoggedinUserOnly, createChatbot);
router.post('/addMessage', restrictToLoggedinUserOnly, addMessage);
router.post('/addFAQ', restrictToLoggedinUserOnly, addFAQ);
router.post('/deploy', restrictToLoggedinUserOnly, deployChatbot);

module.exports = router;