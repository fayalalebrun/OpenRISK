if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.Renderer = function (canvasName) {
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext('2d');
    this.stages = [];

    let renderer = this; // Needed as this points to the function when inside a function
    
    function resizeCanvas() {
	let widthUpper = document.body.clientWidth/16;
	let heightUpper = document.body.clientHeight/9;

	let multiplier = Math.min(widthUpper, heightUpper);

	renderer.canvas.width = multiplier*16;
	renderer.canvas.height = multiplier*9;

	renderer.stages.forEach(function(stage) {
	    stage.width = renderer.canvas.width;
	    stage.height = renderer.canvas.height;
	});
	

	return renderer.canvas.width/1280; //Keeps track of the ratio between the current screen size and our target, 1280*720

    }

    this.draw = function() {
	renderer.ctx.save();
	let sizeMultiplier = resizeCanvas();
	renderer.ctx.scale(sizeMultiplier, sizeMultiplier);

	renderer.stages.sort(graphics.util.zLevelComparator);
	
	renderer.stages.forEach(function (stage) {
	    renderer.ctx.save();
	    stage.draw(renderer.ctx);
	    renderer.ctx.restore();
	});
	renderer.ctx.restore();
    };

    this.draw();
};
