import { createSelector } from 'reselect';

const getSuggestions = state => state.suggestion.suggestions;
const getId = (_, props) => props.match.params.id;

export const makeGetSuggestionById = () => {
    return createSelector(
        getSuggestions,
        getId,
        (suggestions, id) => suggestions.find(aSuggestion => aSuggestion.id === id)
    );
}
