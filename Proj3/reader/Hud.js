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

  this.blackAppearance = new CGFappearance(scene);
	this.blackAppearance.setAmbient(0, 0, 0, 1);
	this.blackAppearance.setDiffuse(0, 0, 0, 1);
	this.blackAppearance.setSpecular(0, 0, 0, 1);
	this.blackAppearance.setShininess(120);

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
     this.scene.translate(-3.655,1.53,-10);
     this.blackAppearance.apply();
     this.plane.display();
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
  switch (char) {

    case '0':
      this.scene.activeShader.setUniformsValues({'charCoords': [0,3]});
      break;
    case '1':
      this.scene.activeShader.setUniformsValues({'charCoords': [1,3]});
      break;
    case '2':
      this.scene.activeShader.setUniformsValues({'charCoords': [2,3]});
      break;
    case '3':
      this.scene.activeShader.setUniformsValues({'charCoords': [3,3]});
      break;
    case '4':
      this.scene.activeShader.setUniformsValues({'charCoords': [4,3]});
      break;
    case '5':
      this.scene.activeShader.setUniformsValues({'charCoords': [5,3]});
      break;
    case '6':
      this.scene.activeShader.setUniformsValues({'charCoords': [6,3]});
      break;
    case '7':
      this.scene.activeShader.setUniformsValues({'charCoords': [7,3]});
      break;
    case '8':
      this.scene.activeShader.setUniformsValues({'charCoords': [8,3]});
      break;
    case '9':
      this.scene.activeShader.setUniformsValues({'charCoords': [9,3]});
      break;

    case 'A':
      this.scene.activeShader.setUniformsValues({'charCoords': [1,4]});
      break;
    case 'B':
      this.scene.activeShader.setUniformsValues({'charCoords': [2,4]});
      break;
    case 'C':
      this.scene.activeShader.setUniformsValues({'charCoords': [3,4]});
      break;
    case 'D':
      this.scene.activeShader.setUniformsValues({'charCoords': [4,4]});
      break;
    case 'E':
      this.scene.activeShader.setUniformsValues({'charCoords': [5,4]});
      break;
    case 'F':
      this.scene.activeShader.setUniformsValues({'charCoords': [6,4]});
      break;
    case 'G':
      this.scene.activeShader.setUniformsValues({'charCoords': [7,4]});
      break;
    case 'H':
      this.scene.activeShader.setUniformsValues({'charCoords': [8,4]});
      break;
    case 'I':
      this.scene.activeShader.setUniformsValues({'charCoords': [9,4]});
      break;
    case 'J':
      this.scene.activeShader.setUniformsValues({'charCoords': [10,4]});
      break;
    case 'K':
      this.scene.activeShader.setUniformsValues({'charCoords': [11,4]});
      break;
    case 'L':
      this.scene.activeShader.setUniformsValues({'charCoords': [12,4]});
      break;
    case 'M':
      this.scene.activeShader.setUniformsValues({'charCoords': [13,4]});
      break;
    case 'N':
      this.scene.activeShader.setUniformsValues({'charCoords': [14,4]});
      break;
    case 'O':
      this.scene.activeShader.setUniformsValues({'charCoords': [15,4]});
      break;
    case 'P':
      this.scene.activeShader.setUniformsValues({'charCoords': [0,5]});
      break;
    case 'Q':
      this.scene.activeShader.setUniformsValues({'charCoords': [1,5]});
      break;
    case 'R':
      this.scene.activeShader.setUniformsValues({'charCoords': [2,5]});
      break;
    case 'S':
      this.scene.activeShader.setUniformsValues({'charCoords': [3,5]});
      break;
    case 'T':
      this.scene.activeShader.setUniformsValues({'charCoords': [4,5]});
      break;
    case 'U':
      this.scene.activeShader.setUniformsValues({'charCoords': [5,5]});
      break;
    case 'V':
      this.scene.activeShader.setUniformsValues({'charCoords': [6,5]});
      break;
    case 'W':
      this.scene.activeShader.setUniformsValues({'charCoords': [7,5]});
      break;
    case 'X':
      this.scene.activeShader.setUniformsValues({'charCoords': [8,5]});
      break;
    case 'Y':
      this.scene.activeShader.setUniformsValues({'charCoords': [9,5]});
      break;
    case 'Z':
      this.scene.activeShader.setUniformsValues({'charCoords': [10,5]});
      break;

    case 'a':
      this.scene.activeShader.setUniformsValues({'charCoords': [1,6]});
      break;
    case 'b':
      this.scene.activeShader.setUniformsValues({'charCoords': [2,6]});
      break;
    case 'c':
      this.scene.activeShader.setUniformsValues({'charCoords': [3,6]});
      break;
    case 'd':
      this.scene.activeShader.setUniformsValues({'charCoords': [4,6]});
      break;
    case 'e':
      this.scene.activeShader.setUniformsValues({'charCoords': [5,6]});
      break;
    case 'f':
      this.scene.activeShader.setUniformsValues({'charCoords': [6,6]});
      break;
    case 'g':
      this.scene.activeShader.setUniformsValues({'charCoords': [7,6]});
      break;
    case 'h':
      this.scene.activeShader.setUniformsValues({'charCoords': [8,6]});
      break;
    case 'i':
      this.scene.activeShader.setUniformsValues({'charCoords': [9,6]});
      break;
    case 'j':
      this.scene.activeShader.setUniformsValues({'charCoords': [10,6]});
      break;
    case 'k':
      this.scene.activeShader.setUniformsValues({'charCoords': [11,6]});
      break;
    case 'l':
      this.scene.activeShader.setUniformsValues({'charCoords': [12,6]});
      break;
    case 'm':
      this.scene.activeShader.setUniformsValues({'charCoords': [13,6]});
      break;
    case 'n':
      this.scene.activeShader.setUniformsValues({'charCoords': [14,6]});
      break;
    case 'o':
      this.scene.activeShader.setUniformsValues({'charCoords': [15,6]});
      break;
    case 'p':
      this.scene.activeShader.setUniformsValues({'charCoords': [0,7]});
      break;
    case 'q':
      this.scene.activeShader.setUniformsValues({'charCoords': [1,7]});
      break;
    case 'r':
      this.scene.activeShader.setUniformsValues({'charCoords': [2,7]});
      break;
    case 's':
      this.scene.activeShader.setUniformsValues({'charCoords': [3,7]});
      break;
    case 't':
      this.scene.activeShader.setUniformsValues({'charCoords': [4,7]});
      break;
    case 'u':
      this.scene.activeShader.setUniformsValues({'charCoords': [5,7]});
      break;
    case 'v':
      this.scene.activeShader.setUniformsValues({'charCoords': [6,7]});
      break;
    case 'w':
      this.scene.activeShader.setUniformsValues({'charCoords': [7,7]});
      break;
    case 'x':
      this.scene.activeShader.setUniformsValues({'charCoords': [8,7]});
      break;
    case 'y':
      this.scene.activeShader.setUniformsValues({'charCoords': [9,7]});
      break;
    case 'z':
      this.scene.activeShader.setUniformsValues({'charCoords': [10,7]});
      break;

    case ':':
      this.scene.activeShader.setUniformsValues({'charCoords': [10,3]});
      break;
    case '-':
      this.scene.activeShader.setUniformsValues({'charCoords': [13,2]});
      break;


    default:
      this.scene.activeShader.setUniformsValues({'charCoords': [9,0]});
  }
}
