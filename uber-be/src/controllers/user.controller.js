const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');


const registerUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({ firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashedPassword });
        const token = user.generateAuthToken();
        res.status(201).json({ token, user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        next(error);
    }
};


const loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });
    if (!isUserExists) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
};


const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};


const logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, getUserProfile, logoutUser };