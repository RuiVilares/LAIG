MarkerColors.prototype.constructor=MarkerColors;

function MarkerColors(scene) {
	this.red = new CGFappearance(scene);
	this.red.setAmbient(0.55,0,0,1);
	this.red.setDiffuse(0.55,0,0,1);
	this.red.setSpecular(0.55,0,0,1);
	this.red.setEmission(0,0,0,1);
	this.red.setShininess(10);

	this.orange = new CGFappearance(scene);
	this.orange.setAmbient(0.78,0.43,0.02,1);
	this.orange.setDiffuse(0.78,0.43,0.02,1);
	this.orange.setSpecular(0.78,0.43,0.02,1);
	this.orange.setEmission(0,0,0,1);
	this.orange.setShininess(10);
	
 	this.invisibleTexture = new CGFtexture(scene, "scenes/textures/invisibleTexture.png");
};