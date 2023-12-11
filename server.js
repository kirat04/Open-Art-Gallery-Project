const fs = require("fs");

const express = require('express');
const { send } = require("process");
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1/Artworld',
    collection: 'mySessions'
  });

const User = require("./UserModel");
const Art = require("./ArtModel");
const Notifications = require("./NotificationsModel");
const Workshop = require("./WorkshopModel");
const Review = require("./ReviewModel");

let app = express();

//SETUP PUG
app.set('view engine', 'pug');
app.set('views', './public/views/pages');
//SERVE STATIC FILES FROM DIR PUBLIC AND SETUP BODY PARSER
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: "secret",
                store: store}));

//read stylesheet and send it back
app.get('/styles.css', (req,res) => {
    fs.readFile("./public/styles.css", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).setHeader("Content-Type", "text/css").send(data);
    });

})
//get login javascript and send it back
app.get('/login.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/login.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get new user javascript and send it back
app.get('/newUser.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/newUser.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get new homepage javascript and send it back
 app.get('/homepage.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/homepage.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get settings javascript and send it back
 app.get('/settings.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/settings.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get user page js and send it back
 app.get('/userPage.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/userPage.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

  //get view art js and send it back
  app.get('/viewArt.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/viewArt.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get view notif javascript and send it back
app.get('/viewNotifs.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/viewNotifs.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

  //get review javascript and send it back
app.get('/review.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/review.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )

 //get workshop javascript and send it back
app.get('/workshop.js', (req,res) => {
    // read the vendordata.js file and send it back
    fs.readFile("./public/js/workshop.js", function(err, data){
        if(err){
          res.status(404).send();
          return;
        }
        res.status(200).send(data);
    });
 } )
 //USER CREATION PAGE-------------------------------------
app.get('/newUser', (req,res) => {
    //render the new user page with the newUser pug
    res.render('newUser');

})
app.post('/user',(req,res) => {
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
            res.redirect('/login');
        }
        
        else{
            res.sendStatus(400);
        }
    })

} )

//LOGIN PAGE-------------------------------------------------
app.get('/', (req,res) => {
    //render the login page with the login pug
    res.redirect('/login');
    
} )

app.get('/login',(req,res) => {
    //render the login page with the login pug
    res.render('login');
    
} )
app.post('/login',(req,res) => {
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
            res.redirect('/homepage');
            }
            
        })
   

} )

//USER LOGOUT----------------------------------
app.get('/logout',(req,res) => {
    //destroy the session to logout
    req.session.destroy(function(){
        console.log("user logged out.")
     });
     res.redirect('/login');
} )
//USER HOMEPAGE------------------------------------

app.get('/homepage',(req,res) => {
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
else res.redirect("/login");
} )

app.post('/homepage/search/artists',(req,res) => {
    console.log(req.body.search);
    //search for artists by name using regex and send the result
    User.find({ "name" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

app.post('/homepage/search/art',(req,res) => {
    console.log(req.body.maxYear);

    //search for art by just art title
    Art.find({ "title" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

app.get('/homepage/search/art',async (req,res) => {
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

app.get('/homepage/filters',async (req,res) => {
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
app.get('/artistFollowers', async (req,res) => {
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
else res.redirect("/login");
    } )
// USER NOTIFICATIONS----------------------------------wip
    app.get('/notif', async (req,res) => {
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
    else res.redirect("/login");
        } )

        app.put('/notif', async (req,res) => {
            //delete all notifications of the user in the session
            if(req.session.userID){
                Notifications.deleteMany({"user":req.session.userID}).then( result =>{
                    res.sendStatus(200);
                })
                   
        
            }
        else res.redirect("/login");
            } )
//USER SETTINGS-------------------------------------wip
app.get('/userSettings', async (req,res) => {
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
else res.redirect("/login");
    } )

    app.put('/upgrade', async (req,res)=>{
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
//VIEW ART-------------------------------------wip
app.get('/viewArt', async (req,res) => {
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
        else res.redirect('/homepage');

    }
else res.redirect("/login");
    } )

//VIEW WORKSHOPS----------------------------------
app.get('/viewWorkshops', async (req,res) => {
    //check session
    if(req.session.userID){
        let loggedin;
        let name;
        let workshopList = [];
        //find user with the same session and render view workshop page
 await User.findById(req.session.userID)
        .then(async result =>{
            
            if(result.upgrade)
            name = result.name;
        else
        name = "";
            //retrieve each workshop in the user's collection
             for(let workshop in result.workshops){

                await  Workshop.findById(result.workshops[workshop])
                    .then(workshop =>{
                        workshopList.push(workshop);
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
        
        console.log(workshopList);
        loggedin = {name: name, workshopList: workshopList};
        if(name !== "")
        res.render('viewWorkshops', {user: loggedin});
        else res.redirect('/homepage');

    }
else res.redirect("/login");
    } )

//User Page-----------------------
app.get('/user/:userID',(req,res) => {
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


else res.redirect('/login');
} 
)
//FOLLOW 
app.put('/user/:userID',(req,res) => {
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
//Art Page--------------------------
app.get('/art/:artID',(req,res) => {
   //check session
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


else res.redirect('/login');
} 
)

//WORKSHOP page----------------------------
app.get('/workshops/:workshopID',(req,res) => {
    
    //check session
    if(req.session.userID){
        
        let id = req.params.workshopID;
        let name;
        let owner = false;
        let enrolledUsers = [];
        //find the user in the session
        User.findById(req.session.userID)
        .then( use =>{
            
            name = {name:use.name};
            //check if user is enrolled and add all enrolled users to array to render the page with
            Workshop.findById(id)
            .then( async result =>{
                let enrolled = false;
                if(use._id.toString() == result.user.toString())
                owner = true;
                if(result.enrolled.includes(use._id))
                enrolled = true;
                ///get all enrolled user's name and url to display
                for(let i = 0; i<result.enrolled.length;i++){
                    
                   await User.findById(result.enrolled[i])
                        .then(enrolleduser =>{
                        
                            let bundle = {name: enrolleduser.name, url:enrolleduser._id};
                            enrolledUsers.push(bundle);
                        })
                }
                console.log(enrolledUsers);
                res.render('workshop', {workshop:result, user:name, enrolled:enrolled, owner:owner, enrolledusers:enrolledUsers});

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


else res.redirect('/login');
} 
)

//enroll workshop-------------------------
app.put('/workshops/:workshopID',(req,res) => {
   //check session
    if(req.session.userID){
        
        let id = req.params.workshopID;
        let name;
        //find the user in the session
        User.findById(req.session.userID)
        .then( use =>{
            
            name = {name:use.name};
            //find the workshop with the id and either unenrolled or enroll to the workshop
            Workshop.findById(id)
            .then(result =>{
                console.log(result.enrolled.includes(use._id));
                if(result.enrolled.includes(use._id))
                result.enrolled.splice(result.enrolled.indexOf(use._id),1);
                else
                result.enrolled.push(use._id);

                result.save();
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


else res.redirect('/login');
} 
)
//ADD ART
app.post('/addArt',(req,res) => {
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


else res.redirect('/login');
} 
)

//ADD WORKSHOP
app.post('/addWorkshop',(req,res) => {
    //check session
    if(req.session.userID){
        let id = req.params.workshopID;
        let name;
        //find user in the session
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            //find a workshop with the same title, if found don't save the workshop and send 400 code
            Workshop.findOne({"title":req.body.title})
            .then(async workshop =>{
                if(!workshop)
                {
                    let newWorkshop = new Workshop;
                    newWorkshop.title = req.body.title;
                    newWorkshop.user = req.session.userID ;
                    newWorkshop.description = req.body.desc;
                    newWorkshop.enrolled = [];

                    newWorkshop.save();
                    result.workshops.push(newWorkshop._id);
                    result.save();
                    res.sendStatus(200);
                    //send a notification to all users that are following this user
                    await  User.find({"following": req.session.userID})
                        .then(async followers =>{
                            console.log(followers);

                            for(let i = 0; i<followers.length;i++)
                            {
                                let notif = new Notifications;
                                notif. user = followers[i];
                                notif.artist = req.session.userID;
                                notif.addedWorkshop = newWorkshop._id;
                                notif.save();
                            }
                            
                            
                        })
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


else res.redirect('/login');
} 
)

//Like an Art-------------------
app.put('/like/:artID',(req,res) => {
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


else res.redirect('/login');
} 
)

//UNLIKE A ART
app.post('/unlike/:artID',(req,res) => {
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


else res.redirect('/login');
} 
)
//Review an Art-------------------
app.put('/review/:artID',(req,res) => {
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
    
    
    else res.redirect('/login');
} 
)
//unreview art
app.post('/unreview/:artID',(req,res) => {
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


else res.redirect('/login');
} 
)
//CONNECT TO DATATBASE--------------------------------
mongoose.connect('mongodb://127.0.0.1/Artworld');

let db = mongoose.connection;
db.once('open', async function() {

	
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
});
