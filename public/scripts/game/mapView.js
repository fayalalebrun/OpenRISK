/**
 * @fileOverview Contains the MapView class.
 * @name mapView.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import * as graphics from "../graphics/graphics.js";
import {ColorZone} from "./colorZone.js";

export class MapView extends graphics.ImgActor {
    constructor(parent, x, y, z, rotation, scale, img, zoneImg, map){
	super(parent, x, y, z, rotation, scale, img);
	this.zoneImg = zoneImg;
	this.map = map;
	this.zoneContainer = new graphics.Actor(this,0,0,0,0,1);
	this.addChild(this.zoneContainer);

	this._parseColorZones(this.parent.stage.renderer.ctx);
    }

    _parseColorZones(ctx){
	let tempCanvas = document.createElement('canvas');
	let tempContext = tempCanvas.getContext('2d');
	tempCanvas.width = this.zoneImg.width;
	tempCanvas.height = this.zoneImg.height;
	tempContext.drawImage(this.zoneImg,0,0);
	let imgDataArr = tempContext.getImageData(0, 0, this.zoneImg.width, this.zoneImg.height).data;
	this.map.nodes.forEach((e)=>{
	    let newDataArr = new Uint8ClampedArray(imgDataArr.length);
	    for(let i = 0; i < imgDataArr.length; i+=4){
		if(graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])===e.colorID){
		    newDataArr[i]=imgDataArr[i];
		    newDataArr[i+1]=imgDataArr[i+1];
		    newDataArr[i+2]=imgDataArr[i+2];
		    newDataArr[i+3]=imgDataArr[i+3];
		} else {
		    newDataArr[i]=0;
		    newDataArr[i+1]=0;
		    newDataArr[i+2]=0;
		    newDataArr[i+3]=0;
		}
	    }
	    let newImgData = new ImageData(newDataArr, this.zoneImg.width, this.zoneImg.height);
	    let image = graphics.util.imageDataToImage(newImgData);
	    this.zoneContainer.addChild(new ColorZone(this.zoneContainer,0,0,0,0,1,image));
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
	console.log(color);
	
	return true;
    }
    
}
