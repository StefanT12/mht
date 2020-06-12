import {AuthState, UserConstants} from '../Constants/UserConstants'

const initState = {
    authState: AuthState.FALSE,
    role: ''
}

const AuthReducer = (state = initState, action) =>{

    switch(action.type){
        case UserConstants.LOGIN_REQUEST:   
        return{
            authState: AuthState.INPROGRESS,
            role:''
        }

        case UserConstants.LOGIN_SUCCESS:
        return{
            authState: AuthState.TRUE,
            role: action.user.role
        }

        case UserConstants.LOGIN_FAILURE:
        console.log(action.message);
        return{
            authState: AuthState.FALSE,
            ...state.role
        }

        case UserConstants.LOGOUT:
        return{
            authState: AuthState.FALSE,
            role: ''
        }

        case UserConstants.AUTHENTICATED:
        return{
            authState: AuthState.TRUE,
            ...state.role
        }

        case UserConstants.UNAUTHORISED:
        return{
            authState: AuthState.TRUE,
            role: ''
        }

        default:
    }

    return state;
}

export default AuthReducer;