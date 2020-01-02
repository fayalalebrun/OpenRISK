import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {PlaceArmies} from "./placeArmies.js";
import * as util from '../util.js';

export class Attack extends StageHandler {

    static onPlayerEvent(event){
	if(event.attack){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }

	    let msg = event.attack;
	    let to = game.mapView.zoneMap[msg.to].node;
	    let from = game.mapView.zoneMap[msg.from].node;

	    Attack._calcAttack(to,from,msg.unitAmount);
	    
	} else if (event.attackEnd){
	    console.log('Attack stage ended');
	} else {
	    console.error('Unsupported event type received');
	}
    }

    static handleInput(currPlayer, zone, mapView, playerEventSource) {

	if(!currPlayer.isLocal){
	    return;
	}
	
	if(!zone){
	    Attack._clearAttackZones();
	} else if(Attack.attackZones.some(e=>e===zone)){
	    let from = Attack.attackFrom;
	    let amount = Math.min(from.node.troopNumber-1,
				  Number(window.prompt('Number of units(0-'+(from.node.troopNumber-1)+')')));
	    if(amount<1){
		return;
	    }

	    playerEventSource.sendMessage({attack:{from:from.node.colorID,
						   to:zone.node.colorID,
						   unitAmount:amount}});
	    Attack._clearAttackZones();
	    
	} else if (zone===Attack.attackFrom){	    
	    playerEventSource.sendMessage({attackEnd:true});
	} else if(zone.node.owner===currPlayer&&zone.node.troopNumber>1){
	    Attack._clearAttackZones();
	    Attack.attackFrom = zone;
	    let fromNodeIndex = map.nodes.findIndex(e=>e===zone.node);

	    for(let i = 0; i < map.connections.length;i++){
		if(map.connections[fromNodeIndex][i]&&i!=fromNodeIndex){
		    let toZone = mapView.zoneMap[map.nodes[i].colorID];
		    if(toZone.node.owner!=currPlayer){
			Attack.attackZones.push(mapView.zoneMap[map.nodes[i].colorID]);
		    }
		}
	    }
	    Attack.attackFrom.activateColor(2);
	    Attack.attackZones.forEach(z=>{
		z.activateColor(0);
	    });
	}
    }


    static _calcAttack(to, from, unitAmount){
	let attackerRollAmount = Math.min(3,unitAmount);
	let defenderRollAmount = Math.min(2,to.troopNumber);

	let attackerRolls = Attack._genRolls(attackerRollAmount);
	let defenderRolls = Attack._genRolls(defenderRollAmount);

	attackerRolls.sort((a,b)=>b-a);
	defenderRolls.sort((a,b)=>b-a);

	console.log('Attack result:');
 	console.log('Before '+from.troopNumber+' '+to.troopNumber);
	console.log('Defender');
	console.log(defenderRolls);
	console.log('Attacker');
	console.log(attackerRolls);
	

	for(let i = 0; i < Math.min(attackerRollAmount, defenderRollAmount); i++){	    
	    if(attackerRolls[i]>defenderRolls[i]){
		to.troopNumber--;
	    } else {
		unitAmount--;
		from.troopNumber--;
	    }
	}

	console.log('After '+from.troopNumber+' '+to.troopNumber);

	if(to.troopNumber==0){
	    to.owner = from.owner;
	    to.troopNumber = unitAmount;
	    from.troopNumber-=unitAmount;
	}
    }

    static _genRolls(amount){
	let arr = [];
	for(let i = 0; i < amount; i++){
	    arr.push(util.randomIntFromInterval(1,6,game.globalRand));
	}
	return arr;
    }

    static _clearAttackZones(){
	Attack.attackZones.forEach((z)=>{
	    z.deactivateAllColor();
	});
	Attack.attackZones = [];
	if(Attack.attackFrom){
	    Attack.attackFrom.deactivateAllColor();
	    Attack.attackFrom = null;
	}
    }

    static select(){
	game.setStageHandler(Attack);

	Attack.attackZones = [];
	
    }
}
