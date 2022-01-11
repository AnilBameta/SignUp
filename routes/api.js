const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../models/watchList');
const MovieCount = require('../models/movieCount');
const GenreWise = require('../models/genrewise');



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

router.post('/genreWise', (req, res, next) => {
    GenreWise.findOneAndUpdate({ "Genre": req.body.Genre }, { $push: { MoviesList: req.body.Movie } }, { upsert: true }, (error, data) => {
        if (error) {
            return error
        }
        else {

            res.json({
                message: 'Added Succesfully'
            })
        }
    })



    let mov = [];

    GenreWise.find({ "Genre": req.body.Genre })
        .then(response => {
            mov = response[0].MoviesList
            console.log(mov)


            let hmap = new Map();
		
		hmap.put(mov[0], 1);
		
		let maxFrequency =  1;
		let maxElement = mov[0];
		
		for(let i=1;i<mov.length;i++) {
			let keyExists = hmap.containsKey(mov[i]);
			if(keyExists) {
				let existingFreq = hmap.get(mov[i]);
				hmap.put(mov[i], existingFreq+1);
			}else {
				hmap.put(mov[i],1);
			}
			
			let freq = hmap.get(mov[i]);
			if(freq > maxFrequency) {
				maxFrequency = freq;
				maxElement = mov[i];
			}

		}

            // for (let i = 0; i < mov.length; i++) {
            //     for (let j = i; j < mov.length; j++) {
            //         if (mov[i] == mov[j])
            //             m++;
            //         if (mf <= m) {
            //             mf = m;
            //             item = mov[i];
            //         }
            //     }
            //     m = 0;
            // }
            console.log(`${maxElement} ( ${maxFrequency} times ) `);

            GenreWise.findOneAndUpdate({ "Genre": req.body.Genre },
                {
                    "MostMovie": item,
                    "Count": mf
                }, { upsert: true },
                (err, data) => {
                    if (err) {
                        return err
                    }
                    else {

                        res.json({
                            message: 'Added Succesfully'
                        })
                    }
                }
            )


        })
        .catch(err => 
            cosole.log(err))

})








     



    router.get("/genreWise",(req,res,next) => {

        GenreWise.find({})
        .then(response=> res.send(response))
        .catch(err => err)
    })

module.exports = router;