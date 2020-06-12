import React from 'react';
import { NavLink } from 'react-router-dom'

const Users = ({users}) => {
    console.log(users);
    if(users){
        return(
            <div class = 'container'>
                <h3 >Users</h3>

                {users.length > 0 && users.map(user=>{
                    //don't bother mapping if suggestions is null
                    return (
                        <div className='card z-depth-1'>
                            <div className = 'card-content grey-text text-darken-3'>
                                <NavLink  className='card-title' to={'/profile/'+user.userid}>{user.username}</NavLink>
                            </div>
                        </div>
                    )
                })}
                
            </div>
        )
    }else return null;

   
}

export default Users

