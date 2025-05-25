const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

exports.extractText = async (userId, chatbotName) => {
    const userDir = path.join(__dirname, "../upload", userId, chatbotName);
    const files = fs.readdirSync(userDir).filter(file => file.endsWith(".pdf"));

    let trainingData = "";
    for (const file of files) {
        const filePath = path.join(userDir, file);
        const dataBuffer = fs.readFileSync(filePath);
        const parsedData = await pdfParse(dataBuffer);
        trainingData += parsedData.text + "\n";
    }

    return trainingData;
};