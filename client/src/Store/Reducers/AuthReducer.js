import {AuthState, UserConstants} from '../Constants/UserConstants'

const initState = {
    authState: AuthState.FALSE,
}

const AuthReducer = (state = initState, action) =>{

    switch(action.type){
        case UserConstants.LOGIN_REQUEST:   
        return{
            authState: AuthState.INPROGRESS,
        }

        case UserConstants.LOGIN_SUCCESS:
        return{
            authState: AuthState.TRUE,
        }

        case UserConstants.LOGIN_FAILURE:
        return{
            authState: AuthState.FALSE,
        }

        case UserConstants.LOGOUT:
        return{
            authState: AuthState.FALSE,
        }

        case UserConstants.AUTHENTICATED:
        return{
            authState: AuthState.TRUE,
        }

        case UserConstants.UNAUTHORISED:
        return{
            authState: AuthState.TRUE,
        }

        default:
    }

    return state;
}

export default AuthReducer;