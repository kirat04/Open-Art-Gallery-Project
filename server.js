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
    console.log(req.body.user);

    User.findOne({name: req.body.user})
        .then(result =>{
            if (!result) {
				console.log("User name " + result + " does not exist.");
				return;
			}
            
            console.log("Result:");
			console.log(result.password);
            if(req.body.pass == result.password){
                req.session.userID = result._id;
            console.log(req.session.userID);
            req.session.save();
            }
        })
    res.redirect('/homepage');

} )

//USER LOGOUT----------------------------------
app.get('/logout',(req,res) => {
    //render the login page with the login pug
    req.session.destroy(function(){
        console.log("user logged out.")
     });
     res.redirect('/login');
} )
//USER HOMEPAGE------------------------------------

app.get('/homepage',(req,res) => {
    if(req.session.userID){
        let loggedin;
        let liked= [];
let reviewed= [];

User.findById(req.session.userID)
        .then(async result =>{
           await Review.find({"user":result._id})
            .then(async reviews =>{
                console.log(reviews);

                for(let i = 0 ; i<reviews.length;i++){
                    
                  await  Art.findById(reviews[i].art)
                    .then(art =>{
                        reviewBundle = {artname:art.title,reviewArt:reviews[i]};
                        reviewed.push(reviewBundle);

                    })
                }
                
            })

            console.log(reviewed);
            loggedin = {name: result.name};
            if(result.upgrade)
            res.render('artistHomepage', {user: loggedin});
        else
        res.render('homepage', {user: loggedin,reviews:reviewed});
            
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

    User.find({ "name" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

app.post('/homepage/search/art',(req,res) => {
    console.log(req.body.maxYear);


    Art.find({ "title" : { $regex: new RegExp("^"+req.body.search+".*$"), $options: 'i' } })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })
   
} )

app.get('/homepage/search/art',(req,res) => {
    console.log(req.query.search);
    console.log(req.query.category);

    let category;
    let medium;

    if(req.query.category == "all")
    category = "";
else
category = req.query.category;

if(req.query.medium == "all")
medium = "";
else
medium = req.query.medium;

    Art.find({ "title" : { $regex: new RegExp("^"+req.query.search+".*$"), $options: 'i' } ,
     "year": {$lte: req.query.maxYear, $gte:req.query.minYear},
     "category":{ $regex: new RegExp("^"+category+".*$"), $options: 'i' },
     "medium":{ $regex: new RegExp("^"+medium+".*$"), $options: 'i' }
    })
    .then(result =>{
        res.status(200).send(JSON.stringify(result));
        
    })

} )

app.get('/homepage/filters',async (req,res) => {
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
    if(req.session.userID){
        let loggedin;
        let name;
        let followerList = [];
 await User.findById(req.session.userID)
 .then(async result =>{
            
            name = result.name;
            console.log(result.following);
             for(let follower in result.following){
                // console.log(result.art[follower]);
                await  User.findById(result.following[follower])
                    .then(follower =>{
                        console.log(follower);
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
        if(req.session.userID){
            let loggedin;
            let name;
            let notificationsArt = [];
            let notificationsWorkshops = [];
            await User.findById(req.session.userID)
            .then(async result =>{
                name = result.name;
            })
     await Notifications.findOne({"user":req.session.userID})
     .then(async result =>{
                
                if(result){
                for(let i = 0; i< result.addedArt.length;i++){
                    let newArtBundle = {"artist":null, "art":null};
                   await User.findById(result.addedArtArtist[i])
                        .then(async artist =>{
                            // console.log(result);
                            newArtBundle["artist"] = artist;
                            // console.log(newArtBundle);
                          await  Art.findById(result.addedArt[i])
                            .then(async art =>{
                                newArtBundle["art"] = art;
                            })
                        })

                        notificationsArt.push(newArtBundle);
                        
                }

                for(let i = 0; i< result.addedWorkshop.length;i++){
                    let newWorkshopBundle = {"artist":null, "workshop":null};
                   await User.findById(result.addedWorkshopArtist[i])
                        .then(async artist =>{
                            // console.log(result);
                            newWorkshopBundle["artist"] = artist;
                            // console.log(newArtBundle);
                          await  Workshop.findById(result.addedWorkshop[i])
                            .then(async workshop =>{
                                console.log(workshop);
                                newWorkshopBundle["workshop"] = workshop;
                            })
                        })

                        notificationsWorkshops.push(newWorkshopBundle);
                        
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
            if(req.session.userID){
                Notifications.deleteOne({"user":req.session.userID}).then( result =>{
                    res.sendStatus(200);
                })
                   
        
            }
        else res.redirect("/login");
            } )
//USER SETTINGS-------------------------------------wip
app.get('/userSettings', async (req,res) => {
    if(req.session.userID){
        let loggedin;
        let name;
        let followerList = [];
        let hasArt = false;
 await User.findById(req.session.userID)
 .then(async result =>{
            
                loggedin = result;

            if(result.art.length == 0)
            hasArt = true;
        else
        hasArt = false;
        })
        .catch(err => {
			console.log(err);
			res.status(500).send("No session found");
		});

        res.render('userSettings', {user: loggedin, hasArt:hasArt});

    }
else res.redirect("/login");
    } )

    app.put('/upgrade', async (req,res)=>{
        if(req.session.userID){
            let name;
            console.log(req.body);
            if(req.body.upgrade){
            console.log("upgrade");
            await User.findById(req.session.userID)
            .then(async result =>{
                console.log(req.body);
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


     
        }

        

        
    })
//VIEW ART-------------------------------------wip
app.get('/viewArt', async (req,res) => {
    if(req.session.userID){
        let loggedin;
        let name;
        let artList = [];
 await User.findById(req.session.userID)
        .then(async result =>{
            
            if(result.upgrade)
            name = result.name;
        else
        name = "";

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
        
        // console.log(artList);
        loggedin = {name: name, artlist: artList};
        if(name !== "")
        res.render('viewArt', {user: loggedin});
        else res.redirect('/homepage');

    }
else res.redirect("/login");
    } )

//VIEW WORKSHOPS----------------------------------
app.get('/viewWorkshops', async (req,res) => {
    if(req.session.userID){
        let loggedin;
        let name;
        let workshopList = [];
 await User.findById(req.session.userID)
        .then(async result =>{
            
            if(result.upgrade)
            name = result.name;
        else
        name = "";

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
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.userID;
    console.log(id);
    let artList = [];
    let workshops =[];
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            User.findById(id)
            .then(async result =>{
                if(result.upgrade){
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
                res.render('user' ,{newuser:newuserbundle, user:name});
            }
                else
                res.status(500).send("User Is Not Artist");


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

}
else res.redirect('/login');
} 
)
//FOLLOW 
app.put('/user/:userID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.userID;
    console.log(id);
    let artList = [];
    if(req.session.userID){
        let name;
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

}
else res.redirect('/login');
} 
)
//Art Page--------------------------
app.get('/art/:artID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.artID;
    // console.log(id);
    if(req.session.userID){
        let name;
        let liked;
        let reviews = [];
        let likecounter = 0;
        let reviewed;
        User.findById(req.session.userID)
        .then( async owners =>{
            let owner = false;
            name = {name:owners.name};
           await Art.findById(req.params.artID)
            .then(async result =>{
                console.log(result.artist);
                console.log(owners._id.toString());
                if(result.artist.toString() == req.session.userID.toString())
                owner = true;

                
              await  Review.findOne({"user":req.session.userID})
                .then(async review =>{
                    
                        if(review){
                            liked = review.liked;
                        }
                        else
                        liked = false;
                })

                await Review.find({"art":id})
                .then(async reviewdatas =>{
                        if(reviewdatas){
                            for(let i = 0; i<reviewdatas.length; i++){
                                if(reviewdatas[i].liked)
                                likecounter++;
                                
                                let reviewBundle = {user:null, text:null};
                                console.log(reviewdatas[i].user)
                               await User.findById(reviewdatas[i].user)
                                .then(async use =>{
                                        reviewBundle.user = use.name;
                                })

                                reviewBundle.text = reviewdatas[i].reviewText;
                                console.log(reviewBundle);
                                if(reviewBundle.text != null){
                                reviews.push(reviewBundle);
                                reviewed = true;
                                }
                                else
                                reviewed = false;
                            }
                        }

                })
                console.log(owner);
                if(owner)
                res.render('ownart' ,{newart:result, user:name, liked:liked, reviews:reviews, likecounter:likecounter, reviewed:reviewed});
                else
                res.render('art' ,{newart:result, user:name, liked:liked, reviews:reviews, likecounter:likecounter, reviewed:reviewed});
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

}
else res.redirect('/login');
} 
)

//WORKSHOP page----------------------------
app.get('/workshops/:workshopID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.workshopID;
    console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( use =>{
            
            name = {name:use.name};
            Workshop.findById(id)
            .then(result =>{
                let enrolled = false;

                if(result.enrolled.includes(use._id))
                enrolled = true;
                res.render('workshop', {workshop:result, user:name, enrolled:enrolled});
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

}
else res.redirect('/login');
} 
)

//enroll workshop-------------------------
app.put('/workshops/:workshopID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.workshopID;
    console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( use =>{
            
            name = {name:use.name};
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

}
else res.redirect('/login');
} 
)
//ADD ART
app.post('/addArt',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    // let id = req.params.workshopID;
    // console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
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

                    
                  await  User.find({"following": req.session.userID})
                        .then(async followers =>{
                            console.log(followers);

                            for(let i = 0; i<followers.length;i++)
                         await Notifications.findOne({"user":followers[i]})
                                .then(notified =>{
                                    if(notified){
                                        console.log(notified);
                                    notified.addedArtArtist.push(req.session.userID);
                                    notified.addedArt.push(newArt);
                                    notified.save();
                                    }
                                    else{
                                        let newNotif = new Notifications;
                                        newNotif.user = followers[i];
                                        newNotif.addedArtArtist.push(req.session.userID);
                                        newNotif.addedArt.push(newArt);
                                        newNotif.save();
                                    }
                                })
                            
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

}
else res.redirect('/login');
} 
)

//ADD WORKSHOP
app.post('/addWorkshop',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.workshopID;
    console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            Workshop.findOne({"title":req.body.title})
            .then(async workshop =>{
                if(!workshop)
                {
                    let newWorkshop = new Workshop;
                    newWorkshop.title = req.body.title;
                    newWorkshop.artist = req.session.userID ;
                    newWorkshop.description = req.body.desc;
                    newWorkshop.enrolled = [];

                    newWorkshop.save();
                    result.workshops.push(newWorkshop._id);
                    result.save();
                    res.sendStatus(200);

                    await  User.find({"following": req.session.userID})
                        .then(async followers =>{
                            console.log(followers);

                            for(let i = 0; i<followers.length;i++)
                         await Notifications.findOne({"user":followers[i]})
                                .then(notified =>{
                                    if(notified){
                                        console.log(notified);
                                    notified.addedWorkshopArtist.push(req.session.userID);
                                    notified.addedWorkshop.push(newWorkshop);
                                    notified.save();
                                    }
                                    else{
                                        let newNotif = new Notifications;
                                        newNotif.user = followers[i];
                                        newNotif.addedWorkshopArtist.push(req.session.userID);
                                        newNotif.addedWorkshop.push(newWorkshop);
                                        newNotif.save();
                                    }
                                })
                            
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

}
else res.redirect('/login');
} 
)

//Like an Art-------------------
app.put('/like/:artID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.artID;
    console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            Review.find({"user":req.session.userID})
            .then(async review =>{
                console.log();
                if(review.length == 0){
                    let rev = new Review;
                    rev.user = req.session.userID;
                    rev.art = id;
                    rev.liked = true;
                    rev.reviewText = null;
                    rev.save();

                }
                else{
                    let reviewedID = [];
                    for(let i = 0; i<review.length;i++){
                        reviewedID.push(review[i]._id.toString());
                    }
                    console.log(reviewedID);
                    for(let i = 0; i<review.length;i++){
                       await Review.findOne({"art":id})
                        .then(art =>{
                            console.log(reviewedID.includes(art._id.toString()));

                            if(reviewedID.includes(art._id.toString())){
                                if(review[i].liked)
                                review[i].liked = false;
                                else
                                review[i].liked = true;
                                review[i].save();
                                console.log("saved");
                            }
                            else
                            {
                                let rev = new Review;
                                rev.user = req.session.userID;
                                rev.art = id;
                                rev.liked = true;
                                rev.reviewText = null;
                                rev.save();
                                console.log("kill me");
                            }
                        })
                    }

               
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

}
else res.redirect('/login');
} 
)
//Review an Art-------------------
app.put('/review/:artID',(req,res) => {
    if(req.session.userID){
    User.findById(req.session.userID)
    let id = req.params.artID;
    console.log(id);
    if(req.session.userID){
        let name;
        User.findById(req.session.userID)
        .then( result =>{
            
            name = {name:result.name};
            Review.findOne({"user":req.session.userID})
            .then(review =>{
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
