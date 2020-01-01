export class Player{
    constructor(id, nick, isLocal){
	this.id = id;
	this.nick = nick;
	this.isLocal = isLocal;
	this.ownedNodes=[];
    }
}
