import { createSelector } from 'reselect';

const getUsers = state => state.user.users;
const getId = (_, props) => props.match.params.id;

export const makeGetUserById = () => {
    return createSelector(
        getUsers,
        getId,
        (users, id) => {
            console.log(users);
            console.log(id);
            return users.find(aUser => aUser.userid === id);
        }
    );
}
