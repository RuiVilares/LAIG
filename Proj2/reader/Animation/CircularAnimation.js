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