const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);;

// let User = mongoose.model('User', userSchema);

// module.exports.addUser = function (book, callback) {
//     User.create(book, callback);
// };