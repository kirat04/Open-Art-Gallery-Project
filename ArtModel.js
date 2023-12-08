const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let artSchema = Schema({
	title: {
		type: String, 
		required: true,
		maxlength: 100
	},
    artist:{
         type: Schema.Types.ObjectId, ref: 'User' 
    },
	year: {
		type: Number,
		required: [true],
		min: [0, "year must be positive."]
	},
	category: {
        type: String, 
		required: true,
		maxlength: 100
	},
	medium: {
        type: String, 
		required: true,
		maxlength: 100
	},
	poster:{
		type: String,
		required: true
	},
    description: {
        type: String,
		minlength: 0,
		maxlength: 1000,
        default: ""
    }
});

//Find all purchases made by this buyer
artSchema.methods.findPurchases = function(callback){
	this.model("Purchase").find()
	.where("product").equals(this._id)
	.populate("buyer")
	.exec()	
	.then(callback);
};

module.exports = mongoose.model("Art", artSchema);