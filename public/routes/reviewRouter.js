const express = require('express');
const { send } = require("process");
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

const User = require("../../UserModel");
const Art = require("../../ArtModel");
const Notifications = require("../../NotificationsModel");
const Workshop = require("../../WorkshopModel");
const Review = require("../../ReviewModel");

let router = express.Router();


//Like an Art-------------------
router.put('/like/art/:artID',(req,res) => {
    //check session
    if(req.session.userID){
        let id = req.params.artID;
        let name;
        //find the user in the session
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            //check if user already has liked the art, if they haven't make a new like, otherwise switch from unlike to like
            Review.findOne({"user":req.session.userID, "art":id})
            .then(async review =>{

                if(!review){
                    let rev = new Review;
                    rev.user = req.session.userID;
                    rev.art = id;
                    rev.liked = true;
                    rev.reviewText = null;
                    rev.save();
                }

                else{
                    if(review.liked)
                    review.liked = false;
                else
                review.liked = true;

               review.save();
               console.log("saved");
                }
                res.sendStatus(200);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Art Does Not Exist");
            });         
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
    }


else res.redirect('/user/login');
} 
)

//UNLIKE A ART
router.post('/unlike/:artID',(req,res) => {
    //check session
    if(req.session.userID){
        let id = req.params.artID;
        let name;
        //find the user in the session
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            // switch from like to unlike
            Review.findOne({"user":req.session.userID, "art":id})
            .then(async review =>{

                if(!review){
                    let rev = new Review;
                    rev.user = req.session.userID;
                    rev.art = id;
                    rev.liked = true;
                    rev.reviewText = null;
                    rev.save();
                }

                else{
                    if(review.liked)
                    review.liked = false;
                else
                review.liked = true;

               review.save();
               console.log("saved");
                }
                res.sendStatus(204);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Art Does Not Exist");
            });         
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
    }


else res.redirect('/user/login');
} 
)
//Review an Art-------------------
router.put('/review/art/:artID',(req,res) => {
        //check session
        if(req.session.userID){
            let id = req.params.artID;
            let name;
            //find teh user in the session
            User.findById(req.session.userID)
            .then( result =>{
                
                name = {name:result.name};
                //check if the user has already made a review on this art, if they have change the text, otherwise create a new one
                Review.findOne({"user":req.session.userID, "art":id})
                .then(async review =>{
                    console.log(review);
                    if(!review){
                        let rev = new Review;
                        rev.user = req.session.userID;
                        rev.art = id;
                        rev.liked = false;
                        rev.reviewText = req.body.text;
                        rev.save();
                    }
    
                    else{
                        
                    review.reviewText = req.body.text;
    
                   review.save();
                   console.log("saved");
                    }
                   
                    
                    res.sendStatus(200);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Art Does Not Exist");
                });         
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("No session found");
            });
        }
    
    
    else res.redirect('/user/login');
} 
)
//unreview art
router.post('/unreview/:artID',(req,res) => {
    //check session
    if(req.session.userID){
        let id = req.params.artID;
        let name;
        //find user in the session
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            //find the review on this art and clear review text data
            Review.findOne({"user":req.session.userID, "art":id})
            .then(async review =>{
                review.reviewText = "";
                review.save();
                res.sendStatus(204);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Art Does Not Exist");
            });         
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
    }


else res.redirect('/user/login');
} 
)
module.exports = router;