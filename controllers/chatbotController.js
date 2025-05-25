const chatbotModel = require("../models/chatbot"); 
const fs = require("fs");
const path = require("path");

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

// ✅ FIX: `showData` now supports POST requests properly
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

exports.getChatbotId = async (req, res) => {
    try {
        const { chatbotName } = req.body;
        const chatbot = await chatbotModel.findOne({ name: chatbotName });

        if (!chatbot) {
            return res.status(404).json({ message: "Chatbot not found." });
        }

        res.json({ chatbotId: chatbot._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ FIX: Deploy locally & render chatbot page directly
exports.deployChatbot = async (req, res) => {
    try {
        const { chatbotId, userId, chatbotName } = req.body;

        if (!chatbotId || !userId || !chatbotName) {
            return res.status(400).json({ message: "Chatbot ID, User ID, and Chatbot Name are required." });
        }

        const userDir = path.join(__dirname, "../upload", userId, chatbotName);

        if (!fs.existsSync(userDir) || fs.readdirSync(userDir).length === 0) {
            return res.status(400).json({ message: "No files uploaded. Please upload files before deploying." });
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

// ✅ NEW: Render chatbot page for local usage
exports.renderChatbot = async (req, res) => {
    try {
        const { botId } = req.query;

        if (!botId) {
            return res.status(400).send("Chatbot ID is required.");
        }

        const chatbot = await chatbotModel.findById(botId);
        if (!chatbot) {
            return res.status(404).send("Chatbot not found.");
        }

        res.render("chatbot", { chatbotName: chatbot.name, chatbotId: botId });
    } catch (error) {
        res.status(500).send("Error rendering chatbot.");
    }
};