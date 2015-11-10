LinearAnimation.prototype = new Animation();
LinearAnimation.prototype.constructor=LinearAnimation;

function LinearAnimation(controlPoints, span) {
    this.timeEachVector = span / (controlPoints.length - 1);

    this.span = span;

    this.controlPoints = controlPoints;
 
    this.vectors = this.createVectors(controlPoints);
}

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

    var angleVar = 0;
    angleVar -= this.compute3dAngle(1,0,0, vectorsAux[0].x,vectorsAux[0].y,vectorsAux[0].z);

    vectors.push({
            x: vectorsAux[0].x,
            y: vectorsAux[0].y,
            z: vectorsAux[0].z,
            angle: angleVar
            });

    for (var i = 1; i < vectorsAux.length; i++) {
        angleVar -= this.compute3dAngle(vectorsAux[i-1].x,vectorsAux[i-1].y,vectorsAux[i-1].z, vectorsAux[i].x,vectorsAux[i].y,vectorsAux[i].z);
        
        vectors.push({
            x: vectorsAux[i].x,
            y: vectorsAux[i].y,
            z: vectorsAux[i].z,
            angle: angleVar
            });
    }

    return vectors;
}

LinearAnimation.prototype.compute3dAngle = function(x1,y1,z1, x2,y2,z2) {
    var angle = Math.atan2(z2, x2) - Math.atan2(z1, x1);
    return angle;
}

LinearAnimation.prototype.computeMatrix = function(m, time) {
    var matrix = mat4.create();
	mat4.identity(matrix);

	time = Math.min(time, this.span-0.01);

	var vectorIndex = Math.floor(time / this.timeEachVector);
	var howLong = (time % this.timeEachVector) / this.timeEachVector;

    mat4.translate(matrix, matrix, [this.vectors[vectorIndex].x * howLong,
                                    this.vectors[vectorIndex].y * howLong,
                                    this.vectors[vectorIndex].z * howLong]);
    mat4.translate(matrix, matrix, [this.controlPoints[vectorIndex].x, this.controlPoints[vectorIndex].y, this.controlPoints[vectorIndex].z]);
   
    mat4.rotate(matrix, matrix, this.vectors[vectorIndex].angle, [0,1,0]);
    
    mat4.multiply(m, m, matrix);
}