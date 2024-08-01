const jwt = require('jsonwebtoken');
const dotnev = require('dotenv').config();
const User = require('../models/userModel');
const createError = require('../utils/appError');

const jwtSecretKey = process.env.jwt_secret_key;

//Register
exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return next(new createError('User already exists!', 400));
        }
        const newUser = await User.create(req.body);

        //Create jwt token
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, jwtSecretKey, { expiresIn: '10m' });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token: token
        });
    }
    catch (error) {
        next(error);
    }
}

//Login
exports.login = async (req, res, next) => { };