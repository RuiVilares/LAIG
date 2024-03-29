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
  this.marker = new Marker(this);
  this.scene = "Scene1.lsx";

  this.moveCamera = false;
  this.rotatingCamera = false;
  this.angleCamera = 0;

  this.initTime = this.lastUpdate;

  this.hud = new Hud(this);
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
          //console.log("Picked object: " + obj + ", with pick id " + customId);
          if (!(this.scene.moveCamera && this.scene.rotatingCamera)) {
          		this.board.sendMove(customId);
		  }
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


  //HUD ---------------------------------------------------------------------------------

  var remainingTime = "Time: " + parseInt(this.board.RemainingTime).toString();
  var score = "Score: " + this.board.ScoreBoard;

  var ScoreToWin = "To win: " + this.board.ScoreToWin;

  var player1 = "Player 1";
  var player1Markers = "-Markers: " + this.board.pieces[0][1].toString();
  var player1Pieces = "-Pieces: " + this.board.pieces[0][0].toString();

  var player2 = "Player 2";
  var player2Markers = "-Markers: " + this.board.pieces[1][1].toString();
  var player2Pieces = "-Pieces: " + this.board.pieces[1][0].toString();

  if (this.board.gameState != 0 && this.board.gameState != 3){
    if ((60-this.board.RemainingTime) < 10)
      this.hud.display(["Start movie", "      " + parseInt(10-(60-this.board.RemainingTime)).toString(), "", "", "Player " + this.board.gameState + " won"]);
    else
      this.hud.display(["   MOVIE", "", "", "", "", "Player " + this.board.gameState + " won", "", "", "", "   MOVIE"]);
  }
  else
    this.hud.display([remainingTime, score, "", ScoreToWin, "", player1, player1Pieces, player1Markers, "", player2, player2Pieces, player2Markers]);

  // ----------------------------------------------------------------------------------


  // Apply transformations corresponding to the camera position relative to the origin
  if (this.moveCamera) {
	this.multMatrix(this.cameraIndependent.getViewMatrix());
  	//this.orbitTheCamera();
  }
  else {
  	this.applyViewMatrix();
  }

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

    this.board.boardAnimation.drawAnimation();

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
    //this.multMatrix(this.boardPosition);
    //this.translate(4.8,0,0);

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

    this.drawPiecesOutside();
    this.drawMarkersOutside();
  }
};

/**
* This function will be called every fps (default 60) milliseconds
* Draw the scene and the time is specially useful for the animations
* @param {Number} currTime - The current time
*/
XMLscene.prototype.update = function (currTime) {
  this.secondsElapsed = (currTime-this.initTime)/1000;
  this.currTime = currTime;
  if (this.moveCamera) {
  	this.orbitTheCamera();
  }
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
	//console.log("scene");
	if (this.scene == "Scene1.lsx") {
	  this.scene = "Scene2.lsx";
	} else {
	  this.scene = "Scene1.lsx";
	}

	new MySceneGraph(this.scene, this);
};

XMLscene.prototype.orbitTheCamera = function() {

    if (!this.moveCamera || !this.rotatingCamera) {
      this.angleCamera = 0;
	  this.rotatingCamera = false;
      this.cameraIndependent.setPosition(vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)));
      this.cameraIndependent.setTarget(vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));
      if (this.moveCamera)
        this.cameraIndependent.orbit(1,Math.PI*(this.board.playerTurn-1));
      return;
    }

	this.angleCamera++;

    this.cameraIndependent.setPosition(vec3.fromValues(-7*Math.sin((Math.PI*45)/180), 10, -7*Math.cos((Math.PI*45)/180)));
    this.cameraIndependent.setTarget(vec3.fromValues(1.47*Math.sin((Math.PI*45)/180), 0, 1.47*Math.cos((Math.PI*45)/180)));

	this.cameraIndependent.orbit(1,Math.PI*this.board.playerTurn);
	this.cameraIndependent.orbit(1,(Math.PI*this.angleCamera)/180);

	if (this.angleCamera > 180) {
	  this.angleCamera = 0;
	  this.rotatingCamera = false;
	}
};

XMLscene.prototype.drawPiecesOutside = function() {

    this.piece.red.apply();
	for (var i=0; i<this.board.player1PiecesOutside.length; i++) {
		if (this.board.player1PiecesOutside[i]) {
			this.pushMatrix();
				this.translate(1.3*(i%7)+0.6,0.01,-1-Math.floor(i/7));
        		this.piece.display();
			this.popMatrix();
		}
	}

    this.piece.orange.apply();
	for (var i=0; i<this.board.player2PiecesOutside.length; i++) {
		if (this.board.player2PiecesOutside[i]) {
			this.pushMatrix();
				this.translate(1.3*(i%7)+0.6,0.01,10.2+Math.floor(i/7));
        		this.piece.display();
			this.popMatrix();
		}
	}

    this.piece.white.apply();
	for (var i=0; i<this.board.jokerPiecesOutside.length; i++) {
		if (this.board.jokerPiecesOutside[i]) {
			this.pushMatrix();
				this.translate(10.4,0.01,1.5+1.6*i);
        		this.piece.display();
			this.popMatrix();
		}
	}
};

XMLscene.prototype.drawMarkersOutside = function() {

    this.markerColors.red.apply();
	for (var i=0; i<this.board.player1MarkersOutside; i++) {
		this.pushMatrix();
			this.translate(1.2*((17-i)%8)+0.2,0.01,-3.5-1.2*Math.floor((17-i)/8));
			this.marker.display();
		this.popMatrix();
	}

	this.markerColors.orange.apply();
	for (var i=0; i<this.board.player2MarkersOutside; i++) {
		this.pushMatrix();
			this.translate(1.2*((17-i)%8)+0.2,0.01,12.2+1.2*Math.floor((17-i)/8));
			this.marker.display();
		this.popMatrix();
	}
};
