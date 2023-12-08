const mongoose = require("mongoose");
const Art = require("./ArtModel");
const User = require("./UserModel");

const fs = require("fs");

let artistList = [];
let artList = [];
let userartlist = [];
//read the gallery json file and add it to the arrays storing artists and art
fs.readFile("./gallery.json", function(err, data){
    if (err) throw err;

   let gallery = JSON.parse(data);
    let start = true;
    let user;
    let check = null;
    let add = true;
   
   for(let art in gallery){
    if(start || gallery[art].Artist !== check){
    user = new User;
    user.name = gallery[art].Artist;
    user.upgrade = true;
    user.art = [];
    user.password = "a";
    user.following = [];

    check = gallery[art].Artist;
    add = true;
    start = false;
    }

    let newArt = new Art;
    newArt.title = gallery[art].Title;
    newArt.artist = user._id ;
    newArt.year = gallery[art].Year;
    newArt.category = gallery[art].Category;
    newArt.medium = gallery[art].Medium;
    newArt.description = gallery[art].Description;
    newArt.poster = gallery[art].Poster;

    user.art.push(newArt._id);
    
    if(add){
        add = false;
        console.log(user);
        
    artistList.push(user);
    }
    artList.push(newArt);
   }
});

//conecct to mongoose databse and add items from the arrays
mongoose.connect('mongodb://127.0.0.1/Artworld');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

	await mongoose.connection.dropDatabase()
	console.log("Dropped database. Starting re-creation.");

	let completedart = 0;
	artList.forEach(art => {
		art.save()
			.then(result => {
				completedart++;
				if (completedart >= artList.length) {
					console.log("All art saved.");
				}
			})
			.catch(err => {
				throw err;
			})
	});

	let completedUsers = 0;
	artistList.forEach(user => {
		user.save()
			.then(result => {
				completedUsers++;
				if (completedUsers >= artistList.length) {
					console.log("All users saved.");
				}
			})
			.catch(err => {
				throw err;
			})
	});
});
