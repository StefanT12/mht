const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const JWT = require('jsonwebtoken');//used to sign the tokens used by passport-jwt
const passportConfig = require('../passport');
const ServerSentEvents = require('../ServerSentEvents').instance;
//keys
const mySecret = require("../../config/keys").secretOrKey || process.env.secretOrKey;
const atkName = require("../../config/keys").accessToken || process.env.accessToken;

const serverRouter = express.Router();


// serverRouter.get('/events', passport.authenticate('jwt', {session: false}), (req,res)=>{
//     let decodedCookie = JWT.decode(req.cookies[atkName]);
//     let uid = mongoose.Types.ObjectId(decodedCookie.sub);
//     ServerSentEvents.subscribe(req, res, uid);
// });
serverRouter.get('/events', passport.authenticate('jwt', {session: false}), (req,res)=>{
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.flushHeaders(); // flush the headers to establish SSE with client

    // const headers = {
    //     'Content-Type': 'text/event-stream',
    //     'Connection': 'keep-alive',
    //     'Cache-Control': 'no-cache',
    //     "Access-Control-Allow-Origin": "http://localhost:3000",
    //     "Access-Control-Allow-Headers":"Content-Type, Allow, Authorization, X-Args",
    //     'Access-Control-Allow-Credentials': "true"
    // };

    let decodedCookie = JWT.decode(req.cookies[atkName]);
    let uid = mongoose.Types.ObjectId(decodedCookie.sub);
    ServerSentEvents.subscribe(req, res, uid);
//     res.writeHead(200, headers);

//     res.write(`data: ${JSON.stringify({message: 'counter'})}\n\n`);

//     res.on('close', () => {
//       console.log('client dropped me');
//       res.end();
//   });
  
});

module.exports = serverRouter;