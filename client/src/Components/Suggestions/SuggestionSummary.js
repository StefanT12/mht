import React from 'react'
import { NavLink } from 'react-router-dom'

const SuggestionSummary = (props) => {
    const {suggestion} = props;
    //<span className='card-title'>{suggestion.title}</span>
    return(
       
        <div className='card z-depth-1 suggestion-summary'>
            <div className = 'card-content grey-text text-darken-3'>
                <NavLink  className='card-title' to={'/suggestion/'+suggestion.id}>{suggestion.title} | <span className = 'teal-text text-lighten-2'>{suggestion.signatures.length}</span>
                </NavLink>
                <p>Posted by {suggestion.postedByName}</p>
                <p className='grey-text'> {suggestion.createdAt} </p>
            </div>       
        </div>
    )
}

export default SuggestionSummary;