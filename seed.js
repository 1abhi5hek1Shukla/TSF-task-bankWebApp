var mongoose = require("mongoose"),
	User 	 = require("./models/user"),
	Transaction = require("./models/transaction");

var data = [
	{
		name: "Delta",
		email: "del@greek.com",
		currentBalance : 42000.00
	},
	{
		name: "Gamma",
		email: "gamma@greek.com",
		currentBalance : 10100.00
	},
	{
		name: "Alpha",
		email: "alpha@greek.com",
		currentBalance : 1000000.00
	},
	{
		name: "Lambda",
		email: "lambda@greek.com",
		currentBalance : 51000.00
	},
	{
		name: "Omega",
		email: "omega@greek.com",
		currentBalance : 140000.00
	},
	{
		name: "Psi",
		email: "psi@greek.com",
		currentBalance : 340000.00
	},
	{
		name: "Theta",
		email: "theta@greek.com",
		currentBalance : 490000.00
	}
];

function seedDB(){
	Transaction.deleteMany({}, (err)=>{
		if(err){
			console.log(err);
		}else{
			// console.log("Transaction cleared");
			User.deleteMany({},(err)=>{
				if(err){
					console.log(err);
				}
				// console.log("Database Clear");
				data.forEach((datum)=>{
					User.create(datum,(err, createdUser)=>{
						if(err){
							console.log(err);
						}else{
							// console.log("User Added");
						}
					});
				});
			});			
		}
	});
}
module.exports = seedDB;