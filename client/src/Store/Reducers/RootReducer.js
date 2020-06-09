import {combineReducers} from 'redux';

import AuthReducer from './AuthReducer';
import SuggestionReducer from './SuggestionReducer';

const RootReducer = combineReducers({
    auth: AuthReducer,
    suggestion: SuggestionReducer
});

export default RootReducer;