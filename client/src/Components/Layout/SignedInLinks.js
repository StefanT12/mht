import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom'

import {connect} from 'react-redux';
import {logout} from '../../Store/Actions/AuthActions';

const SignedInLinks = (props) =>{

    const onClickLogoutHandler = ()=>{
        props.logout();
    }

    return (
        <ul className='right'>
            <li><NavLink to='/createsuggestion'>New Suggestion</NavLink></li>
            <li><NavLink to='/signin' onClick={onClickLogoutHandler}>Log Out</NavLink></li>
            <li><NavLink to='/' className='btn btn-floating pink lighten-1'>mH</NavLink></li>
        </ul>
    )
}


const mapDispatchToProps = (dispatch) =>{
    return{
        logout: (user) => dispatch(logout())
    }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);