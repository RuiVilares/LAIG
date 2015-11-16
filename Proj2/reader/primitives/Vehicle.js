/**
 * Vehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Vehicle(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.quad=new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
	var controlPointU1 = {x: 0, y: 0, z: 0}; var controlPointB1 = {x: 0, y: 0, z: 0};
	var controlPointU2 = {x: 0, y: 0, z: 0.5}; var controlPointB2 = {x: 0, y: 0, z: 0.5};
	var controlPointU3 = {x: 0, y: 0, z: 1}; var controlPointB3 = {x: 0, y: 0, z: 1};
	var controlPointU4 = {x: -0.5, y: 1, z: 0}; var controlPointB4 = {x: 0.5, y: 1, z: 0};
	var controlPointU5 = {x: -0.5, y: 1, z: 0.5}; var controlPointB5 = {x: 0.5, y: 1, z: 0.5};
	var controlPointU6 = {x: -0.5, y: 1, z: 1}; var controlPointB6 = {x: 0.5, y: 1, z: 1};
	var controlPointU7 = {x: -1, y: 0, z: 0}; var controlPointB7 = {x: 1, y: 0, z: 0};
	var controlPointU8 = {x: -1, y: 0, z: 0.5}; var controlPointB8 = {x: 1, y: 0, z: 0.5};
	var controlPointU9 = {x: -1, y: 0, z: 1}; var controlPointB9 = {x: 1, y: 0, z: 1};	
	var controlpointsListUpper = []; var controlpointsListBottom = [];
	controlpointsListUpper.push(controlPointU1, controlPointU2, controlPointU3, controlPointU4, controlPointU5, controlPointU6, controlPointU7, controlPointU8, controlPointU9);
	controlpointsListBottom.push(controlPointB1, controlPointB2, controlPointB3, controlPointB4, controlPointB5, controlPointB6, controlPointB7, controlPointB8, controlPointB9);
	this.wingUpper=new Patch(this.scene, 2, 20, 20, controlpointsListUpper);
	this.wingBottom=new Patch(this.scene, 2, 20, 20, controlpointsListBottom);
 };

 Vehicle.prototype = Object.create(CGFobject.prototype);
 Vehicle.prototype.constructor = Vehicle;
 
/**
 * Display the primitive
 */
 Vehicle.prototype.display = function () {

    // Top face
    this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
		this.quad.display();
    this.scene.popMatrix();

    // Down face
    this.scene.pushMatrix();
		this.scene.translate(0, -0.5, 0);
		this.scene.rotate(Math.PI/2, 1.0, 0, 0);
		this.quad.display();
    this.scene.popMatrix();

    // z front face
    this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
    this.scene.popMatrix();

    // z back face
    this.scene.pushMatrix();
		this.scene.translate(0, 0, -0.5);
		this.scene.rotate(Math.PI, 1.0, 0, 0);
		this.quad.display();
    this.scene.popMatrix();

    // x front face
    this.scene.pushMatrix();
		this.scene.translate(0.5, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.quad.display();
    this.scene.popMatrix();

    // x back face
    this.scene.pushMatrix();
		this.scene.translate(-0.5, 0, 0);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.quad.display();
    this.scene.popMatrix();
	
	// wing left upper
    this.scene.pushMatrix();
		this.scene.translate(0.5, 0, -0.5);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.wingUpper.display();
    this.scene.popMatrix();
	
	// wing right upper
    this.scene.pushMatrix();
		this.scene.translate(0.5, 0, 1.5);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.wingUpper.display();
    this.scene.popMatrix();
	
	// wing left bottom
    this.scene.pushMatrix();
		this.scene.translate(-0.5, 0, -0.5);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.wingBottom.display();
    this.scene.popMatrix();
	
	// wing right bottom
    this.scene.pushMatrix();
		this.scene.translate(0.5, 0, 0.5);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.wingBottom.display();
    this.scene.popMatrix();
}