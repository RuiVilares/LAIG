/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, height, minRadius, maxRadius, stacks, slices) {
 	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;
	this.minRadius=minRadius;
	this.maxRadius=maxRadius;
	this.height = height;

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
 			var diffI = vec3.fromValues((this.minRadius+j/radiusDenominator)*(-Math.sin(alpha*i))*alpha, (this.minRadius+j/radiusDenominator)*(Math.cos(alpha*i))*alpha, 0);
 			var diffJ = vec3.fromValues(Math.cos(alpha*i)/radiusDenominator, Math.sin(alpha*i)/radiusDenominator, (1/this.stacks) * this.height);
 			var normal = vec3.create();
 			vec3.cross(normal, diffI, diffJ);
 			vec3.normalize(normal, normal);
 			this.vertices.push(Math.cos(alpha*i)*(this.minRadius+j/radiusDenominator), Math.sin(alpha*i)*(this.minRadius+j/radiusDenominator), (j/this.stacks) * this.height);
 			
 			this.normals.push(normal[0], normal[1], normal[2]);
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
