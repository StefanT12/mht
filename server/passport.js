const passport = require('passport');//auth middleware
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const userDoc = require('./models/User');

//keys
const mySecret = process.env.secretOrKey || require("../config/keys").secretOrKey;
const atkName = process.env.accessToken || require("../config/keys").accessToken;

const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies[atkName];
    }
    return token;
}
//authorization (protect endpoints)
passport.use(new jwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: mySecret
}, (payload, done) =>{
    userDoc.findById({_id: payload.sub}, (err, user)=>{
        if(err)
            return done(err, false);
        if(user)
            return done(null, user);
        else
            return done(null, false);
    });   
}));
//authentication 
passport.use(new localStrategy((username,password,done)=>{
    userDoc.findOne({username}, (err, userFound)=>{
        //smth went wrong with db
        if(err) return done(err);
        //db works but no such user was found
        if(!userFound) return done(null, false);
        //check if password is correct
        userFound.comparePassword(password, done);
    })
}));