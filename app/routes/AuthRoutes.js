const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

router.post("/login", AuthController.login);

router.post("/register/", AuthController.signUp);

module.exports = router;