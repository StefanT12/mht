import UserService from '../../Services/UserService';
import history from '../../Helpers/history';
import {UserConstants} from '../Constants/UserConstants';

export const getAllUsers = () =>{
    return (dispatch, getState) => {
        const inprogress = () => {return { type: UserConstants.GETUSERS_REQUEST } }
        const success = users => { return { type: UserConstants.GETUSERS_SUCCESS , users} }
        const failure = msg => { return { type: UserConstants.GETUSERS_FAILURE , msg} }
        //awaiting server response
        dispatch(inprogress());
        //server response received
        UserService.getAllUsers().then(data =>{
            //deconstruct received data 
            const {status, users, msg} = data;
            //update redux store then redirect
            if(status){
                //authorize the user & set user role (in store)
                dispatch(success(users));
                console.log(users);
            }//either fail or some problem
            else{
                //the server will most likely inform us on the issue at hand
                dispatch(failure(msg));
            }
        })
    }
}

export const clearUsers = () =>{
    const clear = () => { return { type: UserConstants.CLEARUSERS_REQUEST} }
    return (dispatch, getState) => {
        dispatch(clear);
    }
}