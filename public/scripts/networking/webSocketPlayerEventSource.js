/**
 * @name webSocketPlayerEventSource.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {PlayerEventSource} from "./playerEventSource.js";

export class WebSocketPlayerEventSource extends PlayerEventSource {
    constructor(callback, socket){
	super(callback);
	this.socket = socket;
	socket.onmessage = ((event)=>{
	    let msg = JSON.parse(event.data);
	    if(msg.playerMessage){
		callback(msg.playerMessage);
	    } else if (msg.playerLeftGame) {
		socket.close();
	    } else {
		console.log('Received non-supported message: ');
		console.log(msg);
	    }
	});
    }

    sendMessage(msg){
	this.socket.send(JSON.stringify({playerMessage:msg}));
    }
}
