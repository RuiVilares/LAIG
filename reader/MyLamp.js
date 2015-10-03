/**
 * MyLamp
 * @constructor
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

 MyLamp.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

 	var alpha = Math.PI / (this.slices / 2);



 	this.vertices = [];
 	this.normals = [];
 	this.indices = [];
 	this.texCoords = [];

	for (var j = 0; j <= this.stacks; j++)
	{
		var teta = j * (Math.PI/2)/this.stacks;

 		for (var i = 0; i <= this.slices; i++)
 		{
 			this.vertices.push( Math.cos(alpha*i)*Math.cos( teta ) , Math.sin(alpha*i)*Math.cos(teta) , Math.sin(teta));
 			
 			this.normals.push( Math.cos(alpha*i)*Math.cos( teta ) , Math.sin(alpha*i)*Math.cos(teta) , Math.sin(teta));
 			
 			//this.normals.push(Math.cos(alpha*i), Math.sin(alpha*2), Math.sin(teta));

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
		
			this.indices.push(  ((1+i)%n)+n+n*j  , i+n+n*j  ,  i+n*j) ;
			this.indices.push(  ((1+i)%n)+n+n*j , (i)%n+n*j ,  (i+1)%n+n*j  );
		}
	}



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
