const express = require("express");
const router = express.Router();
const {getLogin, loginUser, getRegister, registerUser, logoutUser} = require("../controllers/loginController");

router.route("/").get(getLogin).post(loginUser);
router.route("/register").get(getRegister).post(registerUser);
router.route("/logout").post(logoutUser);

module.exports = router;