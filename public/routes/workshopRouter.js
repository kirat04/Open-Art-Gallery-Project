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

//VIEW WORKSHOPS----------------------------------
router.get('/viewWorkshops', async (req,res) => {
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
        else res.redirect('/user/homepage');

    }
else res.redirect("/user/login");
    } )

    //WORKSHOP page----------------------------
router.get('/workshops/:workshopID',(req,res) => {
    
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


else res.redirect('/user/login');
} 
)

//enroll workshop-------------------------
router.put('/workshops/:workshopID',(req,res) => {
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


else res.redirect('/user/login');
} 
)


//ADD WORKSHOP
router.post('/addWorkshop',(req,res) => {
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


else res.redirect('/user/login');
} 
)
module.exports = router;