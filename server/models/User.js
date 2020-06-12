const mongoose = require('mongoose');//db
const bcrypt = require('bcrypt');//for hashing passwords
const { someLimit } = require('async');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min:6,
        max:15
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type: String,
        required: true,
        min:2,
        max:15
    },
    lastName:{
        type: String,
        required: true,
        min:2,
        max:15
    },
    role:{
        type: String,
        required: true,
        min:2,
        max:15
    },
    signedSuggestions: [{
            suggestionId: {type:mongoose.Schema.Types.ObjectId, ref:'Suggestion'},
            suggestionTitle: String
        }]
});

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();//continue when its already hashed

    bcrypt.hash(this.password, 10, (err, passwordHash) =>{
        if(err) return next(err);
        this.password = passwordHash;
        next();
    })
});


userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (err, ismatch) =>{
        if(err) return cb(err);
        else{
            if(!ismatch) return cb(null, ismatch);
            return cb(null, this)
        }
    })
}

userSchema.methods.addSignedSuggestion = function(suggestion){
    let signedSuggestion = {
        suggestionId: suggestion._id,
        suggestionTitle: suggestion.title
    }

    this.signedSuggestions.push(signedSuggestion);

    console.log(this.signedSuggestions);

}

module.exports = mongoose.model('User', userSchema);