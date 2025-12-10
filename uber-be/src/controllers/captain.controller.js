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

module.exports = {
    registerCaptain
};