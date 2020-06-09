import {SuggestionConstants} from '../Constants/SuggestionConstants';

const initState = {

    suggestions: [
        {id: '', title:'', content:''}
    ]
}

const SuggestionReducer = (state = initState, action) =>{
    switch(action.type){

        case SuggestionConstants.GETSUGGESTIONS_SUCCESS:
        return{
            suggestions: action.suggestions
        }

        case SuggestionConstants.CLEARSUGGESTIONS_REQUEST:
        return{
            suggestions:{}
        }

        case SuggestionConstants.ADDSUGGESTION_SSE:
        console.log('adding suggestion in reducer');
        return{
            suggestions: [...state.suggestions, action.suggestion]   
        }

        default:
        // do nothing
    }
   
    return state;
}

export default SuggestionReducer;