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

//routing
let userRouter = require("./public/routes/userRouter");
app.use("/user", userRouter);
let artRouter = require("./public/routes/artRouter");
app.use("/art", artRouter);
let workshopRouter = require("./public/routes/workshopRouter");
app.use("/workshop", workshopRouter);
let reviewRouter = require("./public/routes/reviewRouter");
app.use("/review", reviewRouter);


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
app.get('/', (req,res) => {
    //render the login page with the login pug
    res.redirect('/user/login');
    
} )


//CONNECT TO DATATBASE--------------------------------
mongoose.connect('mongodb://127.0.0.1/Artworld');

let db = mongoose.connection;
db.once('open', async function() {

	
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
});
