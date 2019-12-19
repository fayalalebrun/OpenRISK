if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.Renderer = function (canvasName) {
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext('2d');
    this.stages = [];
    this.sizeMultiplier = 1;

    this.virtualCanvas = document.createElement('canvas'); //Used for hit detection
    this.virtualCtx = this.virtualCanvas.getContext('2d');

    let renderer = this; // Needed as this points to the function when inside a function
    
    this.resizeCanvas= function() {
	let widthUpper = document.body.clientWidth/16;
	let heightUpper = document.body.clientHeight/9;

	let multiplier = Math.min(widthUpper, heightUpper);

	renderer.canvas.width = multiplier*16;
	renderer.virtualCanvas.width = multiplier*16;
	renderer.canvas.height = multiplier*9;
	renderer.virtualCanvas.height = multiplier*9;

	renderer.stages.forEach(function(stage) {
	    stage.width = renderer.canvas.width;
	    stage.height = renderer.canvas.height;
	});
	

	renderer.sizeMultiplier = renderer.canvas.width/1280; //Keeps track of the ratio between the current screen size and our target, 1280*720

    };

    this.draw = function() {
	renderer.ctx.save();

	renderer.ctx.scale(renderer.sizeMultiplier, renderer.sizeMultiplier);

	renderer.stages.sort(graphics.util.zLevelComparator);

	renderer.stages.forEach(function (stage) {
	    renderer.ctx.save();
	    stage.draw(renderer.ctx);
	    renderer.ctx.restore();
	});
	renderer.ctx.restore();
    };

    this.eventHitTest = function(event) {
	const rect = renderer.canvas.getBoundingClientRect();
	const realX = event.clientX - rect.left;
	const realY = event.clientY - rect.top;
	
	renderer.virtualCtx.save();

	renderer.virtualCtx.scale(renderer.sizeMultiplier, renderer.sizeMultiplier);

	renderer.stages.sort(graphics.util.zLevelComparator);

	renderer.stages.some(function (stage) {
	    renderer.virtualCtx.save();
	    let res = stage.eventHitTest(renderer.virtualCtx, event, realX, realY);
	    renderer.virtualCtx.restore();
	    return res;
	});
	renderer.virtualCtx.restore();
    };

    this.addStage = function(stage) {
	renderer.stages.push(stage);
    };

    this.resizeCanvas();
    this.draw();
};
