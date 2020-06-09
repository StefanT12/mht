import React from 'react';

import SuggestionSummary from './SuggestionSummary';

const SuggestionList = (props) => {
    const {suggestions} = props;
    if(suggestions.length > 0){

        return(
            <div className='suggestion-list section'>
            {suggestions && suggestions.map(suggestion=>{
                //don't bother mapping if suggestions is null
                return (
                    <SuggestionSummary suggestion={suggestion} key={suggestion.id}/>  
                )
            })}
            </div>
        );

    }
    else return null;
    
}

export default SuggestionList;