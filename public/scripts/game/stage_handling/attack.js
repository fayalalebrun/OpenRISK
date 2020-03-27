import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {Fortify} from "./fortify.js";
import * as util from '../util.js';

export class Attack extends StageHandler {

    static onPlayerEvent(event){
	
	if(event.playerID!=game.currPlayer.id){
	    console.error('Received message from wrong player');
	    return;
	}
	
	if(event.attack){

	    let msg = event.attack;
	    let to = game.mapView.zoneMap[msg.to].node;
	    let from = game.mapView.zoneMap[msg.from].node;

	    Attack._calcAttack(to,from,msg.unitAmount);

	    setTimeout(function() {
		new Audio("../../res/dice.ogg").play();
	    }, 10);
	    $('.attackResPanel').css('display','flex').hide().fadeIn();
	    
	} else if (event.attackEnd){
	    console.log('Attack stage ended');

	    $('.attackResPanel').fadeOut();
	    $('.endPhaseButton').fadeOut();

	    if(game.currPlayer.tookTerritory&&game.cardDeck.length>0){
		let card = game.cardDeck.pop();
		game.currPlayer.cards.push(card);
		console.log(game.currPlayer.nick+' took card '+card.node.name);
	    }

	    game.currPlayer.tookTerritory=false;


	    game.filterPlayers(p=>p.ownedNodes.length>0);
	    
	    Fortify.select();
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
	    $('.troopNumPanel').fadeOut();
	} else if(Attack.attackZones.some(e=>e===zone)){
	    let from = Attack.attackFrom;
	    let amount = Math.min(from.node.troopNumber-1,
				  Math.round($('#troopsPlaceRange').val()));
	    if(amount<1){
		return;
	    }

	    playerEventSource.sendMessage({attack:{from:from.node.colorID,
						   to:zone.node.colorID,
						   unitAmount:amount}});
	    Attack._clearAttackZones();

	    $('.troopNumPanel').fadeOut();
	    
	} else if (zone===Attack.attackFrom||currPlayer.ownedNodes.every(e=>e.troopNumber<=1)){	    

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
	    $('.attackResPanel').fadeOut(()=>{$('.troopNumPanel').fadeIn();});
	    Attack._updateSlider(zone);
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
	
	let attackUnitsLost = {attacker:0,defender:0};
	for(let i = 0; i < Math.min(attackerRollAmount, defenderRollAmount); i++){	    
	    if(attackerRolls[i]>defenderRolls[i]){
		to.troopNumber--;
		attackUnitsLost.defender++;
	    } else {
		unitAmount--;
		from.troopNumber--;
		attackUnitsLost.attacker++;
	    }
	}

	console.log('After '+from.troopNumber+' '+to.troopNumber);

	Attack._updateResultsDisplay(to, from, attackerRolls, defenderRolls, attackUnitsLost);

	if(to.troopNumber==0){
	    to.owner.ownedNodes.splice(to.owner.ownedNodes.indexOf(to),1);
	    to.owner = from.owner;
	    from.owner.ownedNodes.push(to);
	    to.troopNumber = unitAmount;
	    from.troopNumber-=unitAmount;
	    from.owner.tookTerritory=true;
	}


    }

    static _updateResultsDisplay(to, from, attackerRolls, defenderRolls, attackUnitsLost) {
	$('.attackerLabel').text(from.owner.nick).css('color',from.owner.color);
	$('.defenderLabel').text(to.owner.nick).css('color',to.owner.color);
	$('.originDestination .toLabel').text(to.name).css('color',to.owner.color);
	$('.originDestination .fromLabel').text(from.name).css('color',from.owner.color);

	let lowestAmountOfDice = Math.min(attackerRolls.length, defenderRolls.length);

	console.log(lowestAmountOfDice);
	
	for(let i = 0; i<attackerRolls.length; i++){
	    $('.attackerDice img:nth-child('+(i+1)+')').attr('src','res/dice'+attackerRolls[i]+'.svg');
	    $('.attackerDice img:nth-child('+(i+1)+')').show();
	}
	
	for(let i = attackerRolls.length; i<3;i++){
	    $('.attackerDice img:nth-child('+(i+1)+')').hide();
	}

	for(let i = 0; i<defenderRolls.length; i++){
	    $('.defenderDice img:nth-child('+(i+1)+')').attr('src','res/dice'+defenderRolls[i]+'.svg');
	    $('.defenderDice img:nth-child('+(i+1)+')').show();	    
	}

	for(let i = defenderRolls.length; i<2;i++){
	    $('.defenderDice img:nth-child('+(i+1)+')').hide();
	}

	$('.lossDisplay div object').css('color','blue');
	
	$('.lossDisplay div svg:nth-child(1)').hide();
	$('.lossDisplay div svg:nth-child(2)').hide();

	if(attackUnitsLost.attacker>1){
	    $('.lossDisplay div svg:nth-child(1)').show().css('fill',from.owner.color);
	    $('.lossDisplay div svg:nth-child(2)').show().css('fill',from.owner.color);
	} else if (attackUnitsLost.defender>1){
	    $('.lossDisplay div svg:nth-child(1)').show().css('fill',to.owner.color);
	    $('.lossDisplay div svg:nth-child(2)').show().css('fill',to.owner.color);
	} else {
	    if(attackUnitsLost.attacker>0){
		$('.lossDisplay div svg:nth-child(1)').show().css('fill',from.owner.color);
	    }
	    if(attackUnitsLost.defender>0){
		$('.lossDisplay div svg:nth-child(2)').show().css('fill',to.owner.color);
	    }
	}
	
	$('.lossDisplay > img').click(()=>{$('.attackResPanel').fadeOut();});
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
	Attack._printStatus();

	if(game.currPlayer.isLocal) {	 
	    $('.endPhaseButton').css('display','flex').hide().fadeIn();
	    $('.endPhaseButton').click(()=>{
		game.gamePlayerEventSource.sendMessage({attackEnd:true});
		Attack._clearAttackZones();
		$('.troopNumPanel').fadeOut();
		$('.endPhaseButton').off();
	    });
	}
    }

    static _printStatus(){
	let player = game.currPlayer;
	let string = player.nick;
	
	if(game.currPlayer.isLocal){
	    string+="(You)";
	}
	string+=': Attack territories.';
	game.setGameStatus(string,player.color);
    }
}
