const express = require('express');
const mongoose = require('mongoose');
const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');//used to sign the tokens used by passport-jwt
const passportConfig = require('../passport');
const User = require('../models/User');
//keys
const mySecret = require("../../config/keys").secretOrKey || process.env.secretOrKey;
const atkName = require("../../config/keys").accessToken || process.env.accessToken;

const ServerSentEvents = require('../ServerSentEvents').instance;
const eventTypes = require('../ServerSentEvents').eventTypes;

const signToken = (userID, fName) =>{
    return JWT.sign({
        iss: mySecret,
        sub: userID,
        fname: fName
    }, mySecret, {expiresIn:"1h"});
}

userRouter.post('/register', (req,res)=>{
    const{username, password, firstName, lastName} = req.body;//lets deconstruct all from request
    User.findOne({username}, (err,userSearched)=>{
        if(err) res.status(500).json({message:{msgBody: "Err occured when pushing new user!", msgError: true}});
        
        if(userSearched) res.status(400).json({message:{msgBody: "Username already taken!", msgError: true}});
        else{
            const newUser = new User({username,password, firstName, lastName});
            newUser.save(err =>{
                if(err) res.status(500).json({message:{msgBody: "Err occured when saving new user in db!", msgError: true}});
                else res.status(201).json({message:{msgBody: "User account successfully created!", msgError: false}});
            })
        }
    });
});

userRouter.post('/login', passport.authenticate('local', {session: false}), (req,res)=>{
    if(req.isAuthenticated()){
        const{_id, username }=req.user;
        const token = signToken(_id, req.user.firstName + ' ' + req.user.lastName);
        //httpOnly - cannot touch it with js
        //sameSite - no cross-site forgery
        res.cookie(atkName, token, {expires: new Date(Date.now() + 900000), httpOnly:true, sameSite:true});
        res.status(200).json({isAuthenticated:true, user:{username}});
    }
});

userRouter.get('/logout', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //unsubscribe from SSE
    let decodedCookie = JWT.decode(req.cookies[atkName]);
    let uid = mongoose.Types.ObjectId(decodedCookie.sub);
    ServerSentEvents.unsubscribe(uid)
    //clear access token
    res.clearCookie(atkName);
    res.json({user:{username: ''}, success: true});
});


//check user authorization
userRouter.get('/authenticated', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const {username} = req.user;
    res.status(200).json( {isAuthenticated: true, user:{username} });
});

module.exports = userRouter;