const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let workSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	user: {
		type: Schema.Types.ObjectId
	},
    title:{
        type: String, 
		required: true,
		maxlength: 100,

    },
	enrolled: {
        type: [Schema.Types.ObjectId]
    },
    description: {
        type: String,
		minlength: 0,
		maxlength: 1000,
        default: ""
    }
});

//Instance method finds purchases of this user
workSchema.methods.findPurchases = function(callback){
	this.model("Purchase").find()
	.where("buyer").equals(this._id)
	.populate("product")
	.exec()
	.then(callback);
};

module.exports = mongoose.model("Workshops", workSchema);
