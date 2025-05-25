const chatbot = require("../models/chatbot");
const path = require('path');

exports.uploadFiles = async (req, res) => {
    try {
        const { chatbotId } = req.body;
        const fileUrls = req.files.map(file => path.join('/uploads', file.filename));

        await chatbot.findByIdAndUpdate(chatbotId, { $push: { document: { $each: fileUrls } } });

        res.json({ message: "Files uploaded successfully!", fileUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createChatbot = async (req, res) => {
    try {
        const { botName } = req.body;
        const userId = req.user._id;

        const chatbot = new chatbot({ userId, name: botName, document: [], messages: "", faqs: [] });
        await chatbot.save();

        res.json({ message: "chatbot created successfully!", chatbotId: chatbot._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { chatbotId, message } = req.body;
        await chatbot.findByIdAndUpdate(chatbotId, { $set: { messages: message } });
        res.json({ message: "Message added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addFAQ = async (req, res) => {
    try {
        const { chatbotId, question, answer } = req.body;
        await chatbot.findByIdAndUpdate(chatbotId, { $push: { faqs: { question, answer } } });
        res.json({ message: "FAQ added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deployChatbot = async (req, res) => {
    try {
        const { chatbotId } = req.body;

        const embedCode = `
        <script>
        (function() {
            window.onload = function() {
                const iframe = document.createElement("iframe");
                iframe.src = "https://yourdomain.com/chatbot?botId=${chatbotId}";
                iframe.style.width = "100%";
                iframe.style.height = "600px";
                document.body.appendChild(iframe);
            };
        })();
        </script>
        `;

        res.json({ embedCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};