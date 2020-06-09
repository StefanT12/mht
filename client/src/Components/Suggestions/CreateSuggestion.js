import React, { Component } from 'react';
import {connect} from 'react-redux';
import {createSuggestion} from '../../Store/Actions/SuggestionActions';
import {AuthState} from '../../Store/Constants/UserConstants'

export class CreateSuggestion extends Component {

    state = {
        statusMsg:'',

        suggestion: {
            title:'',
            content:''
        }
    }

    componentDidMount(){
        if(this.props.authState !== AuthState.TRUE){
            this.props.history.push('/signin');
        }
    }

    componentDidUpdate(){
        if(this.props.authState !== AuthState.TRUE){
            this.props.history.push('/signin');
        }
    }

    handleSubmit = (e) =>{
        //prevent reload
        e.preventDefault();
        //dispatch action as promise
        this.props.createSuggestion(this.state.suggestion).then(res=>{
            const {status,msg} = res;
            //its most likely the same title as other suggestions, we will keep the values and let the user make additional changes
            if(!status){
                this.setState({
                    ...this.state.suggestion,
                    statusMsg:msg
                });
            }
            else{//we reset the form
                this.setState({

                    suggestion: {
                        title:'',
                        content:''
                    },

                    statusMsg: msg
                });
            }
        });
        
    }

    handleChange = (e) => {
        
        this.setState({
            suggestion: {
                ...this.state.suggestion,
                [e.target.id]: e.target.value//change the state with name = id to event value
            },
            ...this.state.statusMsg 
        });
    }    

    render() {
        return (
            <div className='container'>
                <form onSubmit={this.handleSubmit} className='white'>
                    <h5 className='grey-text text-darken-3'>Create a new suggestion</h5>
                    <div className='input-field'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' id='title' onChange={this.handleChange} value={this.state.suggestion.title} />
                    </div>
                    <div className='input-field'>
                        <label htmlFor='content'>Content</label>
                        <textarea id='content' className='materialize-textarea' onChange={this.handleChange}  value={this.state.suggestion.content}></textarea>
                    </div>
                    <div className='input-field'>
                        <button className='btn pink lighten-1 z-depth-0'>Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        authState: state.auth.authState
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        //map a function 'Suggestion' to an arrow func that accepts a param 'suggestion'
        //which dispatches the redux action 'createSuggestion' with that accepted param
        createSuggestion: (suggestion) => dispatch(createSuggestion(suggestion))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSuggestion);