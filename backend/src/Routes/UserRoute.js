const express = require("express");
const { addUser, login } = require("../Controllers/UserController");
const router = express.Router();

router.post("/register", addUser);
router.post("/login", login);

module.exports = router;
