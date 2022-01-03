const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WatchList = require('../modals/watchList');

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


    

   
module.exports = router;