const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MovieCountSchema = new Schema( {
    _id:mongoose.Schema.Types.ObjectId,
    Movie:{ 
        type :String
    },
    count:{ type: Number}

} )


const MovieCount = mongoose.model('movieCount',MovieCountSchema);

module.exports = MovieCount;