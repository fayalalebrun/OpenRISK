import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {PlaceRest} from "./placeRest.js";

export class TakeOne extends StageHandler{
    static onPlayerEvent(event){
	if(event.takeOne){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }
	    
	    let msg = event.takeOne;
	    let player = game.players.find(e=>e.id==msg.playerID);
	    let node = map.nodes.find(e=>e.colorID==msg.nodeID);
	    if(player&&node&&player.unitPool>0){
		player.unitPool--;
		player.ownedNodes.push(node);
		node.owner = player;
		node.troopNumber++;
		game.nextPlayer();

		if(map.nodes.every(e=>e.owner!=null)){
		    console.log('TakeOne stage complete');
		    PlaceRest.select();
		}
	    } else {
		console.assert(player,"Player not found: "+msg.playerID);
		console.assert(node, "Map node not found: "+msg.nodeID);
		console.error('Received message to place unit where no unit could be placed');
	    }
	} else {
	    console.error('Unsupported event type received');
	}
    }

    static handleInput(currPlayer, zone, mapView, playerEventSource) {
	if(!zone){
	    return;
	}
	if(currPlayer.isLocal&&zone.node.owner===null){
	    playerEventSource.sendMessage({takeOne:{playerID:currPlayer.id, nodeID:zone.node.colorID}});
	}
    }

    static select(){
	game.setStageHandler(this);
    }
}
