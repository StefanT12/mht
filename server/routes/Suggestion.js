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

const async = require('async');

//#region helper
const sToMappedS = (s, role) =>{
    var dateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute:'2-digit'
    };

    let sM = {
        id:'',
        title:'',
        content:'',
        postedBy:'',
        postedByName:'',
        createdAt: '',
        updatedAt:'',

        signatures:{}
    }

    sM.id = mongoose.Types.ObjectId(s._id).toString();//conversion for react
    sM.title = s.title;
    sM.content = s.content;
    sM.postedBy = s.postedBy;
    sM.postedByName = s.postedByName;
    sM.id = mongoose.Types.ObjectId(s._id).toString();
    sM.signatures = s.signatures.map((signature, index) =>{
        let mSig = {
            userid: index,
            username: '',
            userfullname: signature.userfullname,
            signatureDate: signature.signatureDate.toLocaleDateString("en-US", dateTimeFormatOptions)
        };

        if(role === 'admin'){
            mSig.userid = signature.userid;
            mSig.username = signature.username;
        }

        return mSig
    });

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

                    ServerSentEvents.pushToAll(sToMappedS(newSuggestion, req.user.role), eventTypes.UPDATE_STORE);

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

                return sToMappedS(s, req.user.role);
            });

            //ServerSentEvents.pushToAll('Time to update suggestions', eventTypes.UPDATE_STORE);

            res.status(200).json( {status: true, msg: '', suggestions: mappedSuggestions });
        }
        else{
            res.status(500).json( {status: false, msg: 'failed to grab suggestions', suggestions: {} });
        }
    });
    
});

//#region sign / unsign helpers
const insertedCorrectName = (user, fullname) => {
    const userfullname = user.firstName + ' ' + user.lastName;
    return fullname === userfullname;
}

const userSignedAlready = (user, suggestionId) => user.signedSuggestions.find(suggestion => suggestion.suggestionId.toString() === suggestionId);

function asyncSave(user, suggestion, callbackF){
    async.series({
        saveSuggestionInUser: function(callback) {
            user.save(err =>{
                if(err){
                    callback(err, null);
                } 
                else{
                    callback(null, 'saved');
                }
           
            });
        },
        saveUserInSuggestion: function(callback){
            suggestion.save(err =>{
                if(err){
                    callback(err, null);
                }else{
                    callback(null, 'saved');
                } 
            
            });
        }
      }, callbackF);

}
//#endregion

suggestionRouter.post('/unsign', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //destructure vars
    const {fullname, suggestionId} = req.body;

    if(!insertedCorrectName(req.user, fullname)){
        res.status(400).json( {status: false, msg: 'Make sure name matches' });
        return;
    }

    if(!userSignedAlready(req.user, suggestionId)){
        res.status(400).json( {status: false, msg: 'Already Unsigned' });
        return;
    }

    Suggestion.findById(suggestionId).then(suggestion =>{

        if(suggestion){

            const filteredSuggestions = req.user.signedSuggestions.filter(signedSuggestion => signedSuggestion.suggestionId.toString() !== suggestion._id.toString());
            req.user.signedSuggestions = filteredSuggestions;

            const filteredUsers = suggestion.signatures.filter(signature => signature.userid.toString() !== req.user._id.toString());
            suggestion.signatures = filteredUsers;

            asyncSave(req.user, suggestion, (err, results) => {
                //reverse time  
                if(err){
                    //no results
                    res.status(400).json( {status: false, msg: err.message});
                }
                else{
                    res.status(200).json( {status: true, msg: ''});
                    const signatureInfo ={
                        suggestionId: suggestion._id.toString(),
                        signatures: suggestion.signatures
                    };
                    ServerSentEvents.pushToAll(
                        signatureInfo,
                        eventTypes.UPDATE_SIGNATURES);
                }
            });
        }
    });
});

suggestionRouter.post('/sign', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //destructure vars
    const {fullname, suggestionId} = req.body;

    if(!insertedCorrectName(req.user, fullname)){
        res.status(400).json( {status: false, msg: 'Make sure name matches' });
        return;
    }

    if(userSignedAlready(req.user, suggestionId)){
        res.status(400).json( {status: false, msg: 'Action already performed' });
        return;
    }

    Suggestion.findById(suggestionId).then(suggestion =>{
        //by now, we made sure that the user is authorized, the suggestion was or wasnt signed before (based on case) and that it exists
        if(suggestion){
          
            req.user.addSignedSuggestion(suggestion);

            const newSignature = {
                userid: req.user._id,
                username: req.user.username,
                userfullname: req.user.firstName + ' ' + req.user.lastName,
                signatureDate: Date.now()
            }
            suggestion.signatures.push(newSignature);

            asyncSave(req.user, suggestion, (err, results) => {
                //reverse time  
                if(err){
                    //no results
                    res.status(400).json( {status: false, msg: err.message});
                }
                else{
                    res.status(200).json( {status: true, msg: ''});

                    const signatureInfo ={
                        suggestionId: suggestion._id.toString(),
                        signatures: suggestion.signatures
                    };

                    ServerSentEvents.pushToAll(
                        signatureInfo,
                        eventTypes.UPDATE_SIGNATURES);
                }
            });
            
        }
    });
});

suggestionRouter.get('/suggestionissigned/:suggestionId', passport.authenticate('jwt', {session: false}), (req,res)=>{

    const signatureExists = userSignedAlready(req.user, req.params.suggestionId)
    
    if(signatureExists){
        res.status(200).json({status: true, msg: '' });
    }
    else{
        res.status(200).json({status: false, msg: '' });
    }
});

//EG of body for this post
// {
//     "suggestionId": "5ee2bb26fda4591fecf537e1",
//     "modType": "hide",
//     "data": ""
// }
suggestionRouter.post('/modify', passport.authenticate('jwt', {session: false}), (req,res)=>{

    if(req.user.role !== 'admin'){
        res.status(400).json({status: false, msg: 'unauthorized' });
        return;
    }

    const {suggestionId, modType, data} = req.body;

    let oId = mongoose.Types.ObjectId(suggestionId);

    Suggestion.findOne({_id: oId}, (err,suggestionSearch)=>{
        if(err || !suggestionSearch){
            res.status(400).json({status: false, msg: 'suggestion not found' });
            return;
        }
        console.log(suggestionSearch)
        switch(modType){
            
            case 'hide':
                suggestionSearch.hidden = true;
            break;

            case 'delete':
                Suggestion.remove((err)=>{
                    if(err){
                        console.log(err.message);
                    }
                    else{
                        console.log('Suggestion (' + oId+ ') deleted on request by admin (' + req.user.username + ')');
                        res.status(201).json({status: true, msg: 'deleted' });
                    }
                });
            return;
            
            case 'modify':
                suggestionSearch.title = data.title;
                suggestionSearch.body = data.body;
            break;
            
            default:
                res.status(400).json({status: false, msg: 'the modification type does not exist' });
            return;
        }
        
        suggestionSearch.save(err=>{
            if(err){
                console.log(err.message)
            }
            else{
                res.status(201).json({status: true, msg: 'modified' });
            }
        })
        
    })

});

module.exports = suggestionRouter;