CircularAnimation.prototype = new Animation();
CircularAnimation.prototype.constructor=CircularAnimation;

/**
 * Creates a circular animation
 * @constructor
 * @param {Number} center - The center of the animation
 * @param {Number} radius - The radius of the animation
 * @param {Number} span - The span of the animation
 * @param {Number} angInitial - The angInitial of the animation
 * @param {Number} angRot - The angRot of the animation
 */
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

/**
 * Computes the place of the object at a giving time
 * @param {Matrix} m - The matrix of the animation
 * @param {Number} time - The current seconds elapsed
 */
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