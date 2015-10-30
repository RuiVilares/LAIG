/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, radius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.radius = radius;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];
 	this.texCoords = [];
 	
 	var alpha = Math.PI / (this.slices / 2);

 	for (var j = 0; j <= this.stacks ; j++)
 	{
 		var teta = -Math.PI/2 + j * Math.PI/this.stacks;

 		for (var i = 0; i <= this.slices; i++)
 		{
 			this.vertices.push(Math.cos(alpha*i)*Math.cos( teta )*this.radius , Math.sin(alpha*i)*Math.cos(teta)*this.radius, Math.sin(teta)*this.radius);

 			this.normals.push( Math.cos(alpha*i)*Math.cos( teta ) , Math.sin(alpha*i)*Math.cos(teta) , Math.sin(teta));

			this.texCoords.push( (1/this.slices)*i, 1-(1/(this.stacks))*j);
 		}
 	}

 	var n = this.slices + 1;

	for (var j = 0; j < this.stacks; j++)
	{
		for (var i = 0; i < this.slices; i++)
		{
			this.indices.push(j * n + i, j * n + i + 1, (j+1) * n + i);
			this.indices.push(j * n + i + 1, (j + 1) * n + i + 1, (j + 1) * n + i);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
