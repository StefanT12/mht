import React from 'react'

const SuggestionSummary = (props) => {
    const {suggestion} = props;
    return(
       
        <div className='card z-depth-0 suggestion-summary'>
            <div className = 'card-content grey-text text-darken-3'>
                <span className='card-title'>{suggestion.title}</span>
                <p>Posted by {suggestion.postedByName}</p>
                <p className='grey-text'> {suggestion.createdAt} </p>
            </div>       
        </div>
    )
}

export default SuggestionSummary;