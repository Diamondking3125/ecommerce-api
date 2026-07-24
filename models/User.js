const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:  { type: String },
        email: { type: String, unique: true }
    }, { timestamps: true }
)

User = mongoose.model('User', userSchema);

module.exports = User;