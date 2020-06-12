import AuthService from '../../Services/AuthService';
import ServerService from '../../Services/ServerService';

import {UserConstants} from '../Constants/UserConstants';
import history from '../../Helpers/history';

export const login = (user) => {
    //we write all dispatches, easier to use and in-sync with the reducers which also use UserConstants
    const inprogress = () => {return { type: UserConstants.LOGIN_REQUEST } }
    const success = user => { return { type: UserConstants.LOGIN_SUCCESS , user} }
    const failure = msg => { return { type: UserConstants.LOGIN_FAILURE , msg} }

    return (dispatch, getState) => {
        //awaiting server response
        dispatch(inprogress());
        //server response received
        AuthService.login(user).then(data =>{
            //deconstruct received data 
            const {isAuthenticated, user, message} = data;
            console.log(user);
            //update redux store then redirect
            if(isAuthenticated){
                //authorize the user & set user role (in store)
                dispatch(success(user));
                //open stream for server-sent events
                ServerService.openSSEConnection();
                // ServerService.subscribe('UPDATE_STORE', (data)=>{console.log(data);}, '12');
                history.push('/');
            }//either fail or some problem
            else{
                //the server will most likely inform us on the issue at hand
                dispatch(failure(message));
            }
        })
    }
}

export const logout = () => {
    
    const logout = () =>{return {type: UserConstants.LOGOUT}}

    return (dispatch, getState) => {

            AuthService.logout().then(data=>{
            const {success} = data;
            if(success) dispatch(logout());
        })
    }
}
// //we will only use this to check against the server whether user is logged in or not in the moment user does sensitive things i.e. posts a new suggestion, updates his password etc
// export const isAuthorized = () => {

//     const authenticated = () => {return{type: UserConstants.AUTHENTICATED}}
//     const unauthorized = () => {return{type: UserConstants.UNAUTHORISED}}

//     return (dispatch, getState) => {
//         //by returning this promise, we can later on return the result on .then, turning the 'dispatch action' into a promise
//         return AuthService.isAuthenticated().then(data=>{
//             const {isAuthenticated} = data;

//             if(isAuthenticated)
//                 dispatch(authenticated());
//             else 
//                 dispatch(unauthorized());
            
//             return isAuthenticated;
//         })
//     }
// }
