const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genreWiseSchema = new Schema( {
   Genre: String,
    Movie:{ 
        type :String
    },
    count:{ type: Number}

} )


const GenreWiseCount = mongoose.model('genrewiseCount',genreWiseSchema);

module.exports = GenreWiseCount;