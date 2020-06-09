import React from 'react'

const SuggestionDetails = (props) => {
    
    const suggestionId = props.match.params.id;

    return (
        <div className = 'container section suggestion-details'>
            <div className='card z-depth-0'>
                <div className='card-content'>
                    <span className='card-title'>Suggestion X</span>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
                <div>
                    <div className='card-action lighten-4 grey-text'>
                        <div>Posted by mH</div>
                        <div>2nd September, 2AM</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuggestionDetails;
