import SuggestionService from '../../Services/SuggestionService';
import {SuggestionConstants} from '../Constants/SuggestionConstants';
import SuggestionSummary from '../../Components/Suggestions/SuggestionSummary';

export const createSuggestion = (suggestion) =>{

    const inprogress = () => {return { type: SuggestionConstants.CREATESUGGESTION_REQUEST } }
    const success = () => {return { type: SuggestionConstants.CREATESUGGESTION_SUCCESS } }
    const fail = () => {return { type: SuggestionConstants.CREATESUGGESTION_FAIL } }

    return (dispatch, getState) => {
        let response = {msg: 'Unable to create suggestion', status: false};
        dispatch(inprogress());
        //pushing in db, returning somehow makes it a promise
        return SuggestionService.postNewSuggestion(suggestion).then(data=>{
            //deconstruct message from server
            const {message} = data;
            //undefined
            if(!message){
                return response;
            }
            //we assign it the msg error 
            response.msg = message.msgError;
            //if there is no error, then we return success
            if(!message.msgError){
                response = {msg:'Suggestion successfully created!', status: true}
                dispatch(success());
                return response;
            }
            //we assigned the msgError to msg before, we can return the response with status: false
            dispatch(fail());
            return response;
        });
    }
}

export const getSuggestions = () => {

    const inprogress = () => {return { type: SuggestionConstants.GETSUGGESTIONS_REQUEST } }
    const success = (suggestions) => {return { type: SuggestionConstants.GETSUGGESTIONS_SUCCESS, suggestions } }
    const fail = (msg) => {return { type: SuggestionConstants.GETSUGGESTIONS_FAIL , msg } }

    return(dispatch, getState) =>{

        dispatch(inprogress());
        
        SuggestionService.getSuggestions().then(data=>{
            const {status, suggestions, msg} = data;
            
            if(status){
                //ServerService.subscribe();
                dispatch(success(suggestions));
            }
            else{
                dispatch(fail(msg));
            }
                
            
        });
    }
}
//used only in relation to Server Sent Events
export const addSuggestionFromSSE = (suggestion) =>{
    
    const add = (suggestion) => {return { type: SuggestionConstants.ADDSUGGESTION_SSE, suggestion } }

    return(dispatch, getState) => {
        dispatch(add(suggestion));
    }
}

export const clearSuggestions = () =>{

    const clear = () => {return { type: SuggestionConstants.CLEARSUGGESTIONS_REQUEST } }

    return(dispatch, getState) => {
        dispatch(clear());
    }
}