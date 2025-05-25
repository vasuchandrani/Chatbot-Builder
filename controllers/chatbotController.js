const chatbotModel = require("../models/chatbot"); 
const fs = require("fs");
const path = require("path");
const aiService = require("../services/aiService");

exports.uploadFiles = async (req, res) => {
    try {
        const { userId, chatbotName } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const userDir = path.join(__dirname, "../upload", userId, chatbotName);
        fs.mkdirSync(userDir, { recursive: true });

        const fileUrls = req.files.map(file => ({
            name: file.filename,
            url: `/uploads/${userId}/${chatbotName}/${file.filename}`
        }));

        res.json({ message: "Files uploaded successfully!", files: fileUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.showData = async (req, res) => {
    try {
        const { userId, chatbotName } = req.body;

        if (!userId || !chatbotName) {
            return res.status(400).json({ message: "User ID and chatbot name are required." });
        }

        const userDir = path.join(__dirname, "../upload", userId, chatbotName);

        if (!fs.existsSync(userDir)) {
            return res.status(400).json({ message: "No files uploaded for this chatbot yet." });
        }

        const files = fs.readdirSync(userDir).map(file => ({
            name: file,
            url: `/uploads/${userId}/${chatbotName}/${file}`
        }));

        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deployChatbot = async (req, res) => {
    try {
        const { chatbotId, userId, chatbotName } = req.body;

        if (!chatbotId || !userId || !chatbotName) {
            return res.status(400).json({ message: "Chatbot ID, User ID, and Chatbot Name are required." });
        }

        const embedCode = `
        <script>
        (function() {
            window.onload = function() {
                const iframe = document.createElement("iframe");
                iframe.src = "http://localhost:5000/chatbot/render?botId=${chatbotId}";
                iframe.style.width = "100%";
                iframe.style.height = "600px";
                document.body.appendChild(iframe);
            };
        })();
        </script>`;

        res.json({ message: "Chatbot deployed successfully!", embedCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.renderChatbot = async (req, res) => {
    try {
        const { botId } = req.query;
        res.render("chatbot", { chatbotId: botId });
    } catch (error) {
        res.status(500).send("Error rendering chatbot.");
    }
};

// ✅ FIX: Function to fetch chatbot details
exports.getBot = async (req, res) => {
    try {
        const { botId } = req.query;

        if (!botId) {
            return res.status(400).json({ message: "Bot ID is required." });
        }

        const chatbot = await chatbotModel.findById(botId);

        if (!chatbot) {
            return res.status(404).json({ message: "Chatbot not found." });
        }

        res.json({ chatbotName: chatbot.name, chatbotId: chatbot._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};