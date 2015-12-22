/**
 * Hud
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Hud(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;

  this.appearance = new CGFappearance(scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.appearance.setShininess(120);

  this.BackgroundAppearance = new CGFappearance(scene);
	this.BackgroundAppearance.setAmbient(1, 1, 1, 1);
	this.BackgroundAppearance.setDiffuse(1, 1, 1, 1);
	this.BackgroundAppearance.setSpecular(1, 1, 1, 1);
	this.BackgroundAppearance.setShininess(120);

  var orangeTexture = new CGFtexture(this.scene, "scenes/textures/orange.png");
	this.BackgroundAppearance.setTexture(orangeTexture);

  this.fontTexture = new CGFtexture(this.scene, "scenes/textures/oolite-font.png");
	this.appearance.setTexture(this.fontTexture);

  this.plane=new PlaneShader(this.scene);

  this.textShader=new CGFshader(this.scene.gl, "scenes/shaders/font.vert", "scenes/shaders/font.frag");

  this.textShader.setUniformsValues({'dims': [16, 16]});
 };

 Hud.prototype = Object.create(CGFobject.prototype);
 Hud.prototype.constructor = Hud;

/**
 * Display the primitive
 */
 Hud.prototype.display = function (array) {

   this.scene.pushMatrix();
     this.scene.translate(-3.425,1.3,-10);
     //this.scene.translate(0,0,-10);
     this.scene.pushMatrix();
		 this.scene.scale(1.5,1.5,1);
		 this.BackgroundAppearance.apply();
		 this.plane.display();
     this.scene.popMatrix();
     for (var i = 0; i < array.length; i++){
       this.displayString(array[i], i);
     }
   this.scene.popMatrix();
}

Hud.prototype.displayString = function (string, index) {
  var array = string.split('');
  for (var i = 0; i < array.length; i++){
    this.scene.pushMatrix();
      this.scene.translate(i*0.08-0.455,0.45-index*0.08,0);
      this.scene.scale(0.09,0.09,1);
      this.scene.setActiveShaderSimple(this.textShader);
      this.selectChar(array[i]);
      this.appearance.apply();
      this.plane.display();
      this.scene.setActiveShaderSimple(this.scene.defaultShader);
    this.scene.popMatrix();
  }
}

Hud.prototype.selectChar = function (char){
  if (!isNaN(char))
    this.scene.activeShader.setUniformsValues({'charCoords': [parseInt(char),3]});
  else if (char >= 'A' && char <= 'O')
    this.scene.activeShader.setUniformsValues({'charCoords': [char.charCodeAt()-64,4]});
  else if (char >= 'P' && char <= 'Z')
    this.scene.activeShader.setUniformsValues({'charCoords': [char.charCodeAt()-80,5]});
  else if (char >= 'a' && char <= 'o')
    this.scene.activeShader.setUniformsValues({'charCoords': [char.charCodeAt()-96,6]});
  else if (char >= 'p' && char <= 'z')
    this.scene.activeShader.setUniformsValues({'charCoords': [char.charCodeAt()-112,7]});
  else if (char == ':')
    this.scene.activeShader.setUniformsValues({'charCoords': [10,3]});
  else if (char == '-')
    this.scene.activeShader.setUniformsValues({'charCoords': [13,2]});
  else
    this.scene.activeShader.setUniformsValues({'charCoords': [9,0]});
}
