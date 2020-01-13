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

	let minX = Number.MAX_SAFE_INTEGER;
	let maxX = Number.MIN_SAFE_INTEGER;

	let minY = Number.MAX_SAFE_INTEGER;
	let maxY = Number.MIN_SAFE_INTEGER;
	
	for(let i = 0; i < imgDataArr.length; i+=4){
	    if(graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])===this.node.colorID){
		let p = i/4;
		let x = p%zoneImg.width;
		let y = Math.floor(p/zoneImg.width);

		if(y>maxY){
		    maxY = y;
		}

		if (y<minY){
		    minY = y;
		}

		if(x>maxX){
		    maxX = x;
		}

		if (x<minX) {
		    minX = x;
		}
	    }
	}




	
	let newWidth = (maxX-minX)+1;
	let newHeight = (maxY-minY)+1;
	let newDataArr = new Uint8ClampedArray(newWidth*newHeight*4);
	
	for(let i = 0; i < imgDataArr.length; i+=4){
	    let p = i/4;
	    let x = p%zoneImg.width;
	    let y = Math.floor(p/zoneImg.width);

	    let newX = x - minX;
	    let newY = y - minY;
	    let newP = newX+newY*newWidth;
	    let newI = newP*4;
	    
	    if(x>=minX&&x<=maxX&&y>=minY&&y<=maxY&&graphics.util.rgbToHex(imgDataArr[i],imgDataArr[i+1],imgDataArr[i+2])===this.node.colorID){
		newDataArr[newI]=r;
		newDataArr[newI+1]=g;
		newDataArr[newI+2]=b;
		newDataArr[newI+3]=128;
	    }



	}
	
	let newImgData = new ImageData(newDataArr, newWidth);
	let image = graphics.util.imageDataToImage(newImgData);
	let imgChild = new graphics.ImgActor(this,minX,minY,0,0,1,image);
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
