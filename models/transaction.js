var mongoose = require("mongoose");

var transSchema = new mongoose.Schema({
	fromId :String,
	from :String,
	toId : String,
	to: String,
	ammount:Number,
	date: {type:Date, default:Date.now},
});

module.exports = mongoose.model("Transaction",transSchema);
