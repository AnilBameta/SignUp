const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../models/watchList');
const GenreWise = require('../models/genrewise');
const { response } = require('express');



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
}
)
   router.get('/mostMovie',(req,res,next)=> {
    WatchList.aggregate(
        [
            { $unwind: "$MovieList" },
            { $group: { _id: "$MovieList", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]
    )
        .then(response =>
            res.send(response)
        )
        .catch(err => err)
   }) 




router.post('/genreWise', async (req, res, next) => {
    console.log(req.body.User)
    const userselected = await GenreWise.findOne({
        UserName:req.body.User,
        Movie: req.body.Movie,
        Genre: req.body.Genre
    })
    if(userselected){
        res.json({Message:"Movie Aready Added"})
    }
    else {
    const selected = await GenreWise.findOne({
        Movie: req.body.Movie,
        Genre: req.body.Genre
    })
     
    if (selected) {
        const selectedMovie = await GenreWise.findOneAndUpdate(
            {
                Movie: req.body.Movie,
                Genre: req.body.Genre
            }, {
                $addToSet: {UserName: req.body.User} ,
            Count: selected.Count + 1
        }
        )
        selectedMovie.save()

    }
    else {
        await GenreWise.create({
            $push: { UserName: req.body.User },
            Movie: req.body.Movie,
            Genre: req.body.Genre,
            Count: 1
        })
            .then(res.json({
                status: "new movie added to db"
            }))

    }
}
})











router.get("/genreWise", (req, res, next) => {
    const mySet1 = ["Comedy","Thriller","Adventure","Science Fiction","Action","Horror"]
    let myvalue1 = []
    try{
      let c=0;  
    mySet1.forEach(function(value) {
    GenreWise.find({ Genre: value }).sort({ Count: -1 }).limit(1)
        .then(re => {
           myvalue1.push(re[0])
           c++
           if(c==6)
           {
             res.send(myvalue1)
           }
        })
        .catch(err => console.log(err)) 
    })
   
    
}
catch{
    res.send("No movie entered")
}

})

module.exports = router;