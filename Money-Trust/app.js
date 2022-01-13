//jshint esversion:6

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const mysql = require('mysql')
var alert = require('alert');
const storage = require('node-sessionstorage')
var db= require('./connection.js');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT||5000;

app.set('view engine','ejs');
app.use(express.static("public"));

app.get("/", function(req, res){
    if(storage.getItem('loggedin'))
    res.render("home",{login: true});
    else 
    res.render("home",{login: false});
 });

app.get("/logout", function(req, res){
    storage.removeItem('loggedin');
    res.render('home', {login: false});
})

app.get("/profile",function(req,res){
    res.render("inner-page");
})

app.get("/availableLoans",function(req,res){
    res.render("application");
})

app.post("/register", function(req, res){
        var register= {
            name : req.body.register_name,
            email : req.body.register_email,
            username: req.body.register_username,
            password: req.body.pswd1
       };

    db.query("select email, username from register where email= ? or username= ?",[register.email,register.username], function(err, result){
        if(result.length===0){
            db.query('INSERT INTO register set ?',register,function(err,result){
                if(err)
                console.log(err);
                // console.log("New User Registered");
                alert("You have registered");
                res.render("home",{login:false});
            })
        }
        else{
            alert("Email or Username already taken");
            res.redirect("/");
        }
    })

});

app.post("/signin",(req,res)=>{
    const user=req.body.login_name;
    const password=req.body.login_password;
    
    db.query('SELECT * FROM register WHERE username = ? AND password = ?', [user, password], function(error, results, fields) {
        if (results.length > 0) {
            // console.log("You have signed in");
            storage.setItem('loggedin', 'true');
            res.render('home',{login:true})
        } else {
            db.query('select username , password from Employee where username=? and password=?',[user,password],function(error,result){
                if(result.length>0){
                    // console.log("Admin has signed in");
                    alert("Hello Admin");
                    res.render('home',{login:true});
                }
                else{
                    console.log("Incorrect Username and/or Password!");
                    alert("Incorrect Username and/or Password!");
                }
            })
            
        }		
    });
    
});

app.post("/",function(req,res){
    // console.log(req.body);

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth :{
            user: 'moneytrustfamily570006@gmail.com',
            pass : 'MoneyTrustMysuru'
        }
    })

    const mailOptions = {
        from : req.body.email,
        to: 'moneytrustfamily570006@gmail.com',
        subject : `Message from ${req.body.email}: ${req.body.subject}`,
        text : req.body.message
    }

    transporter.sendMail(mailOptions,(e,info) =>{
        if(e){
            console.log(e);
            res.send('error');
        }
        else{
            console.log('Email Sent:' + info.response);
            alert('Email Sent');
            res.redirect('/');
        }

    })

})


app.listen(port, () => console.log(`Listening on port ${port}`));