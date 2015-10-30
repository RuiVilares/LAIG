
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
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

	this.lights[0].setPosition(0, 1, 1.5, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();

	this.lights[1].setPosition(0, 1, -1.5, 1);
    this.lights[1].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[1].update();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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
	this.leavesToDraw = this.graph.leafList;
	
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
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	
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
		
		var tex = null;
		var textureHasBeenWritten = false;
		//go through all the leaves
		for (var i = 0; i < this.leavesToDraw.length; i++)
		{
			//go through all the leaf's transformations
			for (var j = 0; j < this.leavesToDraw[i].matrixToApply.length; j++)
			{
				//copy of the texture to a new variable
				tex = this.graph.textureList[this.leavesToDraw[i].matrixToApply[j][this.textureIndex]];
				//push current scene's matrix
				this.pushMatrix();
					//apply node's transformation
					this.multMatrix(this.leavesToDraw[i].matrixToApply[j][this.matrixIndex]);
					
					//apply node's material
					this.leavesToDraw[i].matrixToApply[j][this.materialIndex].apply();

					if (tex != null && tex.id != "clear")
					{
						if (this.leavesToDraw[i].type == "triangle" || this.leavesToDraw[i].type == "rectangle")
						{
							//apply texture scaling in case of triangle or rectangle
							this.leavesToDraw[i].object.scaleTexture(tex.amplif_factor.s, tex.amplif_factor.t);
						}
						//draw texture
						tex.obj.bind();
						textureHasBeenWritten = true;
					}
					else
					{
						textureHasBeenWritten = false;
					}
					this.leavesToDraw[i].object.display();

					if (textureHasBeenWritten)
					{
						//undraw texture
						tex.obj.unbind();
					}
				this.popMatrix();
			}
		}
	};

    this.shader.unbind();
};

XMLscene.prototype.updateLights = function(){
	for(var i = 0; i < this.lightsBoolean.length; i++){
		if(this.lightsBoolean[i])
			this.lights[i].enable();
		else this.lights[i].disable();
		this.lights[i].update();
	}
};

