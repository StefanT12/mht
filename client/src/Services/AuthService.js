export default {

    login: user =>{
        return fetch('/api/user/login', {
            method:'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return { isAuthenticated: false, user : {username:'', role:''}}
        })
    },

    register: user =>{
        return fetch('/api/user/register', {
            method:'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
          .then(data => data);
    },

    logout: ()=>{
        return fetch('/api/user/logout')
            .then(res => res.json())
            .then(data => data)
    },

    isAuthenticated: ()=>{
        return fetch('/api/user/authenticated')
        .then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return { isAuthenticated: false, user : {username:'', role:''}}
        });
    },

    isAdmin: ()=>{
        return fetch('/api/user/isadmin')
        .then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return { isAdmin: false, user : {username:'', role:''}}
        });
    }
}