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
const { syncBuiltinESMExports } = require('module');
const { redirect } = require('express/lib/response');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT||5000;

app.set('view engine','ejs');
app.use(express.static("public"));

// home route
app.get("/", function(req, res){
    if(storage.getItem('loggedin'))
    res.render("home",{login: true});
    else 
    res.render("home",{login: false});
 });

//  logout
app.get("/logout", function(req, res){
    storage.removeItem('loggedin');
    res.render('home', {login: false});
})


// register

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


// signin

app.post("/signin",(req,res)=>{
    const user=req.body.login_name;
    const password=req.body.login_password;
    
    db.query('SELECT * FROM register WHERE username = ? AND password = ?', [user, password], function(error, results) {
        if (results.length > 0) {
            // console.log("You have signed in");
            // console.log(results[0].name);
            storage.setItem('loggedin', 'true');
            res.render('home',{login:results})
        } else {
            db.query('select * from Employee where username=? and password=?',[user,password],function(error,results){
                if(results.length>0){
                    // console.log("Admin has signed in");
                    res.render('admin',{data:results});
                    
                }
                else{
                    console.log("Incorrect Username and/or Password!");
                    alert("Incorrect Username and/or Password!");
                }
            })
            
        }		
    });
    
});



// profile

app.get("/profile/:name",function(req,res){
    let {name}=req.params;
    res.render("inner-page",{data:name});
})


// Available Loans

app.get("/availableLoans",function(req,res){
    res.render("application");
})


// CURRENT STATUS
app.get("/records",function(req,res){
    db.query("select * from Applicant where status='2'",function(err, rows){
        if(err)
        throw err;
        else
        res.render('records',{data : rows})
    })
    
})


// SANCTIONED LOANS
app.get('/user_prev_records',function(req,res){
    db.query('select * from Applicant where status<>?',['2'],function(err,rows){
        if(err)
        throw err;
        else
        res.render('user_prev_records',{data:rows});
    });

})

// DELETE
app.get('/delete/:id', function(req,res){
    let {id} = req.params;
    var sql='delete from Applicant where id=?';
    db.query(sql,[id],function(err){
        if(err) throw err;
    })
    res.redirect('back');
})



// TYPES OF LOAN

//CAR LOAN
app.get('/Carloan',function(req,res){
    db.query("select * from banks where loan_type ='Car-Loan'",function(err, rows){
        if(err)
        throw err;
        else
        res.render('car-loan',{data : rows})
    })
})
//HOME LOAN
app.get('/Homeloan',function(req,res){
    db.query("select * from banks where loan_type ='Home-Loan'",function(err, rows){
        if(err)
        throw err;
        else
        res.render('home-loan',{data : rows})
    })
})

//EDUCATION LOAN
app.get('/Eduloan',function(req,res){
    db.query("select * from banks where loan_type ='Education-Loan'",function(err, rows){
        if(err)
        throw err;
        else
        res.render('edu-loan',{data : rows})
    })
})




//APPLICATION LOAN
app.get('/appform/:id',function(req,res){
    let {id}=req.params;
    var sql='select * from banks where id =?';
    db.query(sql,[id],function(err,rows){
        if(err)
        throw err
        else{
            console.log(rows);
        res.render('form',{data: rows});}
    })
    
})

//SUBMIT LOAN APPLICATION----------------------------------->

app.post('/apply',function(req,res){

    var application={
        id:Math.floor((Math.random() * 100000) + 1),
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        city:req.body.city,
        loan_type: req.body.loan_type,
        bank:req.body.bank,
        branch:req.body.branch,
        rate:req.body.rate,
        period:req.body.period,
        Adhaar:req.body.adhaar,
        pan:req.body.pan,
        amount:req.body.amount,
        account_no:req.body.account,
        application_form:req.body.upload,
        status:2
    }
    db.query('INSERT INTO Applicant set ?',application,function(err,result){
        if(err)
        console.log(err);
        else{
        console.log("You have successfully applied for the loan");
        res.render('congrats');
        }
    })


})

// CONTACT US---------------------------------------->
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

//<--------------------------ADMIN SIDE----------------------------------->]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]




app.get('/accept/:id', function(req,res){
    let {id} = req.params;
    var sql=`update Applicant set status ='1' where id=${id}`;
   db.query(sql,function(err){
       if(err) throw err;
       else{
        //    db.query(`select * from Employee where branch in (select branch from Applicant where id=${id}) and bank in (select bank from Applicant where id=${id})`,function(err,results){
        //        if(err)
        //        throw err
        //        else
               // console.log(results[0].username);
            //    res.redirect(`/admin_verification/${results[0].username}`)
            res.redirect('back');
           })
       }
   })
})


app.get('/reject/:id', function(req,res){
    let {id} = req.params;
     var sql=`update Applicant set status ='0' where id=${id}`;
    db.query(sql,function(err){
        if(err) throw err;
        else{
            // db.query(`select * from Employee where branch in (select branch from Applicant where id=${id}) and bank in (select bank from Applicant where id=${id})`,function(err,results){
            //     if(err)
            //     throw err
            //     else
                // console.log(results[0].username);
                // res.redirect(`/admin_verification/${results[0].username}`)
                res.redirect('back');
            })
        }
    })
    
    
})



app.get("/admin_verification/:user",function(req,res){
    let {user}=req.params;
    // console.log(user);
    db.query("select * from Applicant where branch in (select branch from Employee where username=?) and bank in (select bank from Employee where username=?) and status=?",[user,user,2],function(err,rows){
        if(err)
        throw err;
        else
        res.render('admin_verification',{data : rows})
    })
})


app.get('/customers/:user',function(req,res){
    let {user}=req.params;
    // console.log(user);
    db.query("select * from Applicant where branch in (select branch from Employee where username=?) and bank in (select bank from Employee where username=?) and status<>?",[user,user,2],function(err,rows){
    
        if(err) throw err;
        else{
            
        res.render('customers',{data: rows});}
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));