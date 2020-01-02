/**
 * @fileOverview Contains the ColorZone class.
 * @name colorZone.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import * as graphics from "../graphics/graphics.js";

export class ColorZone extends graphics.Actor {
    constructor(parent, x, y, z, rotation, scale, node){
	super(parent, x, y, z, 0, 0, rotation, scale);
	this.node = node;
    }
    
    addDisplayColor(imgDataArr, r, g, b, zoneImg){
	let newDataArr = new Uint8ClampedArray(imgDataArr.length);
	for(let i = 0; i < imgDataArr.length; i+=4){
	    if(graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])===this.node.colorID){
		newDataArr[i]=r;
		newDataArr[i+1]=g;
		newDataArr[i+2]=b;
		newDataArr[i+3]=128;
	    } else {
		newDataArr[i]=0;
		newDataArr[i+1]=0;
		newDataArr[i+2]=0;
		newDataArr[i+3]=0;
	    }
	}
	let newImgData = new ImageData(newDataArr, zoneImg.width, zoneImg.height);
	let image = graphics.util.imageDataToImage(newImgData);
	let imgChild = new graphics.ImgActor(this,0,0,0,0,1,image);
	imgChild.visible = false;
	this.addChild(imgChild);	
    }

    activateColor(index){
	this.children[index].visible = true;
    }

    deactivateAllColor(){
	this.children.forEach(e=>e.visible=false);
    }
    
    
}
