import React, {Component} from 'react';
import {connect} from 'react-redux'

import Notifications from './Notifications'
import Users from './Users'
import SuggestionList from '../Suggestions/SuggestionList'
import {getSuggestions, clearSuggestions, addSuggestionFromSSE, processSignatureFromSSE} from '../../Store/Actions/SuggestionActions';
import {getAllUsers, clearUsers} from '../../Store/Actions/UserActions';
import {AuthState, Role} from '../../Store/Constants/UserConstants'

import ServerService from '../../Services/ServerService';

class Dashboard extends Component{

    componentDidMount(){
        //announce redux it needs a state update
        if(this.props.authState === AuthState.TRUE){
            this.props.getSuggestion();
            this.props.getAllUsers();

            ServerService.subscribe('UPDATE_STORE', (suggestion)=>{
                this.props.addSuggestionFromSSE(suggestion)},
                'addsuggestion');

            ServerService.subscribe('UPDATE_SIGNATURES', (signatureInfo)=>{
                this.props.processSignatureFromSSE(signatureInfo);
            }, 'updatevotesfromDash');
        }
        else{
            this.props.history.push('/signin');
        }
    }

    componentWillUnmount(){
        ServerService.unsubscribe('addsuggestion');
        ServerService.unsubscribe('updatevotesfromDash');
    }

    componentDidUpdate(){
        if(this.props.authState !== AuthState.TRUE){
            this.props.clearSuggestions();
            this.props.clearUsers();
            this.props.history.push('/signin');
        }
    }

    render(){

        const {suggestions, users, isAdmin}=this.props;
        console.log(this.props.role === Role.ADMIN);
        const rightColumn = isAdmin?
        (<div className='col s12 m5 offset-m1'>
            <Users users={users} />
        </div>
        ) :(
            <div>
                <Notifications users={users}/>
            </div>
        );  

        return(
           <div className='dashboard container'>
            <div className='row'>

                <div className='col s12 m6'>
                    <SuggestionList suggestions={suggestions}/>
                </div> 
                      

               {rightColumn}       
    
            </div>
           </div> 
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        suggestions: state.suggestion.suggestions,
        authState: state.auth.authState,
        isAdmin: state.auth.role === Role.ADMIN,
        users: state.user.users,
        role: state.auth.role
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getSuggestion: () => dispatch(getSuggestions()),
        clearSuggestions: () => dispatch(clearSuggestions()),
        addSuggestionFromSSE: (suggestion) => dispatch(addSuggestionFromSSE(suggestion)),
        processSignatureFromSSE: (signatureInfo) => dispatch(processSignatureFromSSE(signatureInfo)),

        getAllUsers: () => dispatch(getAllUsers()),
        clearUsers: () => dispatch(clearUsers()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);