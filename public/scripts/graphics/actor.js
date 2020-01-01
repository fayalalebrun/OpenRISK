/**
 * @fileOverview Contains the Actor class.
 * @name actor.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {util} from "./util.js";

export class Actor {
    constructor(parent, x, y, z, width, height, rotation, scale){
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;
	this.rotation = rotation;
	this.scale = scale;
	this.children = [];
	this.visible = true;
    }
    
    _transformContext(ctx){
	ctx.translate(this.x,this.y);
	ctx.translate(this.width/2, this.height/2);
	ctx.rotate(this.rotation);
	ctx.translate(-this.width/2,-this.height/2);
	ctx.scale(this.scale,this.scale);
    }

    draw(ctx) {
	this._transformContext(ctx);

	if (this.visible) {
	    this.do_draw(ctx);

	    this.children.sort(util.zLevelComparator);
	    
	    this.children.forEach((child)=>{
		ctx.save();
		child.draw(ctx);
		ctx.restore();
	    });
	}
    }

    do_draw(ctx) {

    }

    eventHitTest(ctx,event,x,y) {
	this._transformContext(ctx);

	this.children.sort(util.zLevelComparator);
	if (this.children.some(function(child){
	    ctx.save();
	    let res = child.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	})) {
	    return true;
	}
	return util.rectContainsCoordinates(ctx, this.width, this.height, x, y) && this.onHit(ctx, event, x, y);
    }

    onHit(ctx, event, x, y) {
	return false;    } //override this function to do something on mouse hit

    addChild(actor){
	this.children.push(actor);
    }
    
    
};
