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

//USER CREATION PAGE-------------------------------------
router.get('/newUser', (req,res) => {
    //render the new user page with the newUser pug
    res.render('newUser');

})
router.post('/user',(req,res) => {
    //create a user with the provided credentials if the name is unique
    console.log(req.body);
    User.findOne({name: req.body.user})
    .then(result =>{
        if (!result) {
            user = new User;
            user.name = req.body.user;
            user.upgrade = false;
            user.art = [];
            user.password = req.body.pass;
            user.save();
            res.redirect('/user/login');
        }
        
        else{
            res.sendStatus(400);
        }
    })

} )

//user/login PAGE-------------------------------------------------
router.get('/', (req,res) => {
    //render the login page with the login pug
    res.redirect('/user/login');
    
} )

router.get('/login',(req,res) => {
    //render the login page with the login pug
    res.render('login');
    
} )
router.post('/login',(req,res) => {
    //find a user with the same name
    User.findOne({name: req.body.user})
        .then(result =>{
            //if theres no one with the same username send 400
            if (!result) {
				console.log("User name " + result + " does not exist.");
				res.sendStatus(400);
                return;
			}
            
            console.log("Result:");
			console.log(result.password);
            //if a username is found, check password, if it matches create a session
            if(req.body.pass == result.password){
                req.session.userID = result._id;
            console.log(req.session.userID);
            req.session.save();
            res.redirect('/user/homepage');
            }
            
        })
   

} )

//USER LOGOUT----------------------------------
router.get('/logout',(req,res) => {
    //destroy the session to logout
    req.session.destroy(function(){
        console.log("user logged out.")
     });
     res.redirect('/user/login');
} )

//USER HOMEPAGE------------------------------------

router.get('/homepage',(req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let viewnotif = {"value":false};
        //find the user that in current session and retrieve notification status
User.findById(req.session.userID)
        .then(async result =>{
            
            //if a notification that has not been found, set viewnotif to true and render using this information
           await Notifications.findOne({"user":result._id,"viewed":"false"})
                .then(notif =>{
                    if(notif)
                    viewnotif.value = true;
                else
                viewnotif.value = false;

                console.log(viewnotif.value);
                })
            
            loggedin = {name: result.name};
            if(result.upgrade)
            res.render('artistHomepage', {user: loggedin,newNotif:viewnotif});
        else
        res.render('homepage', {user: loggedin,newNotif:viewnotif});
            
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});

    }
else res.redirect("/user/login");
} )

