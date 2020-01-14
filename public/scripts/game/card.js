import * as util from "./util.js";

export class Card{    
    constructor(node, type){
	this.node = node;
	this.type = type;
    }

    static createDeck(nodes, rand){	
	let typeGen = Card._giveTypes();
	let deck = nodes.map(n=>new Card(n,typeGen.next().value));
	util.shuffle(deck, rand);
	return deck;
    }

    static* _giveTypes(){
	let i =0;
	while(true){
	    yield i%3;
	    i++;
	}
    }

    static* _turnInValue(){
	
	for(let e of [4,6,8,10,12]){
	    yield e;
	}
	
	for(let i = 15;;i+=5){
	    yield i;
	}
    }
}

Card.INFANTRY = 0;
Card.CAVALRY = 1;
Card.ARTILLERY = 2;
Card.turnInGenerator = Card._turnInValue();
