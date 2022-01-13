const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genreSchema = new Schema( {
    User:{type:String},
    UserName:{
        type:[String]
    },
    Genre:{ 
        type :String
    },
    Movie: {type: String},
    Count:{type:Number}

} )


const GenreWise = mongoose.model('genreWise',genreSchema);

module.exports = GenreWise;