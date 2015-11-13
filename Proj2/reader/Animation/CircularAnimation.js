CircularAnimation.prototype = new Animation();
CircularAnimation.prototype.constructor=CircularAnimation;

function CircularAnimation(center, radius, span, angInitial, angRot) {
    this.center = center;
    this.radius = radius;
    this.span = span;
    this.angInitial = angInitial;
    this.angRot = angRot;

    this.pointInitial = {
        x: radius*Math.cos(angInitial),
        y: 0,
        z: radius*Math.sin(angInitial)
    }
}

CircularAnimation.prototype.computeMatrix = function(m, time) {
    var matrix = mat4.create();
	mat4.identity(matrix);

	time = Math.min(time, this.span-0.01);
	var howLong = Math.min((time % this.span) / this.span, 1);

    mat4.translate(matrix, matrix, [this.center.x,
                                    this.center.y,
                                    this.center.z]);
    mat4.rotate(matrix, matrix, -this.angRot * howLong, [0,1,0]);
    mat4.translate(matrix, matrix, [this.pointInitial.x,
                                    this.pointInitial.y,
                                    this.pointInitial.z]);
    
    mat4.multiply(m, m, matrix);
}