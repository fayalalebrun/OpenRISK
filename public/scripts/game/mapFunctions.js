/**
 * @fileOverview Contains functions relevant to the map that is show on screen
 * @name mapFunctions.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */


import * as graphics from '../graphics/graphics.js';
import {MapView} from './mapView.js';
import {Map} from './map/map.js';
import {players} from './game.js';

export async function init(renderer, img, zoneImg){
    let stage = new graphics.Stage(renderer,2);
    renderer.addStage(stage);
    let scene = new graphics.Scene(stage, 0, 0, 0, 1920, 1080, 0);
    stage.scenes.push(scene);

    let actor = {};
    

    let mapData = await $.getJSON('./res/map.json');

    map = new Map(mapData);

    
    let mapView = new MapView(scene,0,0,0,0,1, img, zoneImg, map);
    scene.actors.push(mapView);
    
    return mapView;
}

export var map;
