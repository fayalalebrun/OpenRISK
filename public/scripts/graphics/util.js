/**
 * @fileOverview Contains utility functions.
 * @name util.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

export class util{
    static zLevelComparator(a,b){
	if(a.z<b.z){
	    return -1;
	} else if (b.z<a.z) {
	    return 1;
	}
	return 0;
    };

    static rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
    }

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

    static imageDataToImage(imageData) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	ctx.putImageData(imageData, 0, 0);

	var image = new Image();
	image.src = canvas.toDataURL();

	return image;
    }
}
