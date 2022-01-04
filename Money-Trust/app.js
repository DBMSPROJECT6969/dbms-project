//jshint esversion:6

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const mysql = require('mysql')
const app = express();
var alert = require('alert');


app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT||5000;
app.set('view engine','ejs');
app.use(express.static("public"));
var db= require('./connection.js');

app.get("/",function(req, res){
    res.render("index",{login: false});
 });

app.get("/profile",function(req,res){
    res.render("inner-page");
})

app.get("/availableLoans",function(req,res){
    res.render("Application");
})

 app.post("/register", function(req, res){
    var register= {
  
   name : req.body.name,
   email : req.body.email,
   username: req.body.username,
   password: req.body.pswd1

};
db.query("select email, username from register where email= ? or username= ?",[register.email,register.username], function(err, result){
    if(result.length===0){
        db.query('INSERT INTO register set ?',register,function(err,result){
            if(err)
            console.log(err);
            console.log("New User Registered");
            alert("You have registered");
            res.render("index",{login:false});
        })

        
    }
    else{
        alert("Email or Username already taken");
        // res.redirect("/");
    }
})



});

app.post("/signin",(req,res)=>{
    const user=req.body.usname;
    const password=req.body.passwd;
   
       
    if (user && password) {
		db.query('SELECT * FROM register WHERE username = ? AND password = ?', [user, password], function(error, results, fields) {
			if (results.length > 0) {
				console.log("You have signed in");
                res.render('index',{login:true})
			} else {
                db.query('select username , password from Employee where username=? and password=?',[user,password],function(error,result){
                    if(result.length>0){
                        console.log("Admin has signed in");
                        alert("Hello Admin");
                        res.render('index',{login:true});
                    }
                    else{
                        console.log("Incorrect Username and/or Password!");
                        alert("Incorrect Username and/or Password!");
                    }
                })
				
			}		
		});
	} else {
		// res.send('Please enter Username and Password!');
        alert("Please enter Username and Password!");
	}
    
});

app.listen(port, () => console.log(`Listening on port ${port}`));