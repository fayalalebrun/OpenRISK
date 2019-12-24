/**
 * @fileOverview Contains the Stage and Camera class.
 * @name stage.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {util} from "./util.js";

export class Camera{
    constructor(x,y,zoom){
	this.x = x;
	this.y = y;
	this.zoom = zoom;
    }
};

export class Stage{
    constructor(renderer,z){
	this.renderer = renderer;
	this.width = 1280;
	this.height = 720;
	this.scenes = [];
	this.camera = new Camera(0,0,1);
	this.z = z;
    }

    _transformContext(ctx){
	ctx.translate(-this.camera.x,-this.camera.y);
	ctx.scale(this.camera.zoom, this.camera.zoom);
    }

    draw(ctx){
	this._transformContext(ctx);
	
	this.scenes.sort(util.zLevelComparator);

	this.scenes.forEach(function(scene){
	    ctx.save();
	    scene.draw(ctx);
	    ctx.restore();
	});
    }
    
    eventHitTest(ctx, event, x, y){
	this._transformContext(ctx);

	if(!util.rectContainsCoordinates(ctx, this.width, this.height, x, y)){
	    return false;
	}
	
	this.scenes.sort(util.zLevelComparator);

	return this.scenes.some(function(scene){
	    ctx.save();
	    let res = scene.eventHitTest(ctx, event, x, y);
	    ctx.restore();
	    return res;
	});
    }

    addScene(scene){
	this.scenes.push(scene);
    }
};

