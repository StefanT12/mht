import {SuggestionConstants} from '../Constants/SuggestionConstants';

const initState = {

    suggestions: [
        {
            id: '',
            title:'',
            content:'',
            postedBy:'',
            postedByName:'',
            createdAt: '',
            updatedAt:'',
            signatures:[1,2,3]
        }//?
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
        return{
            suggestions: [...state.suggestions, action.suggestion]   
        }

        case SuggestionConstants.PROCESSSIGNATURE_SSE:
        let indexOfSigned = state.suggestions.findIndex(aSuggestion => aSuggestion.id === action.signatureInfo.suggestionId);
        return Object.assign({}, state, {
            suggestions: state.suggestions.map((suggestion, index) => {
              if (index === indexOfSigned) {
                return Object.assign({}, suggestion, {
                  ...suggestion,
                  signatures: action.signatureInfo.signatures
                })
              }
              return suggestion
            })

        })
        default:
        // do nothing
    }
   
    return state;
}

export default SuggestionReducer;