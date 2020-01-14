/**
 * @fileOverview Contains the ColorZone class.
 * @name colorZone.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import * as graphics from "../graphics/graphics.js";

export class ColorZone extends graphics.ImgActor {
    constructor(parent, x, y, z, rotation, scale, img, node){
	super(parent, x, y, z, rotation, scale, img);
	this.node = node;
	this.filters=[];
    }

    do_draw(ctx){

	let filterString = "";
	this.filters.forEach(f=>{
	    if(f.visible){
		filterString += f.string;
	    }
	});
	ctx.filter = filterString;

	
	if(this.filters.some(f=>f.visible)){
	    super.do_draw(ctx);
	    ctx.filter = "";
	}	

	
    }

    addFilter(filterString){
	let filterInfo = {};
	filterInfo.string = filterString;
	filterInfo.visible = false;
	this.filters.push(filterInfo);
    }

    activateColor(index){
	this.filters[index].visible = true;
    }

    deactivateAllColor(){
	this.filters.forEach(f=>f.visible=false);
    }
    
    
}
