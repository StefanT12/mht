import {UserConstants} from '../Constants/UserConstants';

const initState = {
    users:[]
}

const UserReducer = (state = initState, action) => {
    switch(action.type){
        case UserConstants.GETUSERS_FAILURE:
        console.log(action.msg)
        break;
        
        case UserConstants.GETUSERS_SUCCESS:
        return{
            users: action.users
        }
        break;   
        
        case UserConstants.CLEARUSERS_REQUEST:
        return{
           users: []
        }
        break;   
    }
    return state;
}

export default UserReducer;