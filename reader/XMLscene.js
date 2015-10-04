
function XMLscene() {
    CGFscene.call(this);
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

    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.frontFace(this.gl.CCW);
    this.gl.cullFace(this.gl.BACK);

	this.axis=new CGFaxis(this);
	this.square = new MyRectangle(this,0,1,1,0); //MyRectangle(scene, minX, maxY, maxX, minY)
	this.triangle = new MyTriangle(this,0,0,0,0.5,1,0,1,0,0); //MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	this.sphere = new MySphere(this,0.5,20,10); //MySphere(scene, radius, slices, stacks)
	this.cylinder = new MyCylinder(this,5,0,1,20,50); //MyCylinder(scene, height, bottomRadius, topRadius, stacks, slices)

	//this.triangle.scaleTexture(0.30,1);

	this.slidesAppearance = new CGFappearance(this);
	this.slidesAppearance.loadTexture("scenes/textures/parkingSign.png");
	this.slidesAppearance.setTextureWrap('REPEAT','REPEAT');
	this.slidesAppearance.setAmbient(0.3,0.3,0.3,1);
	this.slidesAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.slidesAppearance.setSpecular(0.2,0.2,0.2,1);
	this.slidesAppearance.setShininess(10);

	/*************************************
	lighting   = enable (i think this one is to start every lights on)
shading    = Gouraud
polygon mode = fill************************/

};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 
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
	/*this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);*/
	this.lights[0].setVisible(true);
    this.lights[0].enable();
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

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};

	this.slidesAppearance.apply();
	//this.square.display();
	this.triangle.display();
	//this.sphere.display();
	//this.cylinder.display();

    this.shader.unbind();
};

