export class Player{
    constructor(id, nick, isLocal, color, unitPool){
	this.id = id;
	this.nick = nick;
	this.isLocal = isLocal;
	this.color = color;
	this.unitPool = unitPool;
	this.ownedNodes=[];
	this.cards = [];
    }
}
