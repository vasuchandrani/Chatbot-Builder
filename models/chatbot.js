const mongoose = require('mongoose');

const ChatbotSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: {
            type : String,
            required : true
        }, 
        document: [String],
        messages: {
            type : String, 
        },  
        faqs: [{ question: String, answer: String }]
    }
);

const chatbot = mongoose.model.chatbot || mongoose.model('chatbot', ChatbotSchema);

module.exports = chatbot;