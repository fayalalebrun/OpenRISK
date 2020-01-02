/**
 * @fileOverview Contains the MapView class.
 * @name mapView.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import * as graphics from "../graphics/graphics.js";
import {ColorZone} from "./colorZone.js";
import {MapUnits} from "./mapUnits.js";

export class MapView extends graphics.ImgActor {
    constructor(parent, x, y, z, rotation, scale, img, zoneImg, map){
	super(parent, x, y, z, rotation, scale, img);
	this.zoneImg = zoneImg;
	this.map = map;
	this.zoneContainer = new graphics.Actor(this,0,0,0,0,0,0,1);
	this.addChild(this.zoneContainer);

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


    onZoneHit(zone,mapView){}
    
}
