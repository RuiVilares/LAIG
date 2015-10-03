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
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

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

 			//this.texCoords.push( i%2, (1/this.stacks)*j);

			//this.texCoords.push( (1/this.slices)*i, (1/this.stacks)*j);
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
			//this.indices.push(this.slices*2*j+ i*2, this.slices*2*j+(2*i+3)%(this.slices*2), this.slices*2*j+this.slices*2 + ((2*i+3)%(this.slices*2)));
			//this.indices.push(this.slices*2*j+2*i, this.slices*2*j+(this.slices*2)+(3+2*i)%(this.slices*2), this.slices*2*j+(this.slices*2)+(2*i)%(this.slices*2));
		
			//this.indices.push(  ((1+i)%this.slices)+this.slices+this.slices*j  , i+this.slices+this.slices*j  ,  i+this.slices*j) ;
			//this.indices.push(  ((1+i)%this.slices)+this.slices+this.slices*j , (i)%this.slices+this.slices*j ,  (i+1)%this.slices+this.slices*j  );
		
			this.indices.push(  ((1+i)%n)+n+n*j  , i+n+n*j  ,  i+n*j) ;
			this.indices.push(  ((1+i)%n)+n+n*j , (i)%n+n*j ,  (i+1)%n+n*j  );
		}
	}



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
