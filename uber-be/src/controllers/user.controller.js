const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


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

module.exports = { registerUser };