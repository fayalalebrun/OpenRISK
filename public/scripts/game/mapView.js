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
	tempContext.drawImage(this.zoneImg,0,0); // no idea why this works
	tempContext.drawImage(this.zoneImg,0,0);
	tempContext.drawImage(this.zoneImg,0,0);


	
	let imgDataArr = tempContext.getImageData(0, 0, this.zoneImg.width, this.zoneImg.height).data;
	
	let zoneData = {};

	this.map.nodes.forEach((e)=>{
	    zoneData[e.colorID] = {};
	    zoneData[e.colorID].minX = Number.MAX_SAFE_INTEGER;
	    zoneData[e.colorID].maxX = Number.MIN_SAFE_INTEGER;
	    zoneData[e.colorID].minY = Number.MAX_SAFE_INTEGER;
	    zoneData[e.colorID].maxY = Number.MIN_SAFE_INTEGER;		
	});


	for(let i = 0; i < imgDataArr.length; i+=4){
	    let data = zoneData[graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])];
	    if(data){
		let p = i/4;
		let x = p%this.zoneImg.width;
		let y = Math.floor(p/this.zoneImg.width);

		if(y>data.maxY){
		    data.maxY = y;
		}

		if (y<data.minY){
		    data.minY = y;
		}

		if(x>data.maxX){
		    data.maxX = x;
		}

		if (x<data.minX) {
		    data.minX = x;
		}
	    }
	}

	Object.keys(zoneData).forEach(k=>{
	    let data = zoneData[k];
	    data.newWidth = (data.maxX-data.minX)+1;
	    data.newHeight = (data.maxY-data.minY)+1;
	    data.newDataArr = new Uint8ClampedArray(data.newWidth*data.newHeight*4);
	});

	for(let i = 0; i < imgDataArr.length; i+=4){
	    let p = i/4;
	    let x = p%this.zoneImg.width;
	    let y = Math.floor(p/this.zoneImg.width);

	    let data = zoneData[graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])];
	    
	    if(data&&x>=data.minX&&x<=data.maxX&&y>=data.minY&&y<=data.maxY){

		let newX = x - data.minX;
		let newY = y - data.minY;
		let newP = newX+newY*data.newWidth;
		let newI = newP*4;
		
		data.newDataArr[newI]=255;
		data.newDataArr[newI+1]=0;
		data.newDataArr[newI+2]=0;
		data.newDataArr[newI+3]=128;
	    }

	}
	
	this.map.nodes.forEach((e)=>{
	    let data = zoneData[e.colorID];
	    let newImgData = new ImageData(data.newDataArr, data.newWidth);
	    let image = graphics.util.imageDataToImage(newImgData);
	    let zone = new ColorZone(this.zoneContainer,data.minX,data.minY,0,0,1, image, e);
	    zone.addFilter("");
	    zone.addFilter("hue-rotate(120deg)");
	    zone.addFilter("hue-rotate(240deg)");	    
	    this.zoneContainer.addChild(zone);
	    this.zoneMap[e.colorID] = zone;
	});
    }
    
    onHit(ctx, event, x, y) {
	let camera = this.parent.stage.camera;
	console.log(event.button);
	if(event.type==='mousedown'&&event.button==2){
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
	    camera.x-=event.movementX*(1/game.renderer.sizeMultiplier);
	    camera.y-=event.movementY*(1/game.renderer.sizeMultiplier);
	    let distanceTravelled =Math.sqrt(event.movementX*event.movementX+event.movementY*event.movementY);
	    this.mouseDistanceTravelled+=distanceTravelled;
	    if(event.buttons==0){
		this.mousePressed=false;
	    }
	    
	    requestAnimationFrame(()=>game.renderer.draw());
	} else if(event.type==='wheel'&&event.deltaY!=0){
	    
	    let scaleChange = -(event.deltaY/Math.abs(event.deltaY))/70;
	    camera.zoom+=scaleChange;
	    camera.x+= (x*scaleChange)*(1/game.renderer.sizeMultiplier);
	    camera.y+= (y*scaleChange)*(1/game.renderer.sizeMultiplier);
	    
	    requestAnimationFrame(()=>game.renderer.draw());
	}
    }


    onZoneHit(zone,mapView){}
    
}

