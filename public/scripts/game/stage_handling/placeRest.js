import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {PlaceArmies} from "./placeArmies.js";

export class PlaceRest extends StageHandler {

    static onPlayerEvent(event){
	if(event.placeRest){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }

	    let msg = event.placeRest;

	    let player = game.players.find(e=>e.id==msg.playerID);
	    let node = map.nodes.find(e=>e.colorID==msg.nodeID);

	    if(player&&node&&node.owner===player){
		let unitsToPlace = Math.min(player.unitPool,3);
		player.unitPool-=unitsToPlace;
		node.troopNumber+=unitsToPlace;

		game.nextPlayer();

		PlaceRest._printStatus();

		if(game.players.every(e=>e.unitPool===0)){
		    console.log('PlaceRest stage complete');
		    PlaceArmies.select();
		}
	    }
	} else {
	    console.error('Unsupported event type received');
	}
    }

    static handleInput(currPlayer, zone, mapView, playerEventSource) {
	if(!zone){
	    return;
	}
	if(currPlayer.isLocal&&zone.node.owner===currPlayer){
	    playerEventSource.sendMessage({placeRest:{playerID:currPlayer.id, nodeID:zone.node.colorID}});
	}
    }

    static select(){
	game.setStageHandler(this);
	PlaceRest._printStatus();
    }

        static _printStatus(){
	let player = game.currPlayer;
	let string = player.nick;
	
	if(game.currPlayer.isLocal){
	    string+="(You)";
	}
	string+=': Placing three armies.';
	game.setGameStatus(string,player.color);
    }

}
