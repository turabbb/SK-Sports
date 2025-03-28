const generateToken = require("../middleware/authMiddleware");
const User = require("../Models/Users");

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ Error: "User not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ Error: "Invalid credentials" });
        }
        const token = await generateToken(user.id);
        res.cookie("token", token, { httpOnly: true, sameSite: "None", secure: true });
        res.status(200).send({ Message: "Login successful", user, token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send({ Error: "Error logging in" });
    }

}

// Register a new user
const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send({ Message: "User created successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ Error: "Error adding user" });
    }
}

module.exports = { addUser, login };
