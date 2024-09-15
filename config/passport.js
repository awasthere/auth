const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const userModel=require('./db');
const { compareSync } = require('bcrypt');


passport.use(new LocalStrategy(
    function(username, password, done) {
      userModel.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false,{message:"Incorrect username!"}); }
        if (!compareSync(password,user.password)) { return done(null, false,{message:"Incorrect password!"}); }
        return done(null, user);
      });
    }
  ));

//persistes user data inside session

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//fetches session details using session id

passport.deserializeUser(function(id, done) {
    userModel.findById(id, function (err, user) {
      done(err, user);
    });
});