const express= require('express');
const app=express();
const userModel=require("./config/db");
const bcrypt = require('bcrypt');
const session= require('express-session');
const MongoStore=require('connect-mongo');
const passport = require('passport');

app.set('view engine','ejs');
app.use(express.urlencoded({extender:true}))


app.set('trust proxy',1)
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({mongoUrl:'mongodb://127.0.0.1:27017/auth',collectionName:"sessions"}),
    cookie:{
        maxAge: 1000*60*60*24
    }
}))


require('./config/passport');
app.use(passport.initialize())
app.use(passport.session())

app.get("/login",(req,res)=>{
    res.render('login');
})


app.get("/register",(req,res)=>{
    res.render('register');
})

app.post("/login",passport.authenticate('local',{
    successRedirect:'/login',
    failureRedirect:'/register',
    
}))

app.post("/register",async(req,res)=>{
    let {username,password}=req.body;
    let user= new userModel({
        username:username,
        password:bcrypt.hashSync(password,10)
    });
    await user.save();
    res.send("register done")
})

app.get('/logout',(req, res)=>{
    req.logout((err)=> {
      if (err) { 
        return (err); 
    }
      res.redirect('/login');
    });
  });




app.get("/protected",(req,res)=>{
    res.send("protected");
})

app.listen(9090,()=>{
    console.log("Port listening");
})