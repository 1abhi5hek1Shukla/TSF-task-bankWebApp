// App file for Task1 (TSF)
require("dotenv").config()
var express = require("express"),
	app		= express(),
	mongoose = require("mongoose"),
	User = require("./models/user"),
	flash =	require("connect-flash"),
	Transaction = require("./models/transaction"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override")
	seedDB = require("./seed");

app.set("view engine", "ejs");

// mongoose.connect("mongodb://localhost/bank_system", { useNewUrlParser: true , useUnifiedTopology: true })
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true , useUnifiedTopology: true })

app.use(require("express-session")({
	secret:"qwerty",
	resave:false,
	saveUninitialized:false,
	// cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
app.locals.moment = require('moment');

app.use(function(req,res,next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


// seedDB();


app.get("/", (req,res)=>{
	res.render("landing");
});

app.get("/home",(req,res)=>{
	res.render("home");
});

app.get("/customers",(req,res)=>{
	User.find({},(err, allCustomer)=>{
		if(err){
			console.log(err);
		}else{
			res.render("customers",{customers: allCustomer});			
		}
	});
});

app.get("/customers/:id",(req,res)=>{
	User.findById(req.params.id, (err,user)=>{
		if(err){
			console.log(err)
		}else{		
			res.render("show",{customer : user});
		}
	});
});

app.get("/customers/:id/transfer",(req,res)=>{
	User.findById(req.params.id, (err,cCustomer)=>{
		User.find({"_id" : {$ne : req.params.id}}, (err,tCustomers)=>{
			if(err){
				 console.log(err);
				 // console.log("error Here.............");
			}else{
				// console.log(tCustomers);
				res.render("transfer",{cCustomer:cCustomer,tCustomers:tCustomers});
			}
		});
	})
		
});

app.put("/customers/:id/transfer", (req,res)=>{
	User.findById(req.params.id, (err,cCustomer)=>{
		if(err){
			console.log(err)
		}else{
			if(Number(req.body.ammount) > cCustomer.currentBalance){
				// console.log("Problem Here!!!!!!!!!!!!");
				// res.redirect("back");
				req.flash("error","You dont have this much money dude");
				res.redirect("back");
			}
			else if(Number(req.body.ammount) < 0){
				// console.log("Problem Here!!!!!!!!!!!!");
				// res.redirect("back");
				req.flash("error","Invalid Transaction");
				res.redirect("back");
			}else{
				User.findById(req.body.cID, (err,tCustomer)=>{
					if(err){
						console.log(err);
						res.redirect("back");
					}else{
						tCustomer.currentBalance = tCustomer.currentBalance + Number(req.body.ammount);
						cCustomer.currentBalance = cCustomer.currentBalance - Number(req.body.ammount);
						cCustomer.save();
						tCustomer.save();
						Transaction.create({
							fromId : cCustomer._id,
							from : cCustomer.name,
							toId : tCustomer._id,
							to : tCustomer.name,
							ammount : req.body.ammount
						}, (err,createdTransaction)=>{
							if(err){
								console.log(err);
							}else{
								// console.log(createdTransaction);
								// console.log("Transaction Recorded");
								createdTransaction.save();
							}
						});
						req.flash("success","Transaction Successfull");
						res.redirect("back");
					}
				});	
			}	
		}
	});
})

app.get("/history",(req,res)=>{
	Transaction.find({},(err,allTransactions)=>{
		if(err){
			console.log(err)
			res.redirect("back");
		}else{
			// console.log(allTransactions);
			res.render("history",{history:allTransactions})
		}
	});
});
port = process.env.PORT || 3000;

app.listen(port,()=>{
	console.log("Server fired at ..." + port);
});