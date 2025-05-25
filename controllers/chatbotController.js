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

exports.showData = async (req, res) => {
    try {
        const { userId, chatbotName } = req.query;

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
        const { chatbotName } = req.query;
        const chatbot = await chatbotModel.findOne({ name: chatbotName });

        if (!chatbot) {
            return res.status(404).json({ message: "Chatbot not found." });
        }

        res.json({ chatbotId: chatbot._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deployChatbot = async (req, res) => {
    try {
        const { chatbotId } = req.body;
        if (!chatbotId) {
            return res.status(400).json({ message: "Chatbot ID missing." });
        }

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
        </script>`;

        res.json({ message: "Chatbot deployed successfully!", embedCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};