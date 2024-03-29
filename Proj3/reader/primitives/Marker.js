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
   this.scene.translate(0.5, 0.1, 0.5);
   this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
   this.quad.display();
   this.scene.popMatrix();

   // Down face
   this.scene.pushMatrix();
   this.scene.translate(0.5, 0, 0.5);
   this.scene.rotate(Math.PI/2, 1.0, 0, 0);
   this.quad.display();
   this.scene.popMatrix();

   // z front face
   this.scene.pushMatrix();
   this.scene.translate(0.5, 0.05, 1);
   this.scene.scale(1, 0.1, 1);
   this.quad.display();
   this.scene.popMatrix();

   // z back face
   this.scene.pushMatrix();
   this.scene.translate(0.5, 0.05, 0);
   this.scene.rotate(Math.PI, 1.0, 0, 0);
   this.scene.scale(1, 0.1, 1);
   this.quad.display();
   this.scene.popMatrix();

   // x front face
   this.scene.pushMatrix();
   this.scene.translate(1, 0.05, 0.5);
   this.scene.rotate(Math.PI/2, 0, 1, 0);
   this.scene.scale(1, 0.1, 1);
   this.quad.display();
   this.scene.popMatrix();

   // x back face
   this.scene.pushMatrix();
   this.scene.translate(0, 0.05, 0.5);
   this.scene.rotate(-Math.PI/2, 0, 1, 0);
   this.scene.scale(1, 0.1, 1);
   this.quad.display();
   this.scene.popMatrix();
}
