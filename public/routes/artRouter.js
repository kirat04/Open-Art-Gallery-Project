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
//view artpage
router.get('/viewArt', async (req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let name;
        let artList = [];
        //find the user with the same session and render viewart page
 await User.findById(req.session.userID)
        .then(async result =>{
            
            if(result.upgrade)
            name = result.name;
        else
        name = "";

        //retrieve all information from each art piece in the user's collection
             for(let art in result.art){

                await  Art.findById(result.art[art])
                    .then(art =>{
                        artList.push(art);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send("User Is Not Artist");
                    });
            }

            
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
        
        loggedin = {name: name, artlist: artList};
        if(name !== "")
        res.render('viewArt', {user: loggedin});
        else res.redirect('/user/homepage');

    }
else res.redirect("/user/login");
    } )

    //Art Page--------------------------
router.get('/art/:artID',(req,res) => {
    //check session
    console.log("i tied");
     if(req.session.userID){
 
         let id = req.params.artID;
         let name;
         let liked;
         let reviews = [];
         let likecounter = 0;
         let reviewed;
         let artist = {name: null, url: null};
         //find the user with in the session and render the art page based on the provided art id
         User.findById(req.session.userID)
         .then( async owners =>{
             let owner = false;
             name = {name:owners.name};
            await Art.findById(req.params.artID)
             .then(async result =>{
                await User.findById(result.artist)
                 .then( async artmaker =>{
                     artist["name"] = artmaker.name;
                     artist["url"] = result.artist;
                 });
 
                 if(result.artist.toString() == req.session.userID.toString())
                 owner = true;
 
                 //check if the user reviewed or liked this art
               await  Review.find({"user":req.session.userID})
                 .then(async reviews =>{
                         let temp = [];
                         for(let i =0; i < reviews.length;i++){
                             temp.push(reviews[i].art.toString());
                             console.log(reviews[i].art.toString());
                         }
                        
                         console.log(result._id.toString());
                         if(temp.includes(result._id.toString()))                       
                             liked = reviews[temp.indexOf(result._id.toString())].liked;
                         else
                         liked = false;
                 })
                 //find all the reviews on this art
                 await Review.find({"art":id})
                 .then(async reviewdatas =>{
                         if(reviewdatas){
                             for(let i = 0; i<reviewdatas.length; i++){
                                 if(reviewdatas[i].liked)
                                 likecounter++;
                                 
                                 let reviewBundle = {user:null, text:null};
                                await User.findById(reviewdatas[i].user)
                                 .then(async use =>{
                                         reviewBundle.user = use.name;
                                 })
 
                                 reviewBundle.text = reviewdatas[i].reviewText;
                                 // console.log(reviewBundle);
                                 if(reviewBundle.text != null){
                                 reviews.push(reviewBundle);
                                 reviewed = true;
                                 }
                                 else
                                 reviewed = false;
                             }
                         }
 
                 })
   
                 if(owner)
                 res.render('ownart' ,{newart:result, user:name, liked:liked, reviews:reviews, likecounter:likecounter, reviewed:reviewed, artist:artist});
                 else
                 res.render('art' ,{newart:result, user:name, liked:liked, reviews:reviews, likecounter:likecounter, reviewed:reviewed, artist:artist});
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

 //ADD ART
router.post('/addArt',(req,res) => {
    //check session
    if(req.session.userID){
        let name;
        //find the user in the session
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            //find if there is an art with this title already, if not save new art
            Art.findOne({"title":req.body.title})
            .then(async art =>{
                if(!art)
                {
                    let newArt = new Art;
                    newArt.title = req.body.title;
                    newArt.artist = req.session.userID ;
                    newArt.year = req.body.year;
                    newArt.category = req.body.category;
                    newArt.medium = req.body.medium;
                    newArt.description = req.body.desc;
                    newArt.poster = req.body.poster;

                    newArt.save();
                    result.art.push(newArt._id);
                    result.save();

                    //send a notification to all users that are following this user
                  await  User.find({"following": req.session.userID})
                        .then(async followers =>{
                            console.log(followers);

                            for(let i = 0; i<followers.length;i++)
                            {
                                let notif = new Notifications;
                                notif. user = followers[i];
                                notif.artist = req.session.userID;
                                notif.addedArt = newArt._id;
                                notif.save();
                            }
                            
                        })
                    res.sendStatus(200);
                }
                else
                res.sendStatus(400);
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