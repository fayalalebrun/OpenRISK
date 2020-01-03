/**
 * @fileOverview Contains the main entry point for the game.
 * @name game.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 * @license 
 */


export * from "./mapView.js";
export * from "./player.js";
export * from "./util.js";
import {randomIntFromInterval} from "./util.js";
import {Player} from "./player.js";
import {Card} from "./card.js";
import * as graphics from "../graphics/graphics.js";
import * as mapFunctions from "./mapFunctions.js";
import * as stageHandling from "./stage_handling/stage_handling.js";



export async function main(seed, playerEventSource, gameInfo){
    stageHandling.WaitReady.select();
    
    console.log('Seed: '+seed);
    globalRand = new Math.seedrandom(seed);    
    players = await decidePlayerOrder(gameInfo);
    gamePlayerEventSource = playerEventSource;

    $('body').empty();
    $('body').append($('<canvas>').attr('id','mainCanvas').attr('width',640).attr('height',480));

    renderer = new graphics.Renderer('mainCanvas');

    let mapStage = new graphics.Stage(renderer,-100);
    renderer.addStage(mapStage);

    window.onresize = (()=>{

	renderer._resizeCanvas();
	renderer.draw();
			   });

    renderer.canvas.addEventListener('click', function (e) {
	renderer.eventHitTest(e);
    });

    mapView = await mapFunctions.init(renderer);
    
    renderer.draw();


    currPlayer = players[0];

    mapView.onZoneHit = onPlayerInput;


    let cardDeck = Card.createDeck(mapFunctions.map.nodes, globalRand);

    stageHandling.WaitReady.ready();
}

export function setStageHandler(stageHandler){
    handleInput = stageHandler.handleInput;
    handleEvent = stageHandler.onPlayerEvent;
}

async function decidePlayerOrder(gameInfo){
    let playerMap = [];
    Object.entries(gameInfo.players).forEach(([e,v])=>{
	let roll = randomIntFromInterval(1,6,globalRand);	
	playerMap.push({id:e,diceRoll:roll});
    });

    playerMap.sort((a,b)=>{
	if(a.diceRoll>b.diceRoll){
	    return -1;
	} else {
	    return 1;
	}

    });

    let colorData = await $.getJSON('res/player_colors.json');
    const colorGenerator = getPlayerColor(colorData.colors);

    let unitAmount = {2:40,3:35,4:30,5:25,6:20};

    
    return playerMap.map((e)=>{
	let isLocal = e.id == window.sessionStorage.getItem('conID');
	return new Player(e.id, gameInfo.players[e.id], isLocal, colorGenerator.next().value,
			  unitAmount[playerMap.length]);
    });
}

function* getPlayerColor(colors) {
    for(let e of colors){
	yield e;
    }
}

export function onPlayerEvent(event){
    handleEvent(event);
    renderer.draw();
}

function onPlayerInput(zone, mapView){
    handleInput(currPlayer, zone, mapView, gamePlayerEventSource);
    renderer.draw();
}

export function nextPlayer(){
    let index = players.findIndex(e=>e.id===currPlayer.id);
    index = (index+1)%players.length;
    currPlayer = players[index];
}

export var globalRand;
export var renderer;
export var players;
export var currPlayer;
export function handleEvent(){};
export function handleInput(){};
export var gamePlayerEventSource;
export var mapView;
export var cardDeck;
