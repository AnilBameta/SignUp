const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../models/watchList');
const MovieCount = require('../models/movieCount');
const GenreWise = require('../models/genrewise');
const GenreWiseCount = require('../models/genrewiseCount');


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

    // WatchList.find({ UserName: req.body.UserName })
    //     .exec()
    //     .then(response => {
    //         if (response.length < 1) {
    //             const watchList = new WatchList({
    //                 UserName: req.body.UserName
    //             })
    //             watchList.save()
    //                 .then(() => res.json())
    //                 .catch((err) => err)
    //         }
    //     })
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

// let max=1
// let sendItem =''
// router.get('/watchlist', (req, res, next) => {

//     WatchList.find({}).then(function(response){
//             res.send(response);
//             let m =[]
//             let movie = response.slice()
//             movie.map(item => {
//                 item.MovieList.map(items => {
//                     m.push(items)
//                 })
//                 })
//                 console.log(m)




//                 for (let i=0; i<mov.length; i++)
// {
//         for (let j=i; j<mov.length; j++)
//         {
//                 if (mov[i] == mov[j])
//                  m++;
//                 if (mf<m)
//                 {
//                   mf=m; 
//                   item = mov[i];
//                 }
//         }
//         m=0;
// }
// console.log(`${item} ( ${mf} times ) `) ;


// let uniqueM = []
// m.forEach((c) => {
//     if (!uniqueM.includes(c)) {
//         uniqueM.push(c);
//     }
// });
// console.log(uniqueM)

// uniqueM.map(item => {
//     function getOccurrence(array, value) {
//         var count = 0;
//         array.forEach((v) => (v.localeCompare(value)===0 && count++));
//         return count;
//     }
//     let output=getOccurrence(m, item)

//     if(output>=max)
//     {
//         max=output
//         sendItem = item
//     }

// })
//         console.log(sendItem,max);


//         MovieCount.insertMany({

//             "Movie":sendItem,
//             "count":max

//     }) 

//     }).catch(err => err);
// })

router.get('/watchlist', async (req, res, next) => {
    await WatchList.aggregate(
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
})







router.get('/movieCount', (req, res, next) => {
    MovieCount.find({ "Movie": sendItem })
        .then(response => res.send(response))
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
    let m = 0, mf = 1, item = '';
    GenreWise.find({ "Genre": req.body.Genre })
        .then(response => {
            mov = response[0].MoviesList
            console.log(mov)

            for (let i = 0; i < mov.length; i++) {
                for (let j = i; j < mov.length; j++) {
                    if (mov[i] == mov[j])
                        m++;
                    if (mf < m) {
                        mf = m;
                        item = mov[i];
                    }
                }
                m = 0;
            }
            console.log(`${item} ( ${mf} times ) `);

            GenreWiseCount.findOneAndUpdate({ "Genre": req.body.Genre },
                {
                    "Genre": req.body.Genre,
                    "Movie": item,
                    "count": mf
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
            cosnole.log(err))

})



// GenreWiseCount.findOneAndUpdate({"Genre": req.body.Genre})


// GenreWise.find({"Genre": req.body.Genre})
// .then(response => {
//     response[0].aggregate(
//         [
//           { $unwind : "$MoviesList" },
//           { $group : { _id : "$MoviesList" , count : { $sum : 1 } } },
//           { $sort : { count : -1 } },
//           { $limit : 1 }
//         ]
//       )
//       .then( result => {
//           GenreWiseCount.insertMany(
//             {
//                 "Genre":req.body.Genre,
//                 "Movie":result[0]._id,
//                 "count":result[0].count

//         }
//           )
//       }

//       )
// })





// router.post('/movieCount', (req, res, next) => {

//     MovieCount.find({ Movie: req.body.Movie })
//         .exec()
//         .then(response => {
//             if (response.length < 1) {
//                 const movieCount = new MovieCount({
//                     Movie: req.body.Movie,
//                     count: req.body.count
//                 })
//                 movieCount.save()
//                     .then(() => res.json())
//                     .catch((err) => err)
//             }
//             else {
//               MovieCount.update({Movie: req.body.Movie,Count: req.body.Count},{$set:{Movie:sendItem,Count:max}},(err => console.log(err)))
//             }
//         })
//         .catch(err => err)

//     })





//  router.post('/movieCount', (req, res, next) => {
// MovieCount.find({Movie: req.body.Movie})
//     .exec()
//     .then(response => {
//         if(response.length < 1) {
//             const movieCount =new MovieCount( {
//                 Movie: req.body.Movie,
//                 count: 1
//             })
//             movieCount.save()
//                     .then(() => res.json())
//                     .catch((err) => err)
//         }

//         else {
//             MovieCount.updateOne(
//                 {Movie: req.body.Movie},
//                 { $inc: { count: +1 } }
//              )
//         }
//     })

//  })



module.exports = router;