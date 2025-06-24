require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');

const userRoutes = require("./src/Routes/UserRoute");
const productRoutes = require("./src/Routes/Products");
const orderRoutes = require("./src/Routes/Orders");

const app = express();

// Middlewares for CORS, static files, JSON parsing, cookie parsing, and file uploads
app.use(cors({ 
  origin: [
    "https://sksportspk.com",
    "https://www.sksportspk.com"
  ], 
  credentials: true 
}));
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(fileUpload({ 
  useTempFiles: true, 
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, 
  abortOnLimit: true
}));


// Routes
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

// Connect to MongoDB & start server
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("MongoDB Connected...");
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(error => {
        console.error("Database connection error:", error);
    });