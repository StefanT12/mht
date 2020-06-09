const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const JWT = require('jsonwebtoken');//used to sign the tokens used by passport-jwt
const passportConfig = require('../passport');
const User = require('../models/User');
const Suggestion = require('../models/Suggestion');
const ServerSentEvents = require('../ServerSentEvents').instance;
const eventTypes = require('../ServerSentEvents').eventTypes;
//keys
const mySecret = process.env.secretOrKey || require("../../config/keys").secretOrKey;
const atkName = process.env.accessToken || require("../../config/keys").accessToken;

const suggestionRouter = express.Router();


//#region helper
const sToMappedS = (s) =>{
    let sM = {
        id:'',
        title:'',
        content:'',
        postedBy:'',
        postedByName:'',
        createdAt: '',
        updatedAt:''
    }

    sM.id = mongoose.Types.ObjectId(s._id).toString();//conversion for react
    sM.title = s.title;
    sM.content = s.content;
    sM.postedBy = s.postedBy;
    sM.postedByName = s.postedByName;
    sM.id = mongoose.Types.ObjectId(s._id).toString();

    var dateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute:'2-digit'
    };

    sM.createdAt= s.createdAt.toLocaleDateString("en-US", dateTimeFormatOptions);
    sM.updatedAt= s.updatedAt.toLocaleDateString("en-US", dateTimeFormatOptions);

    return sM;
}
//#endregion

suggestionRouter.post('/newsuggestion', passport.authenticate('jwt', {session: false}), (req,res)=>{
    
    const{title,content} = req.body;
    
    let decodedCookie = JWT.decode(req.cookies[atkName]);
    let postedByName = decodedCookie.fname;
    let postedBy = mongoose.Types.ObjectId(decodedCookie.sub);

    Suggestion.findOne({title}, (err,suggestionSearch)=>{

        if(err){
            res.status(500).json({
                message:{
                    msgBody: "Err occured when trying to push a new suggestion!",
                    msgError: true
                }
            });
        }     
            
        if(suggestionSearch){
            res.status(400).json({
                message:{
                    msgBody: "Suggestion already exists!",
                    msgError: true
                }
            });
        }    
        else{
            const newSuggestion = new Suggestion({title, content, postedBy, postedByName});
            newSuggestion.save(err =>{
                
                if(err){
                    res.status(500).json({
                        message:{
                            msgBody: "Err occured when saving new suggestion in db!",
                            msgError: true
                        }
                    });
                } 
                else{

                    ServerSentEvents.pushToAll(sToMappedS(newSuggestion), eventTypes.UPDATE_STORE);

                    res.status(201).json({
                        message:{
                            msgBody: "Suggestion successfully created!",
                            msgError: false
                        }
                    });
                } 
            });
        }
            
    });
    
 });

 suggestionRouter.get('/getsuggestions', passport.authenticate('jwt', {session: false}), (req,res)=>{

    const allSuggestions = Suggestion.find({}, (err, suggestions)=>{
        if(err){
            res.status(500).json( {status: false, msg: err, suggestions: {} });
        }
        if(suggestions){
            
            const mappedSuggestions = suggestions.map(s =>{

                return sToMappedS(s);
            });

            //ServerSentEvents.pushToAll('Time to update suggestions', eventTypes.UPDATE_STORE);

            res.status(200).json( {status: true, msg: '', suggestions: mappedSuggestions });
        }
        else{
            res.status(500).json( {status: false, msg: 'failed to grab suggestions', suggestions: {} });
        }
    });
    
});

module.exports = suggestionRouter;