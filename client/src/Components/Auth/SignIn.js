import React, { Component } from 'react';
import {connect} from 'react-redux';
import {login} from '../../Store/Actions/AuthActions';

class SignIn extends Component {

    state = {
        username:'',
        password:''
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.login(this.state);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value//change the state with name = id to event value
        })
    }    

    render() {
        return (
            <div className='container'>
                <form onSubmit={this.handleSubmit} className='white'>
                    <h5 className='grey-text text-darken-3'>Sign In</h5>
                    <div className='input-field'>
                        <label htmlFor='username'>Email</label>
                        <input type='email' id='username' onChange={this.handleChange} />
                    </div>
                    <div className='input-field'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' onChange={this.handleChange} />
                    </div>
                    <div className='input-field'>
                        <button className='btn pink lighten-1 z-depth-0'>Login</button>
                    </div>
                </form>
            </div>
        )
    }
    
}

const mapDispatchToProps = (dispatch) =>{
    return{
        login: (user) => dispatch(login(user))
    }
}

export default connect(null, mapDispatchToProps)(SignIn)
