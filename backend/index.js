require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');

const userRoutes = require("./src/Routes/UserRoute");
const productRoutes = require("./src/Routes/Products");
const orderRoutes = require ("./src/Routes/Orders");

const app = express();

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Hello World!");
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


    //Heres a comment I added to check the commit.