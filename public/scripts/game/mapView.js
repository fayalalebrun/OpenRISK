/**
 * @fileOverview Contains the MapView class.
 * @name mapView.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import * as graphics from "../graphics/graphics.js";
import {ColorZone} from "./colorZone.js";
import {MapUnits} from "./mapUnits.js";
import * as game from "./game.js";

export class MapView extends graphics.ImgActor {
    
    constructor(parent, x, y, z, rotation, scale, img, zoneImg, map){
	super(parent, x, y, z, rotation, scale, img);
	this.zoneImg = zoneImg;
	this.map = map;
	this.zoneContainer = new graphics.Actor(this,0,0,0,0,0,0,1);
	this.addChild(this.zoneContainer);
	this.mousePressed = false;
	this.mouseDistanceTravelled=0;

	this.zoneMap = {};
	this._parseColorZones(this.parent.stage.renderer.ctx);

	this.mapUnitsContainer = new graphics.Actor(this,0,0,100,0,0,0,1);
	this._addUnitDisplay(map.nodes, this.mapUnitsContainer);
	this.addChild(this.mapUnitsContainer);
    }

    _addUnitDisplay(nodes, parent){
	nodes.forEach((e)=>{
	    parent.addChild(new MapUnits(parent, 0, 0, 1, e));
	});
    }

    _parseColorZones(ctx){
	let tempCanvas = document.createElement('canvas');
	let tempContext = tempCanvas.getContext('2d');
	tempCanvas.width = this.zoneImg.width;
	tempCanvas.height = this.zoneImg.height;
	tempContext.drawImage(this.zoneImg,0,0);
	let imgDataArr = tempContext.getImageData(0, 0, this.zoneImg.width, this.zoneImg.height).data;
	this.map.nodes.forEach((e)=>{
	    let zone = new ColorZone(this.zoneContainer,0,0,0,0,1,e);
	    zone.addDisplayColor(imgDataArr, 255, 0, 0, this.zoneImg);
	    zone.addDisplayColor(imgDataArr, 0, 255, 0, this.zoneImg);	    
	    zone.addDisplayColor(imgDataArr, 0, 0, 255, this.zoneImg);
	    this.zoneContainer.addChild(zone);
	    this.zoneMap[e.colorID] = zone;
	});
    }
    
    onHit(ctx, event, x, y) {
	let camera = this.parent.stage.camera;
	if(event.type==='mousedown'){
	    this.mousePressed = true;
	} else if(event.type==='mouseup'){
	    this.mousePressed = false;
	    if(this.mouseDistanceTravelled<10){		
		ctx.save();
		ctx.drawImage(this.zoneImg, 0, 0);
		ctx.resetTransform();
		let scaleAmount = this.parent.stage.renderer.sizeMultiplier;
		ctx.scale(scaleAmount, scaleAmount);
		let data = ctx.getImageData(x,y,1,1).data;
		
		ctx.restore();

		let color = graphics.util.rgbToHex(data[0],data[1],data[2]);
		let zone = this.zoneMap[color];
		this.onZoneHit(zone,this);
	    }
	    this.mouseDistanceTravelled=0;
	} else if (event.type==='mousemove'&&this.mousePressed){
	    camera.x-=event.movementX;
	    camera.y-=event.movementY;
	    this.mouseDistanceTravelled+=Math.sqrt(event.movementX*event.movementX+event.movementY*event.movementY);
	    requestAnimationFrame(()=>game.renderer.draw());
	} else if(event.type==='wheel'){
	    
	    let scaleChange = event.deltaY/100;
	    camera.zoom+=scaleChange;
	    camera.x+= (x*scaleChange);
	    camera.y+= (y*scaleChange);
	    
	    requestAnimationFrame(()=>game.renderer.draw());
	}
    }


    onZoneHit(zone,mapView){}
    
}

