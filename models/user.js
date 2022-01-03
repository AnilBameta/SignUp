const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    UserName: {
        type: String,
        required: [true, 'UserName field is required']
    },
    Password: {
        type: String,
        required: [true, 'Password field is required']
    },
    MobileNumber: {
        type: Number
    },
    Email: {
        type:String
    }
});


const User = mongoose.model('user',UserSchema);

module.exports = User;