const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const createError = require('../utils/appError');

dotenv.config();
const jwtSecretKey = process.env.jwt_secret_key;

//Register
exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(400);
            throw new Error("User already exists!");
        }

        const newUser = await User.create(req.body);

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.firstName + " " + newUser.lastName,
                email: newUser.email,
                status: 'success',
                message: 'User registered successfully',
            });
        }
        else {
            res.status(400);
            throw new Error("Failed to create user!");
        }
    }
    catch (error) {
        next(error);
    }
}

//Login
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user && (await bcrypt.compare(req.body.password, user.password))) {

            //Create JWT token
            const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, jwtSecretKey, { expiresIn: '10m' });
            res.json({
                _id: user._id,
                name: user.firstName + " " + user.lastName,
                email: user.email,
                token: token
            });
        }
        else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        next(error);
    }
};

//Profile Update
exports.profileUpdate = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.updateOne({ _id: userId }, req.body);
        await Notification.create({
            notiMessage: `${req.body.email} updates the profile`
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

//Get User
exports.getUser = async (req, res, next) => {
    try {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        next(error);
    }
};

//Get Notifications
exports.getNotifications = async (req, res, next) => {
    try {
        try {
            const notifications = await Notification.find({ isSeen: false });
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        next(error);
    }
};