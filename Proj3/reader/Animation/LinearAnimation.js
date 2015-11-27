LinearAnimation.prototype = new Animation();
LinearAnimation.prototype.constructor=LinearAnimation;

/**
 * Creates a linear animation
 * @constructor
 * @param {Array|Number} controlPoints - The checkpoints of the animation
 * @param {Number} span - The span of the animation
 */
function LinearAnimation(controlPoints, span) {

    this.span = span;

    this.controlPoints = controlPoints;
 
    this.vectors = this.createVectors(controlPoints);
}

/**
 * Computes the vectors from the control points. It also computes an angle
 * between the previous and the current vector. Lastly, computes the time for each vector
 * @param {Array|Number} controlPoints - The checkpoints of the animation
 * @returns {Array|Vectors} The vectors generated
 */
LinearAnimation.prototype.createVectors = function(controlPoints) {

    var vectors, vectorsAux;
    vectorsAux = [];
    vectors = [];

    for (var i = 0; i < (controlPoints.length - 1); i++) {
        vectorsAux.push({
            x: controlPoints[i+1].x - controlPoints[i].x,
            y: controlPoints[i+1].y - controlPoints[i].y,
            z: controlPoints[i+1].z - controlPoints[i].z
            });
    }

    this.totalSize = 0;

    this.totalSize += Math.sqrt(vectorsAux[0].x*vectorsAux[0].x + vectorsAux[0].y*vectorsAux[0].y + vectorsAux[0].z*vectorsAux[0].z);

    for (var i = 1; i < vectorsAux.length; i++) {
    	this.totalSize += Math.sqrt(vectorsAux[i].x*vectorsAux[i].x + vectorsAux[i].y*vectorsAux[i].y + vectorsAux[i].z*vectorsAux[i].z);
    }

    var angleVar = 0;
    angleVar -= this.compute3dAngle(1,0,0, vectorsAux[0].x,vectorsAux[0].y,vectorsAux[0].z);
    
    vectors.push({
            x: vectorsAux[0].x,
            y: vectorsAux[0].y,
            z: vectorsAux[0].z,
            angle: angleVar,
            time: (Math.sqrt(vectorsAux[0].x*vectorsAux[0].x + vectorsAux[0].y*vectorsAux[0].y + vectorsAux[0].z*vectorsAux[0].z) / this.totalSize) * this.span
            });

    for (var i = 1; i < vectorsAux.length; i++) {
        angleVar -= this.compute3dAngle(vectorsAux[i-1].x,vectorsAux[i-1].y,vectorsAux[i-1].z, vectorsAux[i].x,vectorsAux[i].y,vectorsAux[i].z);
        
        vectors.push({
            x: vectorsAux[i].x,
            y: vectorsAux[i].y,
            z: vectorsAux[i].z,
            angle: angleVar,
            time: (Math.sqrt(vectorsAux[i].x*vectorsAux[i].x + vectorsAux[i].y*vectorsAux[i].y + vectorsAux[i].z*vectorsAux[i].z) / this.totalSize) * this.span
            });
    }

    return vectors;
}

/**
 * Computes the angle between 2 points. It's only considered the axis x and z
 * @param {Point} x1,y1,z1
 * @param {Point} x2,y2,z2
 * @returns {Number} The angle
 */
LinearAnimation.prototype.compute3dAngle = function(x1,y1,z1, x2,y2,z2) {
    var angle = Math.atan2(z2, x2) - Math.atan2(z1, x1);
    return angle;
}

/**
 * Choose the index of the vector given the current time
 * @param {Number} time - Current time
 * @returns {Number} The index computed
 */
LinearAnimation.prototype.chooseIndex = function(time) {
    var timeVectors = 0;

	for (var i = 0; i < this.vectors.length; i++) {
		if (time < this.vectors[i].time+timeVectors) {
			return i;
		}

		timeVectors += this.vectors[i].time;
	}

    return this.vectors.length - 1;
}

/**
 * Compute how long the animation went in a given vector
 * @param {Number} time - Current time
 * @param {Number} index - Index of the current vector
 * @returns {Number} The percentage of vector covered
 */
LinearAnimation.prototype.chooseSize = function(index, time) {
	var timeVectors = 0;

    for (var i = 0; i <= index; i++) {
		timeVectors += this.vectors[i].time;
    }
    
    return 1-(Math.abs(time - timeVectors) / this.vectors[index].time);
}

/**
 * Computes the place of the object at a giving time
 * @param {Matrix} m - The matrix of the animation
 * @param {Number} time - The current seconds elapsed
 */
LinearAnimation.prototype.computeMatrix = function(m, time) {
    var matrix = mat4.create();
	mat4.identity(matrix);

	time = Math.min(time, this.span-0.01);

	var vectorIndex = this.chooseIndex(time);
	var howLong = this.chooseSize(vectorIndex, time);

    mat4.translate(matrix, matrix, [this.vectors[vectorIndex].x * howLong,
                                    this.vectors[vectorIndex].y * howLong,
                                    this.vectors[vectorIndex].z * howLong]);
    mat4.translate(matrix, matrix, [this.controlPoints[vectorIndex].x, this.controlPoints[vectorIndex].y, this.controlPoints[vectorIndex].z]);
   
    mat4.rotate(matrix, matrix, this.vectors[vectorIndex].angle, [0,1,0]);
    
    mat4.multiply(m, m, matrix);
}