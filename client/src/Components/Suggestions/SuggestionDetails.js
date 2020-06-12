import React, {Component} from 'react';
import {connect} from 'react-redux';

import {makeGetSuggestionById} from '../../Store/Selectors/SelectSuggestion'
import SignSuggestion from './SignSuggestion';
import {processSignatureFromSSE} from '../../Store/Actions/SuggestionActions';
import {AuthState,Role} from '../../Store/Constants/UserConstants'
import ServerService from '../../Services/ServerService';
import SignatureList from './SignatureList';
class SuggestionDetails extends Component {
    
    componentDidMount(){
        if(this.props.authState === AuthState.TRUE){

            ServerService.subscribe('UPDATE_SIGNATURES', (signatureInfo)=>{
                this.props.processSignatureFromSSE(signatureInfo)},
                'updatevotes');

        }
        else{
            this.props.history.push('/signin');
        }
    }

    componentWillUnmount(){
        ServerService.unsubscribe('updatevotes');
    }

    render(){
        let {suggestion} = this.props;
       
        const nrOfSignatures = suggestion.signatures? suggestion.signatures.length : 0;
        const signaturesText = (nrOfSignatures < 1 || nrOfSignatures > 1) ? 'signatures' : 'signature';
        return (
            <div className = 'container section suggestion-details'>
                <div className='card z-depth-0'>
                    <div className='card-content'>
                        <span className='card-title'>{suggestion.title} <span className = 'teal-text text-lighten-2'>({nrOfSignatures+ ' ' + signaturesText})</span></span>
                        <p>{suggestion.content}</p>
                        <br/>
                        <SignatureList signatures={suggestion.signatures}/>
                        <SignSuggestion suggestionId={suggestion.id} />
                    </div>
                    <div>
                        <div className='card-action lighten-4 grey-text'>
                            <div>Posted by {suggestion.postedByName}</div>
                            <div>{suggestion.createdAt}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
        
    }
    
}
//cache the call, use memoization
const getSuggestionById = makeGetSuggestionById();

const mapStateToProps = (state,props) => {
    return{
        suggestion : getSuggestionById(state,props),
        authState: state.auth.authState,
        isAdmin: state.auth.role === Role.ADMIN
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        processSignatureFromSSE: (signatureInfo) => dispatch(processSignatureFromSSE(signatureInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionDetails);
