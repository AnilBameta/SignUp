const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genreCountSchema = new Schema( {
    Genre:{ 
        type :String
    },
    MaxMovie: {type: String},
    Count:{type:Number}

} )


const GenreWiseCount = mongoose.model('genreWiseCount',genreCountSchema);

module.exports = GenreWiseCount;