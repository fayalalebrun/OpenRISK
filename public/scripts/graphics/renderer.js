import util from "./util.js";

export class Renderer{
    constructor(canvasName){
	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext('2d');
	this.stages = [];
	this.sizeMultiplier = 1;

	this.virtualCanvas = document.createElement('canvas'); //Used for hit detection
	this.virtualCtx = this.virtualCanvas.getContext('2d');

	this._resizeCanvas();
	this.draw();
    }

    _resizeCanvas(){
	let widthUpper = document.body.clientWidth/16;
	let heightUpper = document.body.clientHeight/9;

	let multiplier = Math.min(widthUpper, heightUpper);

	this.canvas.width = multiplier*16;
	this.virtualCanvas.width = multiplier*16;
	this.canvas.height = multiplier*9;
	this.virtualCanvas.height = multiplier*9;

	this.stages.forEach(function(stage) {
	    stage.width = this.canvas.width;
	    stage.height = this.canvas.height;
	});
	

	this.sizeMultiplier = this.canvas.width/1280; //Keeps track of the ratio between the current screen size and our target, 1280*720

    };

    draw(){
	this.ctx.save();

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

    eventHitTest(event) {
	const rect = this.canvas.getBoundingClientRect();
	const realX = event.clientX - rect.left;
	const realY = event.clientY - rect.top;

	let data = this.ctx.getImageData(realX,realY,1,1).data;
	console.log(data);
	
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

    addStage(stage) {
	this.stages.push(stage);
    };
};
