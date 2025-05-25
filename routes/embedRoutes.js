const express = require('express');
const { generateEmbedCode } = require('../controllers/embedController');

const router = express.Router();

router.get('/:chatbotId/embed', generateEmbedCode);

module.exports = router;