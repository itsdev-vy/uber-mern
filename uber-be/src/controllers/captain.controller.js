const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModal = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

const registerCaptain = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullname, email, password, vehicle } = req.body;
        const { firstname, lastname } = fullname;
        const { color, plate, capacity, vehicleType } = vehicle;

        const isCaptainExists = await captainModal.findOne({ email });

        if (isCaptainExists) {
            return res.status(400).json({ error: 'Captain with this email already exists' });
        }

        const hashedPassword = await captainModal.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            color,
            plate,
            capacity,
            vehicleType
        });

        const token = captain.generateAuthToken();

        res.status(201).json({ message: 'Captain registered successfully', token, captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const loginCaptain = async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const captain = await captainModal.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await captain.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ message: 'Login successful', token, captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCaptainProfile = async (req, res) => {
    res.status(200).json({ captain: req.captain });
}

const logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        await blacklistTokenModel.create({ token });

        res.clearCookie('token');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
};