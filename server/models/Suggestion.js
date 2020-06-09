var mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
    title: String,
    content: String, 
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postedByName: String
}, {
    //mongoose will add a 'createdAt' and 'updatedAt' field, will update 'updatedAt' field after every update operation
    timestamps: true
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);