export default class util{
    static zLevelComparator(a,b){
	if(a.z<b.z){
	    return -1;
	} else if (b.z<a.z) {
	    return 1;
	}
	return 0;
    };

    //Checks if current transformed rectangle contains absolute coordinates
    static rectContainsCoordinates(ctx,width,height,x,y){
	ctx.beginPath();
	ctx.rect(0,0,width,height);
	ctx.globalAlpha = 0;
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.closePath();
	return ctx.isPointInPath(x,y);
    };
}
