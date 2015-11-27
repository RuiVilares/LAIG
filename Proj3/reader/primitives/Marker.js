/**
 * Marker
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Marker(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.quad=new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
 };

 Marker.prototype = Object.create(CGFobject.prototype);
 Marker.prototype.constructor = Marker;

/**
 * Display the primitive
 */
 Marker.prototype.display = function () {

    // Top face
    this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
		this.quad.display();
    this.scene.popMatrix();

    // Down face
    this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1.0, 0, 0);
		this.quad.display();
    this.scene.popMatrix();
}
