const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let notifSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	user: {
		type: Schema.Types.ObjectId, 
		
	},
    addedArtArtist:{
        type: [Schema.Types.ObjectId]
    },
	addedArt: {
        type: [Schema.Types.ObjectId]
    },
	addedWorkshopArtist: {
        type: [Schema.Types.ObjectId]
    },
	addedWorkshop: {
        type: [Schema.Types.ObjectId]
    }
});

//Instance method finds purchases of this user
notifSchema.methods.findPurchases = function(callback){
	this.model("Purchase").find()
	.where("buyer").equals(this._id)
	.populate("product")
	.exec()
	.then(callback);
};

module.exports = mongoose.model("Notifications", notifSchema);
