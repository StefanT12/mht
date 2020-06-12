
class sseSingleton{
    //singleton
    constructor() {
        if (!!sseSingleton.instance) {
            return sseSingleton.instance;
        }

        sseSingleton.instance = this;

        this.clients = new Array();

        return this;
    }

    clients = [];
    //we set up the header ahead of time
    subscribe(req, res, id){

         //allow multiple origins by checking origin of request against allowed origins.
         let headerOrigin = '';
         let allowedOrigins = ['http://localhost:3000', 'https://salty-spire-65056.herokuapp.com'];
         let origin = req.headers.origin;
         if(allowedOrigins.indexOf(origin) > -1){
            headerOrigin = origin; 
            res.setHeader('Access-Control-Allow-Origin', origin);
         }
        
        // Mandatory headers and http status to keep connection open
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Headers':"Content-Type, Allow, Authorization, X-Args",
            'Access-Control-Allow-Origin' : headerOrigin,
            'Access-Control-Allow-Credentials': "true"
        };
        
        res.writeHead(200, headers);

        res.flushHeaders();
        // save id and save res
        // object of client connection on clients list
        // Later we'll iterate it and send updates to each client
        const newClient = {
            id,
            res
        };

        console.log('User with id ' + id + ' connected');

        this.clients.push(newClient);
        // When client closes connection we update the clients list
        // avoiding the disconnected one
        req.on('close', () => {
            console.log('User with id ' + id + ' closed his connection on close tab or refresh.');
            this.unsubscribe(id);
        });
    }

    unsubscribe(id){
        let newClients = this.clients.filter(c => c.id !== id);
        console.log('User with id ' + id + ' closed his connection on logout.');
        this.clients = newClients;
    }

    pushToAll(data, type){
        //add timestamp
        let dataWStamp = {
            object: data,
            stamp: Date.now()
        }
        
        //prepare for writing
        let cData = `data: ${JSON.stringify(dataWStamp)}\n`;
        let cType = `event: ${type}\n\n`;
        this.clients.forEach(c => {
            c.res.write(cData);
            //because of \n\n in 'cType', the response will be sent automatically upon writing this 
            c.res.write(cType);
        });
    }
}

const i = new sseSingleton()

const et = {
    UPDATE_STORE:'UPDATE_STORE',
    UPDATE_SIGNATURES: 'UPDATE_SIGNATURES'
}

module.exports = {instance: i, eventTypes: et };

