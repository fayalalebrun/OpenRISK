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
import * as graphics from "../graphics/graphics.js";
import * as mapFunctions from "./mapFunctions.js";

export async function main(seed, playerEventSource, gameInfo){
    globalRand = new Math.seedrandom(seed);
    console.log(seed);
    let players = decidePlayerOrder(gameInfo);

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

    await mapFunctions.init(renderer);
    renderer.draw();
}

function decidePlayerOrder(gameInfo){
    let playerMap = [];
    Object.entries(gameInfo.players).forEach(([e,v])=>{
	let roll = randomIntFromInterval(1,6,globalRand);
	console.log(roll);
	playerMap.push({id:e,diceRoll:roll});
    });

    playerMap.sort((a,b)=>{
	if(a.diceRoll>b.diceRoll){
	    return -1;
	} else {
	    return 1;
	}

    });

    return playerMap.map((e)=>{
	let isLocal = e.id == window.sessionStorage.getItem('conID');
	return new Player(e.id, gameInfo.players[e.id], isLocal);
    });
}

export function onPlayerEvent(event){
    
}

export var globalRand;
export var renderer;
