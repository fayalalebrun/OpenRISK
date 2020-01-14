/**
 * @fileOverview Contains the Stage and Camera class.
 * @name stage.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {util} from "./util.js";

/** The Camera that will be used in the user interface.
 */

export class Camera{
	/**
	 * Creates a Camera; an object that utilizes as an interface for the user.
	 * @param {number} x - The x-coordinates of said interface
	 * @param {number} y - The y-coordinates of said interface
	 * @param {number} zoom - The amount that the screen's image is decreased for the user interface.
	 */
    constructor(x,y,zoom){
	this.x = x;
	this.y = y;
	this.zoom = zoom;
    }
};

/** The Stage that will occupy the screen.
 */

export class Stage{
	/**
	 * Creates a stage.
	 * @param {*} renderer - Creates a new Renderer with which to initialize the Stage
	 * @param {number} z - The property of the Stage in the form of an integer
	 */
    constructor(renderer,z){
	this.renderer = renderer;
	this.width = 1920;
	this.height = 1080;
	this.scenes = [];
	this.camera = new Camera(0,0,1);
	this.z = z;
    }
	/**
	 * @private
	 * @param {ctx} ctx 
	 */
    _transformContext(ctx){
	ctx.translate(-this.camera.x,-this.camera.y);
	ctx.scale(this.camera.zoom, this.camera.zoom);
    }

	/**
	 * Draws the current, transformed rectangle in z-order.
	 * @param {*} ctx - The current, transformed rectangle.
	 */
    draw(ctx){
	this._transformContext(ctx);
	
	this.scenes.sort(util.zLevelComparator);

	this.scenes.forEach(function(scene){
	    ctx.save();
	    scene.draw(ctx);
	    ctx.restore();
	});
    }
	
	/**
	 * This function should be called whenever there is any input that adjusts the Camera size.
	 * @param {ctx} ctx - The current, transformed rectangle.
	 * @param {Event} event - The mouse event to be processed.
	 * @param {*} x - The x-coordinates of the rectangle
	 * @param {*} y - The y-coordinates of the rectangle
	 */
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

	/**
	 * Adds a scene to the Stage
	 * @param {scene} scene - Scene that should be added.
	 */
    addScene(scene){
	this.scenes.push(scene);
    }
};

