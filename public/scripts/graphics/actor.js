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

    this.draw = function(ctx) {
	ctx.translate(actor.x,actor.y);
	ctx.translate(actor.width/2,actor.height/2);
	ctx.rotate(actor.rotation);
	ctx.translate(-actor.width/2,-actor.height/2);
	ctx.scale(actor.scale,actor.scale);
	
	ctx.drawImage(actor.img,0,0);

	actor.children.sort(graphics.util.zLevelComparator);
	
	actor.children.forEach(function(child){
	    ctx.save();
	    child.draw();
	    ctx.restore();
	});
    };

    this.addChild = function(actor){
	actor.children.push(actor);
    };
};
