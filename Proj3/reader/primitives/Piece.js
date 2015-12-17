/**
 * Piece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Piece(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.marker=new Marker(this.scene);

	this.red = new CGFappearance(scene);
	this.red.setAmbient(0.75,0,0,1);
	this.red.setDiffuse(0.75,0,0,1);
	this.red.setSpecular(0.75,0,0,1);
	this.red.setEmission(0,0,0,1);
	this.red.setShininess(10);

	this.orange = new CGFappearance(scene);
	this.orange.setAmbient(0.87,0.46,0,1);
	this.orange.setDiffuse(0.87,0.46,0,1);
	this.orange.setSpecular(0.87,0.46,0,1);
	this.orange.setEmission(0,0,0,1);
	this.orange.setShininess(10);

	this.white = new CGFappearance(scene);
	this.white.setAmbient(1,1,1,1);
	this.white.setDiffuse(1,1,1,1);
	this.white.setSpecular(1,1,1,1);
	this.white.setEmission(0,0,0,1);
	this.white.setShininess(10);
 };

 Piece.prototype = Object.create(CGFobject.prototype);
 Piece.prototype.constructor = Piece;

/**
 * Display the primitive
 */
 Piece.prototype.display = function () {
   // 1.
   this.scene.pushMatrix();
   this.scene.translate(0, 0, 0);
   this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
   this.scene.rotate(-Math.PI/4, 0, 0, 1);
   this.scene.scale(1, 1, 0.4);
   this.marker.display();
   this.scene.popMatrix();

   // 2.
   this.scene.pushMatrix();
   this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
   this.scene.rotate(Math.PI/4, 0, 0, 1);
   this.scene.scale(1, 1, 0.4);
   this.scene.translate(-0.45, -0.55, 0);
   this.marker.display();
   this.scene.popMatrix();
}
