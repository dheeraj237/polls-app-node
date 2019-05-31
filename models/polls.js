const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    pollName: String,
    createdTime: {
        type: Date,
        default: Date.now
    },
    options: {
        type: String,
        get: function (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        },
        set: function (data) {
            return JSON.stringify(data);
        }
    },
    voters: []
});

module.exports = mongoose.model('Polls', userSchema)