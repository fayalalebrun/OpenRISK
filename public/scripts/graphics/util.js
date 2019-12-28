/**
 * @fileOverview Contains utility functions.
 * @name util.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

/** A class that provides various tools and utilities that will be used throughout the JS-classes in
 * this application.
 */

export class util{
	/**
	 * Method that sorts two object based on their property 'z', which is a number.
	 * @param {*} a - The object that is to be compared
	 * @param {*} b - The object to compare with object a.
	 */
    static zLevelComparator(a,b){
	if(a.z<b.z){
	    return -1;
	} else if (b.z<a.z) {
	    return 1;
	}
	return 0;
    };
	/**
	 * Returns a string/textual representation of the color grid of the object. Based on the RGB color model.
	 * @param {number} r - The value of Red.
	 * @param {number} g - The value of Green.
	 * @param {number} b - The value of Blue.
	 */
    static rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
    }
	
	/**
	 * Checks if current transformed rectangle contains absolute coordinates.
	 * @param {*} ctx - The current, transformed rectangle to be checked.
	 * @param {*} width - The width of ctx.
	 * @param {*} height - The height of ctx.
	 * @param {*} x - The x-coordinates that are expected to be inside the rectangle.
	 * @param {*} y - The y-coordinates that are expected to be inside the rectangle.
	 */
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
