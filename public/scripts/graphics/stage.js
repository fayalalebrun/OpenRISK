if(typeof graphics === 'undefined'){
    graphics = {};
}


graphics.Stage = function(renderer,z){
    this.renderer = renderer;
    this.width = 1280;
    this.height = 720;
    this.scenes = [];
    this.camera = new graphics.Stage.Camera(0,0,1);
    this.z = z;

    let stage = this;
    this.draw = function(ctx){

	ctx.translate(-stage.camera.x,-stage.camera.y);
	ctx.scale(stage.camera.zoom, stage.camera.zoom);
	
	stage.scenes.sort(graphics.util.zLevelComparator);

	stage.scenes.forEach(function(scene){
	    ctx.save();
	    scene.draw(ctx);
	    ctx.restore();
	});
    };
    this.addScene = function(scene){
	stage.scenes.push(scene);
    };
};


graphics.Stage.Camera = function(x,y,zoom) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
};
