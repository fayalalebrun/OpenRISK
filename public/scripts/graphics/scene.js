/**
 * @fileOverview Contains the Scene class.
 * @name scene.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {util} from "./util.js";

/** The Scene, as part of a Stage, will occupy part of the screen.
 */

export class Scene{
	/**
	 * Creates a Scene object
	 * @param {*} stage - The Stage on which the given Scene will be based
	 * @param {*} x - The x-coordinates of the Scene
	 * @param {*} y - The y-coordinates of the Scene
	 * @param {*} z - The amount of 
	 * @param {*} width - The width of the Scene
	 * @param {*} height - The height of the Scene
	 * @param {*} rotation - The amount of that the Scene is to be rotated
	 */
    constructor(stage, x, y, z, width, height, rotation){
	this.stage = stage;
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;
	this.rotation = rotation;
	this.actors = [];
    }
	/**
	 * @private
	 * @param {ctx} ctx 
	 */
    _transformContext(ctx){
	ctx.translate(this.x,this.y);
	ctx.translate(this.width/2,this.height/2);
	ctx.rotate(this.rotation);
	ctx.translate(-this.width/2,-this.height/2);
	
    }
	/**
	 * Draws the current, transformed rectangle in z-order.
	 * @param {*} ctx - The current, transformed rectangle.
	 */
    draw(ctx){
	this._transformContext(ctx);

	this.actors.forEach(function(actor){
	    ctx.save();	    
	    actor.draw(ctx);
	    ctx.restore();
	});
    };
	/**
	 * This function should be called whenever there is any input that adjusts the Camera size.
	 * @param {ctx} ctx - The current, transformed rectangle.
	 * @param {Event} event - The mouse event to be processed.
	 * @param {*} x - The x-coordinates of the rectangle
	 * @param {*} y - The y-coordinates of the rectangle
	 */
    eventHitTest(ctx,event,x,y){
	this._transformContext(ctx);

	if(!util.rectContainsCoordinates(ctx, this.width, this.height, x, y)){
	    return false;
	}
	
	return this.actors.some(function(actor){
	    ctx.save();	    
	    let res = actor.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	});
    };
    /**
	 * Adds an actor to the Scene.
	 * @param {actor} actor - The actor that is to be added
	 */
    addActor(actor) {
	this.actors.push(actor);
    };

};

