/**
 * Piece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Piece(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.marker=new Marker(this.scene);
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
