require('dotenv').config();
const cors = require('cors'); // Added CORS handling

const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require("./connect");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectToDatabase("mongodb://localhost:27017/chatbot")
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    })
    .catch(() => {
        console.log("Connection failed!!");
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// set view engine
const path = require("path");
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

const cookieParser = require("cookie-parser");
app.use(cookieParser()); 

const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/authMiddleware")

// Routers
const staticRouter = require('./routes/staticRouter');
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes')

app.use('/', checkAuth, staticRouter);
app.use('/user', authRoutes);
app.use('/chatbot',restrictToLoggedinUserOnly, chatbotRoutes);