import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import * as mapFunctions from "../mapFunctions.js";
import {Attack} from "./attack.js";

export class PlaceArmies extends StageHandler {

    static onPlayerEvent(event){
	if(event.placeArmies){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }

	    let msg = event.placeArmies;

	    let player = game.players.find(e=>e.id==msg.playerID);
	    let node = map.nodes.find(e=>e.colorID==msg.nodeID);

	    if(player&&node&&node.owner===player&&player.unitPool>=msg.placeAmount){
		let unitsToPlace = msg.placeAmount;
		player.unitPool-=unitsToPlace;
		node.troopNumber+=unitsToPlace;


		if(player.unitPool===0){
		    console.log('PlaceArmies stage complete');
		    Attack.select();
		}
	    } else {
		console.error('Invalid PlaceArmies message');
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
	    let unitsToPlace = Math.min(currPlayer.unitPool,
					    Number(window.prompt('Units (0-'+currPlayer.unitPool+')')));
	    playerEventSource.sendMessage({placeArmies:{playerID:currPlayer.id, nodeID:zone.node.colorID, placeAmount:unitsToPlace}});
	}
    }

    static select(){
	game.setStageHandler(this);
	this._calcAndAddArmies();
    }

    static _calcAndAddArmies(){
	let player = game.currPlayer;
	let territorialBonus = Math.max(3,player.ownedNodes.length/3);
	let continentalBonus = 0;
	let map = mapFunctions.map;

	Object.values(map.zones).forEach((zone)=>{
	    if(zone.nodes.every(n=>map.nodes[n].owner===player)){
		continentalBonus+=zone.bonus;
	    }
	});

	player.unitPool+=territorialBonus+continentalBonus;
    }
}
