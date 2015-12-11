/**
 * gameBoard
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function gameBoard(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.quad=new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
  this.quadWText=new MyQuadWText(this.scene, -0.5, 0.5, 0.5, -0.5);
 };

 gameBoard.prototype = Object.create(CGFobject.prototype);
 gameBoard.prototype.constructor = gameBoard;

/**
 * Display the primitive
 */
 gameBoard.prototype.display = function () {
   // Top face
   this.scene.pushMatrix();
   this.scene.translate(4.9, 0.1, 4.9);
   this.scene.scale(9.8, 1, 9.8);
   this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
   this.quad.display();
   this.scene.popMatrix();

   // Down face
   this.scene.pushMatrix();
   this.scene.translate(4.9, 0, 4.9);
   this.scene.scale(9.8, 1, 9.8);
   this.scene.rotate(Math.PI/2, 1.0, 0, 0);
   this.quadWText.display();
   this.scene.popMatrix();

   // z front face
   this.scene.pushMatrix();
   this.scene.translate(4.9, 0.05, 9.8);
   this.scene.scale(9.8, 0.1, 1);
   this.quadWText.display();
   this.scene.popMatrix();

   // z back face
   this.scene.pushMatrix();
   this.scene.translate(4.9, 0.05, 0);
   this.scene.scale(9.8, 0.1, 1);
   this.scene.rotate(Math.PI, 1.0, 0, 0);
   this.quadWText.display();
   this.scene.popMatrix();

   // x front face
   this.scene.pushMatrix();
   this.scene.translate(9.8, 0.05, 4.9);
   this.scene.scale(1, 0.1, 9.8);
   this.scene.rotate(Math.PI/2, 0, 1, 0);
   this.quadWText.display();
   this.scene.popMatrix();

   // x back face
   this.scene.pushMatrix();
   this.scene.translate(0, 0.05, 4.9);
   this.scene.scale(1, 0.1, 9.8);
   this.scene.rotate(-Math.PI/2, 0, 1, 0);
   this.quadWText.display();
   this.scene.popMatrix();
}
