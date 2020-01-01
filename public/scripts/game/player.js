export class Player{
    constructor(id, nick, isLocal, color){
	this.id = id;
	this.nick = nick;
	this.isLocal = isLocal;
	this.color = color;
	this.ownedNodes=[];
    }
}