router.post('/homepage/search/artists',(req,res) => {
    console.log(req.body.search);
    //search for artists by name using regex and send the result
    User.find({ "name" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

router.post('/homepage/search/art',(req,res) => {
    console.log(req.body.maxYear);

    //search for art by just art title
    Art.find({ "title" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

router.get('/homepage/search/art',async (req,res) => {
    console.log(req.query.search);
    console.log(req.query.category);
    //use multiple filters to filter the art before sending results
    let category;
    let medium;
//if category and/or medium are "all" set them to blank so regex can work properly
    if(req.query.category == "all")
    category = "";
else
category = req.query.category;

if(req.query.medium == "all")
medium = "";
else
medium = req.query.medium;

//create an array to store all images that are returned for search with artist (since it doesn't return a single array)
let array = [];
    if(req.query.artist && req.query.artist != "")
    User.find({ "name" : { $regex: new RegExp("^"+req.query.artist+".*$"), $options: 'i' } })
        .then(async artists =>{
            
            for(let i = 0; i< artists.length;i++){
              await  Art.find({ "title" : { $regex: new RegExp("^"+req.query.search+".*$"), $options: 'i' } ,
                "year": {$lte: req.query.maxYear, $gte:req.query.minYear},
                "category":{ $regex: new RegExp("^"+category+".*$"), $options: 'i' },
                "medium":{ $regex: new RegExp("^"+medium+".*$"), $options: 'i' },
                "artist":artists[i]._id
               })
               .then(result =>{
                   
                    for(let j = 0; j<result.length;j++){
                        array.push(result[j]);
                    }
                    
                   
                   
               })
            }
            console.log(array);
            res.status(200).send(JSON.stringify(array));
        })
        //if there is no artist in the filter, search without it and array is not needed because the function returns one
    else
    Art.find({ "title" : { $regex: new RegExp("^"+req.query.search+".*$"), $options: 'i' } ,
            "year": {$lte: req.query.maxYear, $gte:req.query.minYear},
            "category":{ $regex: new RegExp("^"+category+".*$"), $options: 'i' },
            "medium":{ $regex: new RegExp("^"+medium+".*$"), $options: 'i' },
            
           })
           .then(result =>{
               res.status(200).send(JSON.stringify(result));
               
           })


} )

router.get('/homepage/filters',async (req,res) => {
    //retrieve the maximum year and all categories and mediums so filters stay updated in the homepage
let filterBundle = {"maxYear": null, "categories":null, "mediums":null};
   await Art.distinct("year")
        .then( async result =>{
            
            filterBundle["maxYear"] = Math.max.apply(null,result);
            await Art.distinct("category")
            .then( async result =>{
                filterBundle["categories"] = result;
              await Art.distinct("medium")
                .then( async result =>{
                    filterBundle["mediums"] = result;
                    
                })
            })
        })

        res.send(JSON.stringify(filterBundle));
   
} )
//USER FOLLOWERS------------------------------------
router.get('/artistFollowers', async (req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let name;
        let followerList = [];
        
    //find the user with the session and render artist follower page with follower list
 await User.findById(req.session.userID)
 .then(async result =>{
            
            name = result.name;
            
             for(let follower in result.following){
               
                await  User.findById(result.following[follower])
                    .then(follower =>{
                       
                        followerList.push(follower);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send("Server Error");
                    });
            }

            
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
        
        console.log(followerList);
        loggedin = {name: name, followerlist: followerList};
        res.render('artistFollowers', {user: loggedin});

    }
else res.redirect("/user/login");
    } )

//USER SETTINGS-------------------------------------wip
router.get('/userSettings', async (req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let hadArt = false;

        //find the user using session
 await User.findById(req.session.userID)
 .then(async result =>{
    let reviewed = [];
    let artlist;
    
//find if user has art, retrieve artlist, retrieve reviews and render with this information
    await Art.find({"artist": req.session.userID})
    .then( hasArt =>{
        artlist = hasArt;
        if(hasArt.length != 0)
        hadArt = true;
    else
    hadArt = false;
    })
    await Review.find({"user":result._id})
     .then(async reviews =>{
         console.log(reviews);

         for(let i = 0 ; i<reviews.length;i++){
             
           await  Art.findById(reviews[i].art)
             .then(art =>{
                 let reviewBundle = {artname:art.title,reviewArt:reviews[i]};
                 reviewed.push(reviewBundle);

             })
         }
         
     })

     console.log(artlist);
     loggedin = {name: result.name, upgrade: result.upgrade};

 res.render('userSettings', {user: loggedin,reviews:reviewed, hasArt:hadArt, artlist:artlist});
     
 })
 .catch(err => {
     console.log(err);
     res.status(500).send("No session found");
 });
    }
else res.redirect("/user/login");
    } )

    router.put('/upgrade', async (req,res)=>{
        //check if upgrading, if is check if theres an art that has come with it and add, if not change upgrade
            if(req.body.upgrade){
            await User.findById(req.session.userID)
            .then(async result =>{

                //depending on if user also sent art data to upgrade, add art and change upgrade
                
                if(req.body.newArt){
          await  Art.findOne({"title":req.body.newArt.title})
            .then(async art =>{
                if(!art)
                {   
                    let newArt = new Art;
                    newArt.title = req.body.newArt.title;
                    newArt.artist = req.session.userID ;
                    newArt.year = req.body.newArt.year;
                    newArt.category = req.body.newArt.category;
                    newArt.medium = req.body.newArt.medium;
                    newArt.description = req.body.newArt.desc;
                    newArt.poster = req.body.newArt.poster;

                    newArt.save();
                    result.art.push(newArt._id);
                    result.save();

                    await User.findOneAndUpdate({"_id":req.session.userID},{"upgrade": req.body.upgrade})
        .then(async result =>{
            res.sendStatus(200);
        });

                }
                else
                res.sendStatus(400);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Art Does Not Exist");
            });  
        }
        else
        await User.findOneAndUpdate({"_id":req.session.userID},{"upgrade": req.body.upgrade})
        .then(async result =>{
            res.sendStatus(200);
        });
        });
    }
    
            if(!req.body.upgrade){
            console.log("downgrade");
        
        await User.findOneAndUpdate({"_id":req.session.userID},{"upgrade": req.body.upgrade})
        .then(async result =>{
            res.sendStatus(200);
        });
    }
        
    })

    //FOLLOW 
router.put('/user/:userID',(req,res) => {
    //check session
    if(req.session.userID){

        let id = req.params.userID;
        console.log(id);
        let artList = [];
        let name;
        //find user with in the session and make them a follower or unfollow the user with the id
        User.findById(req.session.userID)
        .then( result =>{

            if(result.following.includes(id))
            result.following.splice(result.following.indexOf(id),1);
            else
            result.following.push(id);

            result.save();
            
            res.sendStatus(200);
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});
        
    }


else res.redirect('/login');
} 
)

//User Page-----------------------
router.get('/user/:userID',(req,res) => {
    //check session
    if(req.session.userID){
        let id = req.params.userID;
        // console.log(id);
        let artList = [];
        let workshops =[];
        let name;
        let follows = false;
        //find the user with the same session, then find the user with the id and render their page
        User.findById(req.session.userID)
        .then( result =>{
            console.log(result.following);
            console.log(id);
            //check if the user is following or not to display "unfollow" or "follow" button
            for(let i = 0; i<result.following.length;i++){
                if(result.following[i].toString() == id.toString())
                    follows = true;
            }
            name = {name:result.name};
            //find all the art and all the workshops in the artist's collection and render using this data
            User.findById(id)
            .then(async result =>{
                
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
                for(let workshop in result.workshops){

                    await  Workshop.findById(result.workshops[workshop])
                        .then(workshop =>{
                            workshops.push(workshop);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send("User Is Not Artist");
                        });
                }
                let newuserbundle = {user: result, art:artList, workshops:workshops};
                console.log(follows);
                res.render('user' ,{newuser:newuserbundle, user:name, follows:follows});
            



            })
            .catch(err => {
                console.log(err);
                res.status(500).send("User Does Not Exist");
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

// USER NOTIFICATIONS----------------------------------wip
router.get('/notif', async (req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let name;
        let notificationsArt = [];
        let notificationsWorkshops = [];

        //find the user in the session
        await User.findById(req.session.userID)
        .then(async result =>{
            name = result.name;
        })
        //find the notifications associated with user
 await Notifications.find({"user":req.session.userID})
 .then(async result =>{
            //if there are notifs, continue otherwise render the nonotif page
            if(result.length != 0){
            for(let i = 0; i< result.length;i++){
                let newArtBundle = {"artist":null, "art":null, "viewed":false};
                //sort the notifications by added art and added workshop and put into different arrays then render the page
                if(result[i].addedArt){
               await User.findById(result[i].artist)
                    .then(async artist =>{
                        ;
                        newArtBundle["artist"] = artist;
                    
                      await  Art.findById(result[i].addedArt)
                        .then(async art =>{
                            newArtBundle["art"] = art;
                        })
                    })
                    newArtBundle["viewed"] = result[i].viewed;
                    notificationsArt.push(newArtBundle);
                    result[i].viewed = true;
                    result[i].save();
                }
            }

            for(let i = 0; i< result.length;i++){
                let newWorkshopBundle = {"artist":null, "workshop":null, "viewed":false};
                if(result[i].addedWorkshop){
               await User.findById(result[i].artist)
                    .then(async artist =>{
                        // console.log(result);
                        newWorkshopBundle["artist"] = artist;
                        // console.log(newArtBundle);
                      await  Workshop.findById(result[i].addedWorkshop)
                        .then(async workshop =>{
                            // console.log(workshop);
                            newWorkshopBundle["workshop"] = workshop;
                        })
                    })
                    newWorkshopBundle["viewed"] = result[i].viewed;
                    notificationsWorkshops.push(newWorkshopBundle);
                    result[i].viewed = true;
                    result[i].save();
                }
            }

            
            loggedin = {name: name};
            res.render('userNotif', {user:loggedin,userArtNotif: notificationsArt, userWorkshopNotif: notificationsWorkshops});
        
        }
        else{
            loggedin = {name: name};
        res.render('noNotifs', {user: loggedin});
        
        }

        })
        .catch(err => {
            console.log(err);
            res.status(500).send("No session found");
        });

    }
else res.redirect("/user/login");
    } )

    router.put('/notif', async (req,res) => {
        //delete all notifications of the user in the session
        if(req.session.userID){
            Notifications.deleteMany({"user":req.session.userID}).then( result =>{
                res.sendStatus(200);
            })
               
    
        }
    else res.redirect("/user/login");
        } )

module.exports = router;