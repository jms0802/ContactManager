const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

// Get Login Page
// GET /
const getLogin = (req, res) => {
    const cookies = req.headers.cookie ? req.headers.cookie.split('; ') : [];
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    let verifiedToken;
    try {
        verifiedToken = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.render("home");
    }
    res.redirect("/contacts");
};

// Login user
// POST /
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.json({ messsage: '일치하는 사용자가 없습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ messsage: '잘못된 비밀번호 입니다.' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/contacts");
});

// Register page
// GET /register
const getRegister = (req, res) => {
    res.render("register");
}

// Register user
// Post /register

const registerUser = asyncHandler(async (req, res) => {
    const { username, password1, password2 } = req.body;

    if (password1 === password2) {
        const hashedPassword = await bcrypt.hash(password1, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.redirect("/");
    } else {
        res.send("Register Failed");
    }
})

// Logout user
// POST /logout
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');;
    res.redirect('/');
})


module.exports = { getLogin, loginUser, getRegister, registerUser, logoutUser };