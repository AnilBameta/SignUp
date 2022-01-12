const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../models/watchList');
const MovieCount = require('../models/movieCount');
const GenreWise = require('../models/genrewise');
const GenreWiseCount = require('../models/genreWiseCount');


router.post('/Sign', (req, res, next) => {
    User.find({ UserName: req.body.UserName })
        .exec()
        .then(response => {
            if (response.length >= 1) {
                return res.status(409).json({
                    message: 'UserName exists'
                })
            }
            else {
                const user = new User({
                    UserName: req.body.UserName,
                    Password: req.body.Password,
                    MobileNumber: req.body.MobileNumber,
                    Email: req.body.Email
                }
                );
                user.save()
                    .then(() => res.json())
                    .catch(err => err)
            }
        });
})


router.post('/Login', (req, res, next) => {
    User.find({ UserName: req.body.UserName })
        .exec()
        .then(response => {
            if (response.length < 1) {
                return res.status(401).json({
                    message: 'LogIn failed'
                })
            }
            else {
                if (response[0].Password.localeCompare(req.body.Password) === 0) {
                    return res.json(response[0].UserName)
                }
                else {
                    return res.status(401).json({
                        message: 'LogIn failed'
                    })
                }
            }
        })
})

router.post('/watchlist', (req, res, next) => {
    WatchList.findOneAndUpdate({ UserName: req.body.UserName }, { $addToSet: { MovieList: req.body.Movie } }, { upsert: true }, (error, data) => {
        if (error) {
            return error
        }
        else {
            console.log(data)
            res.json({
                message: 'Added Succesfully'
            })
        }
    }
    )

    WatchList.aggregate(
        [
            { $unwind: "$MovieList" },
            { $group: { _id: "$MovieList", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]
    )
        .then(response =>
            MovieCount.insertMany({

                "Movie": response[0]._id,
                "count": response[0].count

            })

        )
        .catch(err => err)

}
)

router.get('/movieCount', (req, res, next) => {
    MovieCount.find({})
        .then(response => res.send(response[response.length-1]))
        .catch(err => err)

})


router.post('/genreWise',async(req,res,next)=>{
const selected = await GenreWise.findOne({
    Movie:req.body.Movie,
    Genre:req.body.Genre
})

if(selected){
    res.json({
        status:"existing movie found"
    })
     const selectedMovie=await GenreWise.findOneAndUpdate(
        {
        Movie:req.body.Movie,
        Genre:req.body.Genre
        },{
            Count:selected.Count+1
        },{
            upsert:true
        }
    )
    selectedMovie.save()
    
}
else{
     await GenreWise.create({
        Movie:req.body.Movie,
        Genre:req.body.Genre,
        Count:1
    })
    .then(res.json({
        status:"new movie added to db"
    }))
        
}

 GenreWise.find({Genre : req.body.Genre}).sort({Count:-1}).limit(1)
 .then(re=> {
     console.log(re[0].Genre,re[0].Movie,re[0].Count)
    GenreWiseCount.findOneAndUpdate({Genre:re[0].Genre},
    {
        MaxMovie:re[0].Movie,
        Count:re[0].Count
    },
    {
        upsert:true
    })
    
 })
 .catch(err => console.log(err))
})




     



    router.get("/genreWise",(req,res,next) => {

        GenreWise.find({})
        .then(response=> res.send(response))
        .catch(err => err)
    })

module.exports = router;