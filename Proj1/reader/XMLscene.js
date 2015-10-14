
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
	this.square = new MyQuad(this,0,1,1,0);
	this.triangle = new MyTriangle(this,2,2,0, 0,0,0, 2,0,0);
	this.sphere = new MySphere(this,1.0, 200,100);
	this.cylinder = new MyCylinder(this,3,0.1,1,200,100);
	
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
	
	this.camera.near = this.graph.initialsList[0].frustum.near;
	this.camera.far = this.graph.initialsList[0].frustum.far;

	this.setGlobalAmbientLight(this.graph.illuminationList[0].ambient.r, this.graph.illuminationList[0].ambient.g, this.graph.illuminationList[0].ambient.b, this.graph.illuminationList[0].ambient.a);

	var axisLength = this.graph.initialsList[0].reference;
	this.axis = new CGFaxis(this, axisLength);
	
	var background = this.graph.illuminationList[0].background;
	this.gl.clearColor(background.r,background.g,background.b,background.a);
	
	for (var i = 0; i < this.graph.lightsList.length; i++)
	{
		this.graph.transformToLight(this.graph.lightsList[i]);
	}
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
		this.multMatrix(this.graph.initialsList[0].transformation);
		
		// Draw axis
		this.axis.display();
		this.setDefaultAppearance();
		
		this.updateLights();
		
		var tex = null;
		var textureHasBeenWritten = false;
		for (var i = 0; i < this.leavesToDraw.length; i++)
		{
			for (var j = 0; j < this.leavesToDraw[i].matrixToApply.length; j++)
			{
				tex = this.graph.textureList[this.leavesToDraw[i].matrixToApply[j][2]];
				
				this.pushMatrix();
					this.multMatrix(this.leavesToDraw[i].matrixToApply[j][1]);
					this.leavesToDraw[i].matrixToApply[j][0].apply();

					if (tex != null && tex.id != "clear")
					{
						if (this.leavesToDraw[i].type == "triangle" || this.leavesToDraw[i].type == "rectangle")
						{
							this.leavesToDraw[i].object.scaleTexture(tex.amplif_factor.s, tex.amplif_factor.t);
						}
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

