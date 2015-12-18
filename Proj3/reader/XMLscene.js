/**
* Creates a custom XML scene
* @constructor
* @param {Interface} myInterface
*/
function XMLscene(myInterface) {
  CGFscene.call(this);
  this.myInterface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.initLights();
  this.enableTextures(true);

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  this.gl.depthMask(true);

  this.gl.depthFunc(this.gl.LEQUAL);
  this.gl.frontFace(this.gl.CCW);
  this.gl.cullFace(this.gl.BACK);

  this.axis=new CGFaxis(this);

  this.lightsBoolean = [false,false,false,false,false,false,false,false];
  this.boardLenght = 8;
  this.objectsForPicking = [];
  for(var i=0; i<Math.pow(this.boardLenght,2);i++){
    this.objectsForPicking.push(new Marker(this));
  }
  this.boardPosition = 0;

  var fps = 60;
  this.setUpdatePeriod(1000/fps);

  this.setPickEnabled(true);

  this.board = new Board(this);
  this.markerColors = new MarkerColors(this);
  this.piece = new Piece(this);
  this.scene = "Scene1.lsx";

  this.moveCamera = false;
  this.rotatingCamera = false;
  this.angleCamera = 0;

  this.initTime = this.lastUpdate;


/*
	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
  this.fontTexture = new CGFtexture(this, "scenes/textures/oolite-font.png");
	this.appearance.setTexture(this.fontTexture);

	// plane where texture character will be rendered
	this.plane=new PlaneShader(this);
	
	// instatiate text shader
	this.textShader=new CGFshader(this.gl, "scenes/shaders/font.vert", "scenes/shaders/font.frag");

	// set number of rows and columns in font texture
	this.textShader.setUniformsValues({'dims': [16, 16]});*/
};

XMLscene.prototype.initLights = function () {

  this.lights[0].setPosition(0, 1, 1.5, 1);
  this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
  this.lights[0].update();

  this.lights[1].setPosition(0, 1, -1.5, 1);
  this.lights[1].setDiffuse(1.0,1.0,1.0,1.0);
  this.lights[1].update();

};

XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)), vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));
  this.cameraIndependent = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)), vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));
};

XMLscene.prototype.setDefaultAppearance = function () {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  this.camera.near = this.graph.initialsList.frustum.near;
  this.camera.far = this.graph.initialsList.frustum.far;

  this.setGlobalAmbientLight(this.graph.illuminationList.ambient.r, this.graph.illuminationList.ambient.g, this.graph.illuminationList.ambient.b, this.graph.illuminationList.ambient.a);

  var axisLength = this.graph.initialsList.reference;
  this.axis = new CGFaxis(this, axisLength);

  var background = this.graph.illuminationList.background;
  this.gl.clearColor(background.r,background.g,background.b,background.a);

  var processLights = new ProcessLights(this);

  for (var i = 0; i < this.graph.lightsList.length; i++)
  {
    processLights.transformToLight(this.graph.lightsList[i]);
  }

  this.materialIndex = 0;
  this.matrixIndex = 1;
  this.textureIndex = 2;

  this.initTime = this.lastUpdate;
};


XMLscene.prototype.logPicking = function ()
{
  if (this.pickMode == false) {
    if (this.pickResults != null && this.pickResults.length > 0) {
      for (var i=0; i< this.pickResults.length; i++) {
        var obj = this.pickResults[i][0];
        if (obj)
        {
          var customId = this.pickResults[i][1];
          console.log("Picked object: " + obj + ", with pick id " + customId);
          this.board.sendMove(customId);
        }
      }
      this.pickResults.splice(0,this.pickResults.length);
    }
  }
};


