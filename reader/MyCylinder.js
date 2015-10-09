/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks, minRadius, maxRadius) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.minRadius=minRadius;
	this.maxRadius=maxRadius;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {

 	var alpha = Math.PI / (this.slices / 2);
 	var radiusDenominator = this.stacks / (this.maxRadius - this.minRadius);

 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];
 	this.texCoords = [];

	for (var j = 0; j <= this.stacks; j ++)
	{
 		for (var i = 0; i <= this.slices; i++)
 		{
 			this.vertices.push(Math.cos(alpha*i)*(this.minRadius+j/radiusDenominator), Math.sin(alpha*i)*(this.minRadius+j/radiusDenominator), j/this.stacks);
 			this.normals.push(Math.cos(alpha*i)*(this.minRadius+j/radiusDenominator), Math.sin(alpha*i)*(this.minRadius+j/radiusDenominator), j/this.stacks);
 		}
	}

	for (var j = this.stacks; j >= 0; j--)
	{
 		for (var i = 0 ; i <= this.slices; i++)
 		{
			this.texCoords.push( (1/this.slices)*i, (1/this.stacks)*j);
 		}
	}
 
	var n = this.slices + 1;

	for (var j = 0; j < this.stacks; j++)
	{
		for (var i = 0; i < this.slices; i++)
		{		
			this.indices.push(  ((1+i)%n)+n+n*j  , i+n+n*j  ,  i+n*j) ;
			this.indices.push(  ((1+i)%n)+n+n*j , (i)%n+n*j ,  (i+1)%n+n*j  );
		}
	}



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
