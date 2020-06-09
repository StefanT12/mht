import React, { Component } from 'react'
import AuthService from '../../Services/AuthService';

class SignUp extends Component {

    state = {
        username:'',
        password:'',
        firstName:'',
        lastName:''
    }

    resetState = () =>{
        this.setState({
            username:'',
            password:'',
            firstName:'',
            lastName:''
        });
    }

    handleSubmit = (e) =>{
        //prevent reload
        e.preventDefault();
        
        AuthService.register(this.state).then(data=>{
            const {message} = data;

            this.resetState();

            if(!message.msgError){
                this.props.history.push('/signin');
            }
           
        });
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
                    <h5 className='grey-text text-darken-3'>Sign Up</h5>
                    <div className='input-field'>
                        <label htmlFor='username'>Email</label>
                        <input type='email' id='username' onChange={this.handleChange} value={this.state.username} />
                    </div>
                    <div className='input-field'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' onChange={this.handleChange} value={this.state.password}/>
                    </div>
                    <div className='input-field'>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' id='firstName' onChange={this.handleChange} value={this.state.firstName}/>
                    </div>
                    <div className='input-field'>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' id='lastName' onChange={this.handleChange} value={this.state.lastName}/>
                    </div>
                    <div className='input-field'>
                        <button className='btn pink lighten-1 z-depth-0'>Sign me Up!</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SignUp