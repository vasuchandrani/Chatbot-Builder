const chatbotData = {
    files: [],
    messages: [],
    faqs: []
};

// File Upload Handling
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = "#f0f0f0";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.backgroundColor = "#ffffff";
});

dropArea.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = "#ffffff";
    const file = event.dataTransfer.files[0];
    await uploadFile(file);
});

dropArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    await uploadFile(file);
});

async function uploadFile(file) {
    if (!file || file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
    }

    chatbotData.files.push(file.name);
    renderUploadedFiles();
}

function renderUploadedFiles() {
    document.getElementById("dropArea").innerHTML = `
        <p>Uploaded Files:</p>
        <ul>${chatbotData.files.map(file => `<li>${file}</li>`).join('')}</ul>
    `;
}

// Message Handling
function addMessage() {
    const messageInput = document.getElementById("messageInput").value;
    if (!messageInput) return;

    chatbotData.messages.push(messageInput);
    renderMessages();
}

function clearMessages() {
    chatbotData.messages = [];
    renderMessages();
}

function renderMessages() {
    document.getElementById("messageList").innerHTML = `
        <p>Chatbot Messages:</p>
        <ul>${chatbotData.messages.map(msg => `<li>${msg}</li>`).join('')}</ul>
    `;
}

// FAQ Handling
function addFAQ() {
    const question = document.getElementById("faqQuestion").value;
    const answer = document.getElementById("faqAnswer").value;
    if (!question || !answer) return;

    chatbotData.faqs.push({ question, answer });
    renderFAQs();
}

function renderFAQs() {
    document.getElementById("faqList").innerHTML = `
        <p>FAQs:</p>
        <ul>${chatbotData.faqs.map(faq => `<li><strong>${faq.question}</strong>: ${faq.answer}</li>`).join('')}</ul>
    `;
}

// Save Chatbot
async function saveChatbot() {
    const botName = document.getElementById("botName").value;
    if (!botName) {
        alert("Enter chatbot name first.");
        return;
    }

    const response = await fetch("/chatbot/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: botName, trainingData: chatbotData })
    });

    const result = await response.json();
    alert(result.message);
}