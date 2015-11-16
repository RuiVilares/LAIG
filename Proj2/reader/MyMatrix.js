/**
 * Create an object to process matrix
 * @constructor
 */
function MyMatrix() {
}

/**
 * Make a transformation (translation, rotation, scale) on a matrix.
 * @param {string} transformation - The name of the transformation
 * @param {Matrix} matrix - The to be processed
 */
MyMatrix.prototype.computeMatrix = function(transformation, matrix) {
    switch(transformation.type)
    {
    	case "translation":
			mat4.translate(matrix, matrix, [transformation.x, transformation.y, transformation.z]);
    		break;

    	case "rotation":
    		switch (transformation.axis)
    		{
    			case "x":
       				mat4.rotate(matrix, matrix, this.degToRad(transformation.angle), [1, 0, 0]);
    				break;
    			case "y":
       				mat4.rotate(matrix, matrix, this.degToRad(transformation.angle), [0, 1, 0]);
    				break;
    			case "z":
       				mat4.rotate(matrix, matrix, this.degToRad(transformation.angle), [0, 0, 1]);
    				break;
    		}
    		break;

    	case "scale":
                mat4.scale(matrix, matrix, [transformation.sx, transformation.sy, transformation.sz])
    		break;
    }
};

/**
 * Convert degrees to radians.
 * @param {float} degrees
 * @returns {float} The result of converting degrees to Radians
 */
MyMatrix.prototype.degToRad = function(degrees) {
	return degrees * Math.PI / 180;
};