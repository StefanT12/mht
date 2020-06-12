import SSEFetcher from '../Helpers/SSEFetcher';

class AsyEvt {
    
    id = '';

    type = '';

    evtFunc = (data) =>{}

    constructor(id, evtFunc, type){
        this.id = id;
        this.evtFunc = evtFunc;
        this.type = type;
        //console.log(this);
    }
}

let sse;

let asyEvts = [];

let conDate;

export default {
    openSSEConnection: ()=>{
        let opts = {withCredentials:true}

        if(process.env.NODE_ENV === 'production'){
            sse = new SSEFetcher('https://salty-spire-65056.herokuapp.com/api/server/events', opts);
        }
        else{
            sse = new SSEFetcher('http://localhost:8080/api/server/events', opts);
        }

        conDate = Date.now();

        (async function() {
            while (true) {
                const message = await sse.nextMessage();

                for(let i =0; i < asyEvts.length; i++){
                    if(asyEvts[i].type ===message.type){
                        let jsData = JSON.parse(message.data);
                        if(!jsData.stamp < conDate){
                            asyEvts[i].evtFunc(jsData.object);
                        }
                    }
                }
            }
          })();
        
        },
    subscribe: (type, evtFunc, id)=>{
        if(!sse){
            console.log('Trying to subscribe without connection an event with id: '+ id + ', of type: ' + type + ' with func: ');
            return;
        }

        console.log(type);
        let asy = new AsyEvt(id, evtFunc, type);

        asyEvts.push(asy);
    },
    unsubscribe: (id) =>{
        let asy = asyEvts.find(anAsy => anAsy.id === id);
        if(asy){
            let newAsyList = asyEvts.filter(asy => asy.id !== id);
            asyEvts = newAsyList;
        }
        else{
            console.log('Could not find event with id: ' + id);
        }
    }
}