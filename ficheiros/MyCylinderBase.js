  function MyCylinderBase(scene,slices) {
 	CGFobject.call(this,scene);
	this.slices = slices;
 	this.initBuffers();
 };

 MyCylinderBase.prototype = Object.create(CGFobject.prototype);
 MyCylinderBase.prototype.constructor = MyCylinder;

 MyCylinderBase.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];
 	var alpha = 0;
 	this.vertices.push(0,0,1);
 	this.normals.push(0, 0, 1);
 	this.texCoords.push(0.5,0.5);
	for(i = 1; i <= this.slices; i++)
 	{
		this.vertices.push(Math.cos(alpha),Math.sin(alpha),1);
		this.normals.push(0, 0, 1);
		this.texCoords.push(1-(Math.cos(alpha)/2+0.5),Math.sin(alpha)/2+0.5);
		alpha += 2*Math.PI/ this.slices;
 	};
 	for(i = 1; i <= this.slices; i++)
 	{
 	    if (i<this.slices)
		  this.indices.push(0, i, i+1);
		else
		  this.indices.push(0, i, 1);
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };