var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name : String,
	email : String,
	// currentBalance : String
	currentBalance : Number
});

module.exports = mongoose.model("User",userSchema);