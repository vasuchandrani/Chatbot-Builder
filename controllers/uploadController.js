const express = required("express")

exports.uploadFile = (req, res) => {
    try {
        if (!req.file) 
            return res.status(400).json({ message: "No file uploaded" });
        
        res.json({ message: "File uploaded successfully", filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};