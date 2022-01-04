const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../models/watchList');

router.post('/Sign',(req,res,next)=> {
    User.find({UserName: req.body.UserName})
    .exec()
    .then(response => {
        if(response.length>=1) {
        return res.status(409).json({
            message: 'UserName exists'
        })
        }
        else {
            const user = new User( { 
                // _id: req.params.UserId,
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


    router.post('/Login', (req,res,next)=> {
        User.find({UserName: req.body.UserName})
        .exec()
        .then(response => {
            if(response.length < 1) {
                return res.status(401).json({
                    message: 'LogIn failed'
                })
            }
            else {
                if(response[0].Password.localeCompare(req.body.Password)===0)
                {
                   return res.json(response[0])
                }
                else {
                    return res.status(401).json({
                        message: 'LogIn failed'
                    })
                }
            }
        })
    })
   let name="Anil"
 router.post('/watchlist' , (req,res,next) => {
            WatchList.findOneAndUpdate ({UserName : req.body.UserName}, {$addToSet : { MovieList : req.body.Movie}},(error,data) => {
                if(error)
                {
                    return error
                }
                else {
                    console.log(data)
                    res.status(401).json({
                        message:'Added Succesfully'
                    })
                }
            }
            )
            // WatchList.find({ UserName : req.body.UserName} )
            // .exec()
            // .then(response => {
            //     if(response.length >= 1)
            //     {
            //         var myquery = {MovieList: req.body.MovieList}
            //         var newvalues =  {$addToSet : {
            //             MovieList : req.body.Movie,
            //            }};
            //         response[0].updateOne(myquery, newvalues, function(err, res) {
            //             if (err) throw err;
            //             console.log("1 document updated");
                        
            //     })
            // }  
            //     else {
            //         const watchList =new WatchList( {
            //             UserName : req.body.UserName,
            //             Movie : req.body.Movie,
            //             $addToSet : {
            //                 MovieList : req.body.Movie,
            //                }
            //             })
            //         watchList.save()
            //         .then(()=> res.json())
            //         .catch(err=> err)
            //     }
            
            // })
                 }
             )
             


   
module.exports = router;