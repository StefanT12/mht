const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const JWT = require('jsonwebtoken');//used to sign the tokens used by passport-jwt
const passportConfig = require('../passport');
const ServerSentEvents = require('../ServerSentEvents').instance;
//keys
const mySecret = process.env.secretOrKey || require("../../config/keys").secretOrKey;
const atkName = process.env.accessToken || require("../../config/keys").accessToken;

const serverRouter = express.Router();

serverRouter.get('/events', passport.authenticate('jwt', {session: false}), (req,res)=>{

    let decodedCookie = JWT.decode(req.cookies[atkName]);
    let uid = mongoose.Types.ObjectId(decodedCookie.sub);
    ServerSentEvents.subscribe(req, res, uid);
  
});

module.exports = serverRouter;