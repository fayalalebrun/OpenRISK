if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.Actor = function (scene, x, y, z, width, height, rotation, scale, img) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.img = img;
    this.children = [];

    let actor = this;

    function transformContext(ctx){
	ctx.translate(actor.x,actor.y);
	ctx.translate(actor.width/2,actor.height/2);
	ctx.rotate(actor.rotation);
	ctx.translate(-actor.width/2,-actor.height/2);
	ctx.scale(actor.scale,actor.scale);
    }

    this.draw = function(ctx) {
	transformContext(ctx);

	ctx.drawImage(actor.img,0,0);

	actor.children.sort(graphics.util.zLevelComparator);
	
	actor.children.forEach(function(child){
	    ctx.save();
	    child.draw(ctx,options);
	    ctx.restore();
	});
    };

    this.eventHitTest = function(ctx,event,x,y) {
	transformContext(ctx);

	actor.children.sort(graphics.util.zLevelComparator);
	if (actor.children.some(function(child){
	    ctx.save();
	    let res = child.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	})) {
	    return true;
	}
	return graphics.util.rectContainsCoordinates(ctx, actor.width, actor.height, x, y) && actor.onHit();
    };

    this.onHit = function() {	return false;    }; //override this function to do something on mouse hit

    this.addChild = function(actor){
	actor.children.push(actor);
    };
};
