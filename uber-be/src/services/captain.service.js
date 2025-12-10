const captainModel = require('../models/captain.model');

const createCaptain = async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
    if (!firstname || !email || !password || !color || !plate || capacity === undefined ||
        capacity === null || !vehicleType) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });
    return captain;
}


module.exports = { createCaptain };