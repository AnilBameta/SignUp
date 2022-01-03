const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    UserName: {
        type: String,
        required: [true, 'UserName field is required']
    },
    MovieList: {
        type: Array
    }
})

const WatchList = mongoose.model('watchList',UserSchema);

module.exports = WatchList;