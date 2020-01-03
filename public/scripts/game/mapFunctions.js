/**
 * @fileOverview Contains functions relevant to the map that is show on screen
 * @name mapFunctions.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */


import * as graphics from '../graphics/graphics.js';
import {MapView} from './mapView.js';
import {Map} from './map/map.js';
import {players} from './game.js';

export async function init(renderer){
    let stage = new graphics.Stage(renderer,2);
    renderer.addStage(stage);
    stage.camera.x = 50;
    let scene = new graphics.Scene(stage, 0, 0, 0, 1280, 720, 0);
    stage.scenes.push(scene);
    let img = new Image();
    let zoneImg = new Image();

    let actor = {};

    zoneImg.src = '../res/test_map_zones.png';
    img.src = '../res/test_map.png';
    
    let promises = [];

    promises.push(new Promise ((resolve)=>{
	    renderer.draw();
	    img.onload = (()=> resolve());
    }));

    promises.push(new Promise ((resolve)=>{
	    renderer.draw();
	    zoneImg.onload = (()=> resolve());
    }));

    await Promise.all(promises);

    

    let mapData = await $.getJSON('./res/test_map.json');

    map = new Map(mapData);

    
    let mapView = new MapView(scene,0,0,0,0,1, img, zoneImg, map);
    scene.actors.push(mapView);
    
    return mapView;
}

export var map;
