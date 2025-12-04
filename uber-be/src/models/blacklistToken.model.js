const mongoose = require('mongoose');


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.JWT_SECRET_EXPIRY // Token will be removed from the collection after 24 hours
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);