/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, minX, maxY, maxX, minY) {
	CGFobject.call(this,scene);
	this.minX = minX;
	this.maxY = maxY;
	this.maxX = maxX;
	this.minY = minY;
	
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;


MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.minX, this.minY, 0,
            this.maxX, this.minY, 0,
            this.minX, this.maxY, 0,
            this.maxX, this.maxY, 0
			];

	this.indices = [
		//triangles
            0, 1, 2, 
			3, 2, 1

        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	
	this.normals = [
	0, 0, 1,	
	0, 0, 1,	
	0, 0, 1,	
	0, 0, 1	

	];

	
	this.texCoords = [
	0,1,
	1,1,
	0,0,
	1,0
	];

	this.initGLBuffers();
};