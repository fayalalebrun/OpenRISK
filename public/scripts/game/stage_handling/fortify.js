import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {PlaceArmies} from "./placeArmies.js";

export class Fortify extends StageHandler {

    static onPlayerEvent(event){
	if(event.fortify){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }
	    console.log(event);
	    let msg = event.fortify;	    
	    if(msg.from){
		let to = game.mapView.zoneMap[msg.to].node;
		let from = game.mapView.zoneMap[msg.from].node;
		if(to.owner!=from.owner||msg.unitAmount<0||from.troopNumber<=msg.unitAmount){
		    console.error('Malformed fortify');
		} else {
		    from.troopNumber-=msg.unitAmount;
		    to.troopNumber+=msg.unitAmount;
		    console.log('movement done');
		    setTimeout(function() {
			new Audio("../../res/march.ogg").play();
		    }, 10);
		    
		}
		
		
	    }
	    
	    console.log('Fortify stage done');

	    if (map.nodes.every(n=>n.owner==game.currPlayer)){		
		console.log(game.currPlayer.nick+" has won the game");

		if(game.currPlayer.isLocal){
		    $('.winScreen > div').html('You have won the game!<br/>'+
						'All of your opponents now stand eliminated. '+
						'You are the sole controller of the world.');
		} else {
		    $('.winScreen > div').html(game.currPlayer.nick + ' has won the game<br/>'+
						'All other factions are no more.');
		}
		$('.winScreenWrapper').css('display','flex').hide().fadeIn();
		
	    }

	    $('.endPhaseButton').fadeOut();
	    game.nextPlayer();
	    PlaceArmies.select();
	} else {
	    console.error('Unsupported event type received');
	}
    }

    static handleInput(currPlayer, zone, mapView, playerEventSource) {
	if(!currPlayer.isLocal){
	    return;
	}
	
	if(!zone){
	    Fortify._clearReachableZones();
	    $('.troopNumPanel').fadeOut();
	} else if (Fortify.reachableZones.some(e=>e===zone)){
 	    let from = Fortify.fortifyFrom;
	    let amount = Math.min(from.node.troopNumber-1,
				  Math.round($('#troopsPlaceRange').val()));
	    playerEventSource.sendMessage({fortify:{from:from.node.colorID,
						    to:zone.node.colorID,
						    unitAmount:amount}});
	    
	    Fortify._clearReachableZones();
	    $('.troopNumPanel').fadeOut();
	    $('.endPhaseButton').fadeOut();
	} else if (zone == Fortify.fortifyFrom||currPlayer.ownedNodes.every(e=>e.troopNumber<=1)){
	    
	} else if (zone.node.owner===currPlayer&&zone.node.troopNumber>1){
	    Fortify._clearReachableZones();
	    Fortify.fortifyFrom = zone;
	    let fromNodeIndex = map.nodes.findIndex(e=>e===zone.node);
	    let visMap = {};
	    Fortify._getReachableNodes(fromNodeIndex,visMap);



	    Fortify.reachableZones = Object.entries(visMap).filter(([k,v])=>k!=fromNodeIndex)
		.map(([k,v])=>game.mapView.zoneMap[v.colorID]);

	    Fortify.fortifyFrom.activateColor(2);

	    Fortify.reachableZones.forEach((e)=>e.activateColor(1));

	    $('.troopNumPanel').fadeIn();
	    Fortify._updateSlider(zone);
	}
	
    }

    static _updateSlider(zone){
	if(Math.round($('#troopsPlaceRange').val())>zone.node.troopNumber-1){
	    document.getElementById("troopsPlaceRange").value = zone.node.troopNumber-1;
	    $('#troopNumLabel').text(Math.round($('#troopsPlaceRange').val()));
	}

	document.getElementById("troopsPlaceRange").max = zone.node.troopNumber-1;
	$('#troopsPlaceRange').on('input',()=>{
	    $('#troopNumLabel').text(Math.round($('#troopsPlaceRange').val()));
	});
	$('#troopOne').click(()=>{
	    $('#troopNumLabel').text(1);
	    document.getElementById("troopsPlaceRange").value = 1;
	});

	$('#troopAll').click(()=>{
	    $('#troopNumLabel').text(zone.node.troopNumber-1);
	    document.getElementById("troopsPlaceRange").value = zone.node.troopNumber-1;
	});
    }

    static _getReachableNodes(nodeIndex, visitedNodeMap){
	visitedNodeMap[nodeIndex] = map.nodes[nodeIndex];

	for(let i = 0; i < map.connections.length; i++){
	    let from = map.nodes[nodeIndex];
	    let to = map.nodes[i];
	    if(from.owner==to.owner&&map.connections[nodeIndex][i]&&!(i in visitedNodeMap)){
		Fortify._getReachableNodes(i, visitedNodeMap);
	    }
	}
    }
    
    static _clearReachableZones(){
	Fortify.reachableZones.forEach((z)=>{
	    z.deactivateAllColor();
	});
	Fortify.reachableZones = [];
	if(Fortify.fortifyFrom){
	    Fortify.fortifyFrom.deactivateAllColor();
	    Fortify.fortifyFrom = null;
	}
    }

    static select(){
	game.setStageHandler(this);
	
	Fortify.reachableZones = [];


	if(game.currPlayer.isLocal){
	    setTimeout(()=>{
		$('.endPhaseButton').css('display','flex').hide().fadeIn();
		$('.endPhaseButton').click(()=>{
		    Fortify._clearReachableZones();
		    console.log('sent it');
		    game.gamePlayerEventSource.sendMessage({fortify:{}});
		    $('.troopNumPanel').fadeOut();
		    $('.endPhaseButton').off();
		});
	    },500);
	}
	Fortify._printStatus();
    }

    static _printStatus(){
	let player = game.currPlayer;
	let string = player.nick;
	
	if(game.currPlayer.isLocal){
	    string+="(You)";
	}
	string+=': Fortifying.';
	game.setGameStatus(string,player.color);
    }
}
