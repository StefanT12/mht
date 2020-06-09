import SSEFetcher from '../Helpers/SSEFetcher';

class AsyEvt {
    
    stop = false;

    id = '';

    type = '';

    evtFunc = (data) =>{}

    constructor(id, evtFunc, type){
        this.id = id;
        this.evtFunc = evtFunc;
        this.type = type;
    }

    async evt(sse) {
        if(!sse) return;

        const message = await sse.nextMessage();

         //recursive re-iteration on receiving a message
        if(!this.stop && message){
            if(message.type === this.type ){
                let jsData = JSON.parse(message.data);
                //no older messages allowed
                if(!jsData.stamp < conDate){
                    this.evtFunc(jsData.object);
                }
            }
            this.evt(sse);
        }
    }
}

let sse;

let asyEvts = [];

let conDate;

export default {
    openSSEConnection: ()=>{
        let opts = {withCredentials:true}

        let url = 'http://localhost:8080/api/server/events';
        if(process.env.NODE_ENV === 'Production'){
            url = 'https://salty-spire-65056.herokuapp.com/api/server/events'
        }
        
        sse = new SSEFetcher(url, opts);
        conDate = Date.now();
    },
    subscribe: (type, evtFunc, id)=>{
        if(!sse){
            console.log('Trying to subscribe without connection an event with id: '+ id + ', of type: ' + type + ' with func: ');
            console.log(evtFunc);
            return;
        }
        
        let asy = new AsyEvt(id, evtFunc, type);
        asy.evt(sse);

        asyEvts.push(asy);
    },
    unsubscribe: (id) =>{
        let asy = asyEvts.find(anAsy => anAsy.id === id);
        if(asy){
            asy.stop = true;
            console.log(asy);
            let newAsyList = asyEvts.filter(asy => asy.id !== id);
            asyEvts = newAsyList;
            asy = null;
        }
        else{
            console.log('Could not find event with id: ' + id);
        }
    }
}