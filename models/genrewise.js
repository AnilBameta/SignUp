const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genreSchema = new Schema( {
    Genre:{ 
        type :String
    },
    Movie: {type: String},
    MoviesList:{ type: Array},
    MostMovie: {type:String},
    Count:{type:Number}

} )


const GenreWise = mongoose.model('genreWise',genreSchema);

module.exports = GenreWise;