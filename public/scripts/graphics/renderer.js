/**
 * @fileOverview Contains the Renderer class.
 * @name renderer.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {util} from "./util.js";

/** The top level of rendering. Handles drawing and dispatching input events for every Stage under it.
 */

export class Renderer{

    /**
     * Creates a Renderer.
     * @param {string} canvasName - The name of the canvas which the Renderer should preside over
     */
    constructor(canvasName, viewportWidth, viewportHeight){
	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext('2d');
	this.stages = [];
	this.sizeMultiplier = 1;

	this.virtualCanvas = document.createElement('canvas'); //Used for hit detection
	this.virtualCtx = this.virtualCanvas.getContext('2d');
	this.viewportWidth = viewportWidth;
	this.viewportHeight = viewportHeight;
	
	this._resizeCanvas();
	this.draw();
    }
    /**
     * @private 
     */
    _resizeCanvas(){
	let widthUpper = document.body.clientWidth/16;
	let heightUpper = document.body.clientHeight/9;

	if(widthUpper<heightUpper){
	    let multiplier = widthUpper;
	    this.canvas.width = multiplier*16;
	    this.virtualCanvas.width = multiplier*16;
	    this.canvas.height = document.body.clientHeight;
	    this.virtualCanvas.height = document.body.clientHeight;
	    this.sizeMultiplier = this.canvas.width/this.viewportWidth;
	} else {
	    let multiplier = heightUpper;
	    this.canvas.width = document.body.clientWidth;
	    this.virtualCanvas.width = document.body.clientWidth;
	    this.canvas.height = multiplier*9;
	    this.virtualCanvas.height = multiplier*9;
	    this.sizeMultiplier = this.canvas.height/this.viewportHeight;
	}

	this.stages.forEach((stage) => {
	    stage.width = this.canvas.width;
	    stage.height = this.canvas.height;
	});
	
	
    };

    /** Draws every Stage, in z-order. */
    draw(){	
	this.ctx.save();
	this._clearScreen(this.ctx);

	this.ctx.scale(this.sizeMultiplier, this.sizeMultiplier);

	this.stages.sort(util.zLevelComparator);

	let that = this;
	this.stages.forEach(function (stage) {
	    that.ctx.save();
	    stage.draw(that.ctx);
	    that.ctx.restore();
	});
	this.ctx.restore();
    }

    _clearScreen(ctx){
	ctx.beginPath();
	ctx.rect(0,0,this.canvas.width,this.canvas.height);
	ctx.fillStyle='grey';
	ctx.fill();
	ctx.closePath();
    }

    /** 
     * This function should be called whenever there is a mouse input event, sent for further processing
     * by each Stage and its children.
     * @param {Event} event - The mouse event which should be processed.
     */
    eventHitTest(event) {
	const rect = this.canvas.getBoundingClientRect();
	const realX = event.clientX - rect.left;
	const realY = event.clientY - rect.top;
	
	this.virtualCtx.save();

	this.virtualCtx.scale(this.sizeMultiplier, this.sizeMultiplier);

	this.stages.sort(util.zLevelComparator);

	let that = this;
	this.stages.some(function (stage) {
	    that.virtualCtx.save();
	    let res = stage.eventHitTest(that.virtualCtx, event, realX, realY);
	    that.virtualCtx.restore();
	    return res;
	});
	this.virtualCtx.restore();

    }

    /** 
     * Adds a stage to this Renderer.
     * @param {Stage} stage - Stage that should be added.
     */
    addStage(stage) {
	this.stages.push(stage);
    };
};
