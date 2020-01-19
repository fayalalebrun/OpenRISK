/**
 * @fileOverview Contains the PlayerEventSource class.
 * @name playerEventSource.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */



export class PlayerEventSource{

    /**
     * 
     * @param {function} callback Will be called whenever an event is fired. 
     */
    constructor(callback){
	this.callback = callback;
    }

    /**
      * @abstract 
      */
    sendMessage(msg){}

    //returns whether client should disconnect.
    onPlayerLeftGame(id){
	return true;
    }
}
