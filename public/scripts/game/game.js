/**
 * @fileOverview Contains the main entry point for the game.
 * @name game.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 * @license 
 */


export * from "./mapView.js";
export * from "./player.js";
export * from "./util.js";
import {randomIntFromInterval,shuffle} from "./util.js";
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

    $('.waitingForGame').remove();
    $('body').append($('<canvas>').attr('id','mainCanvas').attr('width',640).attr('height',480));



        let zoneImg = new Image();
    let img = new Image();
    zoneImg.src = '../res/map_zones.svg';
    img.src = '../res/map.svg';
    
    let promises = [];

    promises.push(new Promise ((resolve)=>{
	img.onload = (()=> {	   	    
	    resolve();
	});
    }));

    promises.push(new Promise ((resolve)=>{
	    zoneImg.onload = (()=> resolve());
    }));

    await Promise.all(promises);
    
    
    renderer = new graphics.Renderer('mainCanvas',img.width, img.height);

    let mapStage = new graphics.Stage(renderer,-100);
    renderer.addStage(mapStage);

    window.onresize = (()=>{

	renderer._resizeCanvas();
	requestAnimationFrame(()=>renderer.draw());
			   });



    renderer.canvas.addEventListener('wheel', (e) => {
	renderer.eventHitTest(e);
    });

    renderer.canvas.addEventListener('mousedown', (e) => {
	renderer.eventHitTest(e);
    });

    renderer.canvas.addEventListener('mouseup', (e) => {
	renderer.eventHitTest(e);
    });

    renderer.canvas.addEventListener('mousemove', (e) => {
	renderer.eventHitTest(e);
    });



    mapView = await mapFunctions.init(renderer,img,zoneImg);
    
    requestAnimationFrame(()=>renderer.draw());
    

    currPlayer = players[0];

    mapView.onZoneHit = onPlayerInput;

    cardDeck = Card.createDeck(mapFunctions.map.nodes, globalRand);

    setupMenu();

    stageHandling.WaitReady.ready();

    $('.uiOverlay').fadeIn();
}

export function setStageHandler(stageHandler){
    handleInput = stageHandler.handleInput;
    handleEvent = stageHandler.onPlayerEvent;
}

async function decidePlayerOrder(gameInfo){

    let colorData = await $.getJSON('res/player_colors.json');
    const colorGenerator = getPlayerColor(colorData.colors);

    let unitAmount = {2:40,3:35,4:30,5:25,6:20};

    let playerMap = Object.keys(gameInfo.players).map((e)=>{
	let isLocal = e == window.sessionStorage.getItem('conID');
	return new Player(e, gameInfo.players[e], isLocal, colorGenerator.next().value,
			  unitAmount[Object.keys(gameInfo.players).length]);
    });
    shuffle(playerMap,globalRand);
    
    return playerMap;

}

function setupMenu(){
    $('.menuButton').click(()=>{
	$('.menuPanelWrapper').css('display','flex').hide().fadeIn();
    });

    $('#menuBackButton').click(()=>{
	$('.menuPanelWrapper').fadeOut();
    });

    $('#menuFullscreenButton').click(()=>{
	document.documentElement.requestFullscreen();
    });
}

function* getPlayerColor(colors) {
    for(let e of colors){
	yield e;
    }
}

export function onPlayerEvent(event){
    handleEvent(event);
    if(renderer){
	requestAnimationFrame(()=>renderer.draw());
    }
}

function onPlayerInput(zone, mapView){
    handleInput(currPlayer, zone, mapView, gamePlayerEventSource);
    requestAnimationFrame(()=>renderer.draw());
}

export function nextPlayer(){
    let index = players.findIndex(e=>e.id===currPlayer.id);
    index = (index+1)%players.length;
    currPlayer = players[index];
}

export function setGameStatus(status, color='red'){
    $(".statusBar label").text(status);
    $(".statusBar label").css('color',color);
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
