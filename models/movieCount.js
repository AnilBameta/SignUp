const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MovieCountSchema = new Schema( {

    Movie:{ 
        type :  mongoose.Schema.Types.ObjectId,
        ref :  "watchList"
    },
    count:{ type: Number}

} )


const MovieCount = mongoose.model('movieCount',MovieCountSchema);

module.exports = MovieCount;