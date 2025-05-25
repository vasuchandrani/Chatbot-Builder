const axios = require("axios");

async function getFileBasedChatbotResponse(files, userMessage) {
    try {
        const combinedText = files.map(file => file.content).join("\n");

        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Answer using the following document data only." },
                { role: "user", content: `Data: ${combinedText}\n\nQuestion: ${userMessage}` }
            ]
        }, {
            headers: { Authorization: `Bearer YOUR_API_KEY` }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Chatbot AI Error:", error);
        return "Oops! Something went wrong.";
    }
}

module.exports = { getFileBasedChatbotResponse };