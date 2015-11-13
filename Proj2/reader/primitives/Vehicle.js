function Vehicle(scene) {
 	CGFobject.call(this,scene);
 	this.scene = scene;
	this.quad=new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
	var controlPoint1 = {x: 0, y: 0, z: 1};
	var controlPoint2 = {x: 0, y: 0, z: 0};
	var controlPoint3 = {x: 0, y: 0, z: 0.5};
	var controlPoint4 = {x: 0.5, y: 1, z: 1};
	var controlPoint5 = {x: 0.5, y: 1, z: 0};
	var controlPoint6 = {x: 0.5, y: 1, z: 0.5};
	var controlPoint7 = {x: 1, y: 0, z: 1};
	var controlPoint8 = {x: 1, y: 0, z: 0};
	var controlPoint9 = {x: 1, y: 0, z: 0.5};
	var controlpointsList = [];
	controlpointsList.push(controlPoint1, controlPoint2, controlPoint3, controlPoint4, controlPoint5, controlPoint6, controlPoint7, controlPoint8, controlPoint9);
	this.wing=new Patch(this.scene, 2, 20, 20, controlpointsList);
	var point1 = {x: 1, y: 1, z: 1};
	var point2 = {x: -2, y: 2, z: -2};
	var point3 = {x: 3, y: 3, z: -3};
	var point4 = {x: -4, y: 4, z: 4};
	var point5 = {x: 5, y: 5, z: 0};
	var pointsList1 = []; var pointsList2 = [];
	pointsList1.push(point1, point2, point3, point4, point5);
	pointsList2.push(point5, point4, point3, point2, point1);
	var linear1 = new LinearAnimation(pointsList1, 6);
	var circular = new CircularAnimation({x: 0, y: 6, z: 0}, 5, 6, 0, 4*Math.PI);
	var linear2 = new LinearAnimation(pointsList2, 6);
	this.animationList = [];
	this.animationList.push(linear1, circular, linear2);
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
	
	// wing left
    this.scene.pushMatrix();
		this.scene.translate(0.35, 0, -0.65);
		this.wing.display();
    this.scene.popMatrix();
	
	// wing right
    this.scene.pushMatrix();
		this.scene.translate(-1.35, 0, -0.65);
		this.wing.display();
    this.scene.popMatrix();
}