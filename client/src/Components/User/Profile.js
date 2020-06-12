import React, {Component} from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom'

import {makeGetUserById} from '../../Store/Selectors/SelectUser';
import {Role,AuthState} from '../../Store/Constants/UserConstants';

class Profile extends Component{

    componentDidMount(){
        if(this.props.authState !== AuthState.TRUE || !this.props.isAdmin){
            this.props.history.push('/signin');
        }
    }

    render(){
        let {user} = this.props;
        console.log(user);
        const signedSuggestions = user.signedSuggestions.length > 0 ? user.signedSuggestions.map(signature=>{
            return(
                <NavLink class="collection-item" to={'/suggestion/'+signature.suggestionId}>{signature.suggestionTitle}</NavLink>
            );
            }) : null;

        return (
            <div className="container">
                <div className='card z-depth-1'>
                    <div className="card-content">
                    <h3 className = 'card-title'>User Details</h3>
                        <p>Full name: {user.fullName}</p>
                        <p>Username: {user.username}</p>
                    </div>
                </div>

                <div className='card z-depth-1'>

                    <div className="card-content">
                        <h3 className = 'card-title'>Suggestions signed by this user</h3>
                        <div className="collection">
                            {signedSuggestions}
                        </div>
                    </div>
                    
                </div>
            </div>
            
        )
    }
}

const getUserById = makeGetUserById();

const mapStateToProps = (state,props) => {
    return{
        user : getUserById(state,props),
        authState: state.auth.authState,
        isAdmin: state.auth.role === Role.ADMIN
    }
}

export default connect(mapStateToProps)(Profile);