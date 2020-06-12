import React from 'react';
import {Collapsible, CollapsibleItem, Table} from 'react-materialize';

import {Role} from '../../Store/Constants/UserConstants'

import {connect} from 'react-redux'
import { NavLink } from 'react-router-dom'

const SignatureList = (props) => {
    
    const {signatures,isAdmin} = props;
    
    const list = signatures? signatures.map((signature,index)=>{
        return(
            <tr key={index}>
                <td>{signature.userfullname}</td>
                <td>{signature.signatureDate}</td>
                {!isAdmin? null :
                <NavLink class="collection-item" to={'/profile/'+signature.userid}>({signature.username})</NavLink>
                }
            </tr>
        );
        }) : null;

    if(signatures.length > 0){
        return(
       
            <div>
       
            <Collapsible accordion className='collapsible z-depth-1'>

                <CollapsibleItem expanded={false} header="So who signed this actually?" node="div">
                    <table class="striped">
                    <thead>
       
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                        </tr>
       
                    </thead>
       
                    <tbody>
                        {list} 
                    </tbody>
        
                    </table>
                    </CollapsibleItem>
                    
            </Collapsible>
            </div>
        );
    } else return null;    
}


const mapStateToProps = (state) =>{
    return{
        isAdmin: state.auth.role === Role.ADMIN
    }
}

export default connect(mapStateToProps)(SignatureList);
