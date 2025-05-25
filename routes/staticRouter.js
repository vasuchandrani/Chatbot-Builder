const express = require("express");
const chatbot = require("../models/chatbot"); 
const router = express.Router();

router.get("/", async (req, res) => {

    if (!req.user) {
        return res.redirect("/login");
    }

    const allChatbots = await chatbot.find({ createdBy: req.user._id })  ;
    return res.render("home", {
        chatbots : allChatbots
    });
})

router.get("/signup", (req, res) => {
    return res.render("signup")
})

router.get("/login", (req, res) => {
    return res.render("login")
}) 

router.get("/create", (req, res) => {
    return res.render("create")
})

router.get("/pricing", (req, res) => {
    return res.render("pricing")
})

module.exports = router;