if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.Scene = function(stage, x, y, z, width, height, rotation) {
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.actors = [];

    let scene = this;

    this.draw = function(ctx){
	ctx.translate(scene.x,scene.y);
	ctx.translate(scene.width/2,scene.heigth/2);
	ctx.rotate(scene.rotation);
	ctx.translate(-scene.width/2,-scene.heigth/2);
	
	scene.actors.forEach(function(actor){
	    ctx.save();	    
	    actor.draw(ctx);
	    ctx.restore();
	});
    };
};
