import React, { Component } from "react";
import M from "materialize-css";
import {connect} from 'react-redux';

import {sendSignature, isSigned} from '../../Store/Actions/SuggestionActions';

//TODO it needs redux and refactoring
class SignSuggestion extends Component {

    //#region state
    state = {
        signData: {
            name: '',
            msg: '',
        },
        modalData:{
            case: '',
            status:'',
            initialized: false
        }
    }

    initStateCaseStatus(){
        
        this.props.isSigned(this.props.suggestionId).then(res =>{

            this.setState({
                ...this.state.signData,
                modalData: {                    
                    status: '',
                    case: res.status ? 'signed' : 'unsigned',
                    initialized: true
                }
            });
           
        });
    }
    //#endregion

    //#region modal 
    modalInstance;

    createModal = () => {
        //all parameters are specified in 'M'
        const options = {
            onOpenStart: () => {
              //console.log("Open Start");
              console.log(this.state.modalData.case);
            },
            onOpenEnd: () => {
              //console.log("Open End");
            },
            onCloseStart: () => {
              //console.log("Close Start");
            },
            onCloseEnd: () => {
                  if(this.state.modalData.status === 'success'){
                    this.initStateCaseStatus();
                    this.handleModalClose();
                  }
            },
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: false,
            startingTop: "4%",
            endingTop: "10%"
          };
          this.modalInstance = M.Modal.init(this.Modal, options);
    }
    //#endregion

    constructor(props) {
        super(props);  
    }

    //modal initialization after mounting component
    componentDidMount() {
       
        this.createModal();
        this.initStateCaseStatus();
    }
    
    //#region form methods
    handleSubmit = (e) =>{
        const reverse = this.state.modalData.case === 'signed';
        const newCase = reverse ? 'unsigned' : 'signed';

        this.props.sendSignature(this.state.signData.name, this.props.suggestionId, reverse)
        .then(response =>{

            const {status, msg} = response;

            this.setState({
                signData: {
                    ...this.state.signData,
                    msg       
                },
                modalData: {                    
                    ...this.state.modalData,
                    status: status ? 'success' : 'fail',
                    case: status ? newCase: this.state.modalData.case
                }
            });
           
            this.modalInstance.open();
        });
    }

    handleChange = (e) => {
        const n = e.target.id;
        const v = e.target.value;
        this.setState({
            signData: {
                ...this.state.signData,
                [n]: v
            },
            modalData: {                    
                ...this.state.modalData,
            }
        });

    }   
    
    handleModalClose = (e) =>{
        this.setState({
            signData: {
                name: '',
                msg: '',
            },
            modalData: {                    
                ...this.state.modalData,
            }
        });
    }
    //#endregion

    render() {

        //#region modal data
        let modalContent = {
            formTitle: '',
            formBody:'',
            formBtnText:'',
            extraMessageBody:'',

            triggerBtnClass: '',
            triggerBtnVal: '',

            successModalBody: ''
        }
        
        let modalButtonTrigger = null;

        if(this.state.modalData.initialized !== true){
            //we need the case before displaying modals / button to prevent visual glitches (e.g. button says 'signed' then 0.1s later 'reverse signature')
            this.initStateCaseStatus();
        }

        switch(this.state.modalData.case){
            case 'unsigned':
                modalContent.triggerBtnClass = 'waves-effect waves-light btn modal-trigger';
                modalContent.triggerBtnVal = 'Sign';

                modalContent.formTitle = 'Signing...';
                modalContent.formBody = 'If you like this suggestion, please enter your full name before signing.';
                modalContent.formBtnText = 'Sign';

                modalContent.successModalBody = 'We have recorded you reversing your signature.'
            break;
            case 'signed':
                modalContent.triggerBtnClass = 'waves-effect waves-red btn red modal-trigger';
                modalContent.triggerBtnVal = 'Reverse Signature';

                modalContent.formTitle = 'Reversing signature...';
                modalContent.formBody = 'To confirm reversing, please enter your full name.';
                modalContent.formBtnText = 'Reverse'

                modalContent.successModalBody = 'We have recorded you signature.'
            break;
        }

        switch(this.state.modalData.status){
            case 'fail':
                modalContent.extraMessageBody = 
                (
                    <div>
                        <br/>
                        <p className='red-text text-darken-2'>{this.state.signData.msg}</p>
                    </div>
                    
                );
            break;
            case 'success':
            break;
        }

        if(this.state.modalData.initialized === true){
            modalButtonTrigger = <a className={modalContent.triggerBtnClass} data-target="sign">{modalContent.triggerBtnVal}</a>
        }
      
        //#endregion

        //#region modal bodies
        const formModal = (
            <div>
            {
                //its a 'form' made from div because for some reason the form would have a weird format
            }
                <div>
                    
                        <div className="modal-content">

                            <h4>{modalContent.formTitle}</h4>
                            <p>{modalContent.formContent}</p>
                            
                            {modalContent.extraMessageBody}
                            
                            <div className='input-field'>
                                <label htmlFor='name'>Full name</label>
                                <input type='text' id='name' onChange={this.handleChange} value={this.state.signData.name}/>
                            </div>
                        
                        </div>

                        <div className="modal-footer">
                            <a onClick={this.handleModalClose} className="modal-close waves-effect waves-red btn-flat">Close</a>
                            <button onClick={this.handleSubmit} className="modal-close waves-effect waves-green btn-flat">{modalContent.formBtnText}</button>
                        </div>
                    
                </div>
            </div> 
        );

        const successModal = (
            <div>
                <div className="modal-content">
                    <h4>Thank you!</h4>
                        <p>{modalContent.successModalBody}</p>
                    </div>

                    <div className="modal-footer">
                        <a  className="modal-close waves-effect waves-green btn-flat">Close</a>
                    </div>
            </div>
        );

        //#endregion

        let modal = this.state.modalData.status === 'success' ? successModal : formModal;

        return (
            <div>
                {modalButtonTrigger}
                
                <div ref ={Modal => {this.Modal = Modal; }} id="sign" className="modal">
               
                    {modal}

                </div> 
            </div>
            
        );
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        sendSignature: (fullname, suggestionId, reverse) => dispatch(sendSignature(fullname, suggestionId, reverse)),
        isSigned:(suggestionId) => dispatch(isSigned(suggestionId))
    }
}

export default connect(null, mapDispatchToProps)(SignSuggestion);