XMLscene.prototype.display = function () {
  this.board.makePlay();

  this.logPicking();
  this.clearPickRegistration();

  // ---- BEGIN Background, camera and axis setup
  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

/*
  //HUD
  this.pushMatrix();
    this.translate(-3.65,1.52,-10);
    this.scale(0.1,0.1,1);
    this.setActiveShaderSimple(this.textShader);
    this.activeShader.setUniformsValues({'charCoords': [12,4]});
    this.appearance.apply();
    this.plane.display();
    this.setActiveShaderSimple(this.defaultShader);
  this.popMatrix();*/

  // Apply transformations corresponding to the camera position relative to the origin
  //this.applyViewMatrix();
  this.multMatrix(this.cameraIndependent.getViewMatrix());

  this.orbitTheCamera();

  //this.camera.orbit(1,Math.PI/360);

  // ---- END Background, camera and axis setup

  // it is important that things depending on the proper loading of the graph
  // only get executed after the graph has loaded correctly.
  // This is one possible way to do it

  if (this.graph.loadedOk)
  {
    this.multMatrix(this.graph.initialsList.transformation);

    // Draw axis
    this.axis.display();
    this.setDefaultAppearance();

    this.updateLights();


    this.graph.processTree.fillTexturesMaterialsAndProcessMatrix();
    
    this.translate(-4.8,0,0);
    for (var i=0; i<this.boardLenght; i++) {
      for (var j=0; j<this.boardLenght; j++) {
        if (this.board.board[i][j][0] == -1) {
          continue;
        }

        this.pushMatrix();
        this.translate(0.3+1.2*j, 0.01, 0.3+1.2*i);

        if (this.board.board[i][j][0] == 0) {
            this.piece.white.apply();
        } else if (this.board.board[i][j][0] == 1) {
            this.piece.red.apply();
        } else {
            this.piece.orange.apply();
        }
        this.piece.display();

        this.popMatrix();
      }
    }

    this.setDefaultAppearance();

    this.pushMatrix();
    this.multMatrix(this.boardPosition);
    this.translate(4.8,0,0);

    for (var i=0; i<this.boardLenght; i++) {
      for (var j=0; j<this.boardLenght; j++) {
        this.pushMatrix();
        this.translate(0.2+1.2*j, 0.01, 0.2+1.2*i);
        this.registerForPick(i*this.boardLenght+j+1, this.objectsForPicking[i]);
        if (this.board.board[i][j][1] == -1) {
          this.markerColors.invisibleTexture.bind();
          this.objectsForPicking[i].display();
          this.markerColors.invisibleTexture.unbind();
        } else {
          if (this.board.board[i][j][1] == 11) {
            this.markerColors.red.apply();
          }
          else {
            this.markerColors.orange.apply();
          }
          this.objectsForPicking[i].display();
        }
        this.popMatrix();
      }
    }
    this.popMatrix();
  }
};

/**
* This funciton will be called every fps (default 60) milliseconds
* Draw the scene and the time is specially useful for the animations
* @param {Number} currTime - The current time
*/
XMLscene.prototype.update = function (currTime) {
  this.secondsElapsed = (currTime-this.initTime)/1000;
};

XMLscene.prototype.updateLights = function(){
  for(var i = 0; i < this.lightsBoolean.length; i++){
    if(this.lightsBoolean[i])
    this.lights[i].enable();
    else this.lights[i].disable();
    this.lights[i].update();
  }
};

XMLscene.prototype.changeScene = function() {
	console.log("scene");
	if (this.scene == "Scene1.lsx") {
	  this.scene = "Scene2.lsx";
	} else {
	  this.scene = "Scene1.lsx";
	}

	new MySceneGraph(this.scene, this);
};

XMLscene.prototype.orbitTheCamera = function() {
	this.angleCamera++;
	
    if (!this.moveCamera || !this.rotatingCamera) {
      this.angleCamera = 0;
	  this.rotatingCamera = false;
      this.cameraIndependent.setPosition(vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)));
      this.cameraIndependent.setTarget(vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));
      if (this.moveCamera)
        this.cameraIndependent.orbit(1,Math.PI*(this.board.playerTurn-1));
      return;
    }
    
    this.cameraIndependent.setPosition(vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)));
    this.cameraIndependent.setTarget(vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));
	
	this.cameraIndependent.orbit(1,Math.PI*this.board.playerTurn);
	this.cameraIndependent.orbit(1,(Math.PI*this.angleCamera)/180);

	if (this.angleCamera > 180) {
	  this.angleCamera = 0;
	  this.rotatingCamera = false;
	}
};