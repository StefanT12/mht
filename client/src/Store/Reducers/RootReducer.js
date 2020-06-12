import {combineReducers} from 'redux';

import AuthReducer from './AuthReducer';
import SuggestionReducer from './SuggestionReducer';
import UserReducer from './UserReducer';

const RootReducer = combineReducers({
    auth: AuthReducer,
    suggestion: SuggestionReducer,
    user: UserReducer
});

export default RootReducer;