CircularAnimation.prototype = new Animation();
CircularAnimation.prototype.constructor=CircularAnimation;

function CircularAnimation(center, radius, span, angInitial, angRot) {
    this.center = center;
    this.radius = radius;
    this.span = span;
    this.angInitial = angInitial;
    this.angRot = angRot;

    this.pointInitial = {
        x: radius*Math.cos(angInitial) + center.x,
        y: center.y,
        z: radius*Math.sin(angInitial) + center.z
    }
}

CircularAnimation.prototype.computeMatrix = function(m, time) {
    var matrix = mat4.create();
	mat4.identity(matrix);

	time = Math.min(time, this.span-0.01);
	//console.log("time = " + time);
	var howLong = Math.min((time % this.span) / this.span, 1);
	//console.log("howLong = " + howLong);

    mat4.rotate(matrix, matrix, this.angRot * howLong, [0,1,0]);
    mat4.translate(matrix, matrix, [this.pointInitial.x,
                                    this.pointInitial.y,
                                    this.pointInitial.z]);
    
    mat4.multiply(m, m, matrix);
}