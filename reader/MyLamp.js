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
