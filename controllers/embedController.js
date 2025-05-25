const express = required("express")

exports.generateEmbedCode = (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;
        const embedCode = `<script src="https://yourdomain.com/chatbot.js?id=${chatbotId}"></script>`;
        res.json({ embedCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};