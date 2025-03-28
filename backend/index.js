require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./src/Routes/UserRoute");

const app = express();

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.use("/api/users", userRoutes);

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