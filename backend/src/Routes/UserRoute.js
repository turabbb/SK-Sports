const express = require("express");
const { addUser, login, logout } = require("../Controllers/UserController");
const router = express.Router();

router.post("/register", addUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
