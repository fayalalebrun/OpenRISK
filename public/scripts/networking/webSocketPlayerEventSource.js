/**
 * @name webSocketPlayerEventSource.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

export class WebSocketPlayerEventSource {
    constructor(callback, socket){
	super(callback);
	socket.onmessage = ((event)=>{
	    let msg = JSON.parse(event.data);
	    if(msg.playerMessage){
		this.callback(msg.playerMessage);
	    } else {
		console.log('Received non-supported message: ' + msg);
	    }
	});
    }
}
