const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	name: {
		type: String, 
		required: true,
		minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
	},
    upgrade:{
        type: Boolean,
        default: false
    },
	art: {
        type: [Schema.Types.ObjectId]
	},
	workshops: {
        type: [Schema.Types.ObjectId]
	},
	password: {
		type: String, 
		required: true,
		minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
	},
	following:{
        type: [Schema.Types.ObjectId]
	}
});

//Instance method finds purchases of this user
userSchema.methods.findPurchases = function(callback){
	this.model("Purchase").find()
	.where("buyer").equals(this._id)
	.populate("product")
	.exec()
	.then(callback);
};

module.exports = mongoose.model("User", userSchema);
