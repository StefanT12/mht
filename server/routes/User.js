const express = require('express');
const mongoose = require('mongoose');
const userRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');//used to sign the tokens used by passport-jwt
const passportConfig = require('../passport');
const User = require('../models/User');
const Roles = require('../Constants').Roles;
//keys
const mySecret =  process.env.secretOrKey || require("../../config/keys").secretOrKey;
const atkName =  process.env.accessToken || require("../../config/keys").accessToken;

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
            const newUser = new User({username,password, firstName, lastName, role: 'user'});
            newUser.save(err =>{
                if(err) res.status(500).json({message:{msgBody: "Err occured when saving new user in db!", msgError: true}});
                else res.status(201).json({message:{msgBody: "User account successfully created!", msgError: false}});
            })
        }
    });
});

userRouter.post('/login', passport.authenticate('local', {session: false}), (req,res)=>{
    if(req.isAuthenticated()){
        const{_id, username, role, firstName, lastName }=req.user;
        const fullName = firstName + ' ' + lastName;

        const token = signToken(_id, fullName);
        //httpOnly - cannot touch it with js
        //sameSite - no cross-site forgery
        res.cookie(atkName, token, {expires: new Date(Date.now() + 900000), httpOnly:true, sameSite:true});
        
        res.status(200).json({isAuthenticated:true, user:{username, fullName, role}});
    }
});

userRouter.get('/logout', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //unsubscribe from SSE
    let uid = mongoose.Types.ObjectId(req._id);
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

userRouter.get('/isadmin', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const {username, role} = req.user;
    if(role === Roles.Admin){
        res.status(200).json( {isAdmin: true, user:{username} });
    }
    else{
        res.status(400).json( {isAdmin: true, user:{username} });
    }
    
});

//db user mapped to user - eliminating sensitive data
const dbuMappedToU = (user) =>{
    let mappedUser= {
        userid: user._id.toString(),
        username: user.username,
        fullName: user.firstName + user.lastName,
        signedSuggestions: []
    }

    if(user.signedSuggestions.length > 0){
        mappedUser.signedSuggestions = user.signedSuggestions.map(signedSuggestion => {
            
            let mappedSignedSuggestion = {
                suggestionId: signedSuggestion.suggestionId.toString(),
                suggestionTitle: signedSuggestion.suggestionTitle
            }

            return mappedSignedSuggestion;
        })
    }

    return mappedUser
}

userRouter.get('/allusers', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const {role} = req.user;
    
    if(role !== Roles.Admin){
        res.status(400).json( {status: false, users: [] });
        return;
    }

    const allUsers = User.find({}, (err, users)=>{
        if(err){
            res.status(400).json( {status: false, users: [], msg : err });
            return;
        }
        if(users){
            const mappedUsers = users.map(u =>{
                return dbuMappedToU(u);
            });
            res.status(200).json( {status: true, users: mappedUsers, msg : '' });
            return;
        }
    });

});

module.exports = userRouter;