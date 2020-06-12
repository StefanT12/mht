export default {

    getAllUsers: ()=>{
        return fetch('/api/user/allusers')
        .then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return {status: false, users: [], msg: 'unauthorized' }
        });
    }
}