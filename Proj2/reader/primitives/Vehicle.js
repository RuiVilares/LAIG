function Vehicle(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.quad=new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
	var controlPoint1 = {x: 0, y: 0, z: 1};
	var controlPoint2 = {x: 0, y: 0, z: 0};
	var controlPoint3 = {x: 0, y: 0, z: 0.5};
	var controlPoint4 = {x: 0.5, y: 0, z: 1};
	var controlPoint5 = {x: 0.5, y: 1, z: 0};
	var controlPoint6 = {x: 0.5, y: 1, z: 0.5};
	var controlPoint7 = {x: 1, y: 0, z: 1};
	var controlPoint8 = {x: 1, y: 0, z: 0};
	var controlPoint9 = {x: 1, y: 0, z: 0.5};
	var controlpointsListUpper = []; var controlpointsListBottom = [];
	controlpointsListUpper.push(controlPoint1, controlPoint2, controlPoint3, controlPoint4, controlPoint5, controlPoint6, controlPoint7, controlPoint8, controlPoint9);
	controlpointsListBottom.push(controlPoint2, controlPoint3, controlPoint1, controlPoint5, controlPoint6, controlPoint4, controlPoint8, controlPoint9, controlPoint7);
	this.wingUpper=new Patch(this.scene, 2, 20, 20, controlpointsListUpper);
	this.wingBottom=new Patch(this.scene, 2, 20, 20, controlpointsListBottom);
 };

 Vehicle.prototype = Object.create(CGFobject.prototype);
 Vehicle.prototype.constructor = Vehicle;
 
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
		this.scene.translate(-1, 0, -0.5);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.scale(1, 1, 1.5);
		this.wingUpper.display();
    this.scene.popMatrix();
	
	// wing right upper
    this.scene.pushMatrix();
		this.scene.translate(1, 0, 0.5);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.scene.scale(1, 1, 1.5);
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