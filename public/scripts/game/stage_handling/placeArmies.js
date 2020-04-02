import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import * as mapFunctions from "../mapFunctions.js";
import {Attack} from "./attack.js";
import {Card} from "../card.js";

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

		if(player.isLocal){
		    PlaceArmies._updateSlider();
		}

		
		
		if(player.unitPool===0){
		    console.log('PlaceArmies stage complete');
		    if(player.isLocal){
			$('.troopNumPanel').fadeOut();
			$('.cardsMenuWrapper').fadeOut();
			$('.cardsButton').fadeOut();
		    }		    

		    Attack.select();
		}
	    } else {
		console.error('Invalid PlaceArmies message');
	    }
	} else if(event.addArmies&&!PlaceArmies._tradeDone){
	    if(event.playerID!=game.currPlayer.id){
		console.error('Received message from wrong player');
		return;
	    }
	    console.log("Trade being done");
	    console.log(event);

	    if(event.addArmies.selectedCards.every(c=>{

		return !game.currPlayer.cards.some(n=>{
		    return n.node.colorID==c.nodeColorID;
		});
	    })){
		console.error('Sent cards not in deck');
		console.log(event.addArmies.selectedCards);
		console.log(game.currPlayer.cards);
		return;
	    }

	    
	    PlaceArmies._tradeDone = true;

	    var bonusTroops = Card.turnInGenerator.next().value;
	    if(game.currPlayer.ownedNodes.some((n)=>{
		return event.addArmies.selectedCards.some(c=>n.colorID==c.nodeColorID);
	    })){	
		bonusTroops+=2;
	    }

	    game.currPlayer.cards = game.currPlayer.cards.filter(c=>{
		return event.addArmies.selectedCards.every(e=>{
		    return e.nodeColorID!=c.node.colorID;
		});		
	    });

	    game.currPlayer.unitPool+=bonusTroops;
	    if(game.currPlayer.isLocal){
		PlaceArmies._updateSlider();
		
		PlaceArmies._updateCardDisplay();
		PlaceArmies._checkTradeAvailable();
	    }
	} else {
	    console.error('Unsupported event type received');
	    console.log(event);
	    console.log(PlaceArmies._tradeDone);
	}
    }

    static handleInput(currPlayer, zone, mapView, playerEventSource) {
	if(!zone){
	    return;
	}
	if(currPlayer.isLocal&&zone.node.owner===currPlayer){
	    let unitsToPlace = Math.min(currPlayer.unitPool,
					    Math.round($('#troopsPlaceRange').val()));
	    playerEventSource.sendMessage({placeArmies:{playerID:currPlayer.id, nodeID:zone.node.colorID, placeAmount:unitsToPlace}});
	}
    }

    static select(){
	game.setStageHandler(this);
	this._calcAndAddArmies();
	PlaceArmies._tradeDone = false;

	if(game.currPlayer.isLocal){
	    this._updateSlider();
	    $('.troopNumPanel').fadeIn();	    
	    $('.cardsButton').css('display','flex').hide().fadeIn();
	    $('.cardsButton').click(()=>{
		$('.cardsMenuWrapper').css('display','flex').hide().fadeIn();
	    });
	    $('.cardsMenu > .exitButton').click(()=>{
		$('.cardsMenuWrapper').fadeOut();
	    });
	    PlaceArmies._updateCardDisplay();	   
	    $('.cardsMenu > .tradeButton').click(()=>{
		PlaceArmies.selectedCards.forEach((c)=>{
		    console.log(c);
		});
		console.log(PlaceArmies.selectedCards.length);

		if(!$('.cardsMenu > .tradeButton').hasClass('disabled')){
		    var reducedCards = PlaceArmies.selectedCards.map((c)=>{
			return {nodeColorID:c.node.colorID,type:c.type};
		    });
		    game.gamePlayerEventSource.sendMessage({addArmies:{
			selectedCards:reducedCards}});
		    
		}
	    });
	}


	PlaceArmies._printStatus();
    }

    static _updateCardDisplay(){
	PlaceArmies.selectedCards = [];
	$('.cardsWrapper').empty();
	game.currPlayer.cards.forEach((c)=>{	    
	    var div = document.createElement('div');
	    div.className='card hoverable';	    
	    div.appendChild(game.spriteMap[game.currPlayer.color]['units'+(1+c.type*2)].cloneNode(true));	    
	    div.appendChild(game.mapView.zoneMap[c.node.colorID].img.cloneNode(true));
	    document.querySelector('.cardsWrapper').appendChild(div);

	    
	    $('.cardsWrapper > .card > img:last-of-type')
		.css('filter','grayscale(100%) invert(100%) drop-shadow(8px 8px 10px black)');
	    $('.cardsWrapper > .card:last-of-type').append('<label>'+c.node.name+'</label>');
	    var cardEl = $('.cardsWrapper > .card:last-of-type');
	    $('.cardsWrapper > .card:last-of-type').click(()=>{
		    if(PlaceArmies.selectedCards.includes(c)){
			PlaceArmies.selectedCards = PlaceArmies.selectedCards.filter(e=>e.node!=c.node &&
										     e.type!=c.type);
			cardEl.css('outline-style','none');
		    }else if (PlaceArmies.selectedCards.length<3){
			PlaceArmies.selectedCards.push(c);
			cardEl.css('outline-style','solid');
		    }
		PlaceArmies._checkTradeAvailable();
	    });
	});	  
    }

    static _checkTradeAvailable(){
	var cards = PlaceArmies.selectedCards;
	if(cards.some((c)=>c.type==Card.INFANTRY)
	   &&cards.some((c)=>c.type==Card.CAVALRY)
	   &&cards.some((c)=>c.type==Card.ARTILLERY)
	   ||cards.filter((c)=>c.type==Card.INFANTRY).length==3
	   ||cards.filter((c)=>c.type==Card.CAVALRY).length==3
	   ||cards.filter((c)=>c.type==Card.ARTILLERY).length==3){
	    $('.cardsMenu > .tradeButton').removeClass('disabled');
	    console.log('Trade available');
	} else {
	    $('.cardsMenu > .tradeButton').addClass('disabled');	    
	    console.log('Trade not available');
	}
	   
    }

    static _updateSlider(){
	if(Math.round($('#troopsPlaceRange').val())>game.currPlayer.unitPool){
	    document.getElementById("troopsPlaceRange").value = game.currPlayer.unitPool;
	    $('#troopNumLabel').text(Math.round($('#troopsPlaceRange').val()));
	}

	document.getElementById("troopsPlaceRange").max = game.currPlayer.unitPool;
	$('#troopsPlaceRange').on('input',()=>{
	    $('#troopNumLabel').text(Math.round($('#troopsPlaceRange').val()));
	});
	$('#troopOne').click(()=>{
	    $('#troopNumLabel').text(1);
	    document.getElementById("troopsPlaceRange").value = 1;
	});

	$('#troopAll').click(()=>{
	    $('#troopNumLabel').text(game.currPlayer.unitPool);
	    document.getElementById("troopsPlaceRange").value = game.currPlayer.unitPool;
	});
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

	
	let cardBonus = 0;
	
	let cards = player.cards;
	if(cards.length>=6){
	    let infCard = cards.find(c=>c.type===Card.INFANTRY);
	    let cavCard = cards.find(c=>c.type===Card.CAVALRY);
	    let artCard = cards.find(c=>c.type===Card.ARTILLERY);
	    
	    if(infCard&&cavCard&&artCard){
		cards.splice(cards.indexOf(infCard),1);
		cards.splice(cards.indexOf(cavCard),1);
		cards.splice(cards.indexOf(artCard),1);	    

		cardBonus+=Card.turnInGenerator.next().value;
		
		if(infCard.node.owner===player||cavCard.node.owner===player||
		   artCard.node.owner===player){
		    cardBonus+=2;
		}
	    }
	}

	console.log('Units awarded to %s:', player.nick);
	console.log('Territory: %i Zones: %i Cards: %i', territorialBonus, continentalBonus, cardBonus);

	player.unitPool+=Math.floor(territorialBonus)+continentalBonus+cardBonus;
    }

        static _printStatus(){
	let player = game.currPlayer;
	let string = player.nick;
	
	if(game.currPlayer.isLocal){
	    string+="(You)";
	}
	string+=': Placing armies.';
	game.setGameStatus(string,player.color);
    }


}
