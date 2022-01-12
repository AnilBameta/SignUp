const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WatchListSchema = new Schema({
     _id: mongoose.Types.ObjectId,
    UserName: {
        type: String,
        required: [true, 'UserName field is required']
    },
    MovieList: [String]
    
})

const WatchList = mongoose.model('watchList',WatchListSchema);

module.exports = WatchList;