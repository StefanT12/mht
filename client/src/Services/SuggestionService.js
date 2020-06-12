export default {
    postNewSuggestion: suggestion=>{
        return fetch('/api/suggestion/newsuggestion', {
            method:'post',
            body: JSON.stringify(suggestion),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return { status: false}
        })
    },
    getSuggestions: ()=>{
        return fetch('/api/suggestion/getsuggestions')
        .then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return {status: false, msg: 'unauthorized', suggestions: {} }
        });
    },
    signSuggestion: signingDetails =>{
        return fetch('/api/suggestion/sign', {
            method:'post',
            body: JSON.stringify(signingDetails),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return {status: false, msg: 'unauthorized', case: ''}
        });
    },

    unsignSuggestion: signingDetails =>{
        return fetch('/api/suggestion/unsign', {
            method:'post',
            body: JSON.stringify(signingDetails),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return {status: false, msg: 'unauthorized', case: ''}
        });
    },

    isSigned: suggestionId =>{
        return fetch(`/api/suggestion/suggestionissigned/${suggestionId}`, {
        }).then(res=>{
            if(res.status !== 401)//written already
                return res.json().then(data => data);
            else//default unauthorized response
                return {status: false, msg: 'unauthorized'}
        });
    }

}