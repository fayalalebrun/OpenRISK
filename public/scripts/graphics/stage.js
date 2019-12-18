if(typeof graphics === 'undefined'){
    graphics = {};
}


graphics.Stage = function(renderer){
    this.renderer = renderer;
    this.width = 1280;
    this.height = 720;
    this.scenes = [];

    let stage = this;
    this.draw = function(ctx, sizeMultiplier){
	stage.scenes.sort(graphics.util.zLevelComparator);

	stage.scenes.forEach(function(scene){
	    ctx.save();
	    scene.draw(ctx,sizeMultiplier);
	    ctx.restore();
	});
    };
};
