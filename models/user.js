const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserName: {
        type: String,
        required: [true, 'UserName field is required']
    },
    Password: {
        type: String,
        required: [true, 'Password field is required']
    },
});


const User = mongoose.model('user',UserSchema);

module.exports = User;