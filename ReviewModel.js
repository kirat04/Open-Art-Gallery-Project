const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	user: {
		type: Schema.Types.ObjectId 
		
	},
    art:{
        type: Schema.Types.ObjectId
    },
	liked: {
        type: Boolean
    },
	reviewText: {
        type: String
        },
});

//Instance method finds purchases of this user
reviewSchema.methods.findPurchases = function(callback){
	this.model("Purchase").find()
	.where("buyer").equals(this._id)
	.populate("product")
	.exec()
	.then(callback);
};

module.exports = mongoose.model("Review", reviewSchema);
