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
  this.heightMarker = new Marker(this.scene);

  this.grey = new CGFappearance(scene);
	this.grey.setAmbient(0.2,0.2,0.2,1);
	this.grey.setDiffuse(0.2,0.2,0.2,1);
	this.grey.setSpecular(0.2,0.2,0.2,1);
	this.grey.setEmission(0,0,0,1);
	this.grey.setShininess(10);
  this.textureBoard = new CGFtexture(this.scene, "scenes/textures/Board.png");
 };

 gameBoard.prototype = Object.create(CGFobject.prototype);
 gameBoard.prototype.constructor = gameBoard;

/**
 * Display the primitive
 */
 gameBoard.prototype.display = function () {

   this.textureBoard.bind();
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

   this.textureBoard.unbind();
	this.grey.apply();

   for (var i = 0; i < 7; i++) {
   	for (var j = 0; j < 7; j++) {
 		this.scene.pushMatrix();
 		this.scene.translate(j*1.2,0,i*1.2);
 		this.drawPlus();
   		this.scene.popMatrix();
   	}
   }

   this.drawBordersVertical();
   this.drawBordersHorizontal();
}

 gameBoard.prototype.drawPlus = function () {
 	this.scene.pushMatrix();
     this.scene.translate(1.2, 0.1, 1);
     this.scene.scale(0.2, 2, 0.6);
     this.heightMarker.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
     this.scene.translate(1, 0.1, 1.4);
   	 this.scene.rotate(Math.PI/2, 0,1,0);
     this.scene.scale(0.2, 2, 0.6);
     this.heightMarker.display();
   this.scene.popMatrix();
 }

 gameBoard.prototype.drawBordersVertical = function () {
 	this.scene.pushMatrix();
     this.scene.translate(0, 0.1, 0);
     this.scene.scale(0.2, 2, 9.8);
     this.heightMarker.display();
   this.scene.popMatrix();

 	this.scene.pushMatrix();
     this.scene.translate(9.6, 0.1, 0);
     this.scene.scale(0.2, 2, 9.8);
     this.heightMarker.display();
   this.scene.popMatrix();
 }

 gameBoard.prototype.drawBordersHorizontal = function () {
   this.scene.pushMatrix();
     this.scene.translate(0, 0.1, 0.2);
   	 this.scene.rotate(Math.PI/2, 0,1,0);
     this.scene.scale(0.2, 2, 9.8);
     this.heightMarker.display();
   this.scene.popMatrix();
     
   this.scene.pushMatrix();
     this.scene.translate(0, 0.1, 9.8);
   	 this.scene.rotate(Math.PI/2, 0,1,0);
     this.scene.scale(0.2, 2, 9.8);
     this.heightMarker.display();
   this.scene.popMatrix();
 }