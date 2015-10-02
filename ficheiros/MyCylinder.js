/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

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

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];
 	var incrementS = 1.0 / this.slices;
 	var incrementT = 1.0 / this.stacks;


	for(j = 0; j <= this.stacks; j++)
 	{
 		var alpha = 0;
 		for(i = 0; i < this.slices; i++)
 		{
			this.normals.push(Math.cos(alpha), Math.sin(alpha), 0);
			this.texCoords.push(i*incrementS, j*incrementT);
			this.vertices.push(Math.cos(alpha), Math.sin(alpha), j);
			alpha += 2*Math.PI/ this.slices;
 		};
 	};
 	for(j = 0; j < this.stacks; j++){
 		for(i = 0; i < this.slices; i++)
 		{
 			var index = j * this.slices + i;
 			if((index + this.slices + 1) % this.slices == 0){
 				this.indices.push(index + 1, index, index - this.slices + 1);
 				this.indices.push(index, index + 1 , index + this.slices);
 			}
 			else{
 				this.indices.push(index + 1, index + this.slices + 1, index + this.slices);
 				this.indices.push(index, index + 1 , index + this.slices);
 			}
 		};
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
