if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.util = {};

graphics.util.zLevelComparator = function(a,b){
    if(a.z>b.z){
	return -1;
    } else if (b.z>a.z) {
	return 1;
    }
    return 0;
};

