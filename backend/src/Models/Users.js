const mongoose = require("mongoose");
const {comparePassword, hashPassword} = require("../middleware/passwordHashing")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.methods.comparePassword = comparePassword;
UserSchema.pre('save',hashPassword);

module.exports = mongoose.model("User", UserSchema);
