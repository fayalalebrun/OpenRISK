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

    function transformContext(ctx){
	ctx.translate(scene.x,scene.y);
	ctx.translate(scene.width/2,scene.height/2);
	ctx.rotate(scene.rotation);
	ctx.translate(-scene.width/2,-scene.height/2);
	
    }

    this.draw = function(ctx){
	transformContext(ctx);
	
	scene.actors.forEach(function(actor){
	    ctx.save();	    
	    actor.draw(ctx);
	    ctx.restore();
	});
    };

    this.eventHitTest = function(ctx,event,x,y){
	transformContext(ctx);

	if(!graphics.util.rectContainsCoordinates(ctx, scene.width, scene.height, x, y)){
	    return false;
	}
	
	return scene.actors.some(function(actor){
	    ctx.save();	    
	    let res = actor.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	});
    };

    this.addActor = function(actor) {
	scene.actors.push(actor);
    };
};
