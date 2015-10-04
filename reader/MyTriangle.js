/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;

	/*
				2
			  /  \
			 /	  \	
			/	   \
			1------3
	*/
	
	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;


MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3
			];

	this.indices = [
		//triangles
            2, 1, 0
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;

	var normal = this.getNormalVector();
	
	this.normals = [
	normal.x, normal.y, normal.z,
	normal.x, normal.y, normal.z,
	normal.x, normal.y, normal.z
	];

	this.maxX = Math.max(this.x1, this.x2, this.x3);
	this.maxY = Math.max(this.y1, this.y2, this.y3);
	
	this.texCoords = [
	this.x1/this.maxX,1-this.y1/this.maxY,
	this.x2/this.maxX,1-this.y2/this.maxY,
	this.x3/this.maxX,1-this.y3/this.maxY
	];

	this.initGLBuffers();
};

MyTriangle.prototype.getNormalVector = function () {
	var point1 = {x: this.x1, y: this.y1, z: this.z1};
	var point2 = {x: this.x2, y: this.y2, z: this.z2};
	var point3 = {x: this.x3, y: this.y3, z: this.z3};

	var vector1 = {x: point2.x - point1.x, y: point2.y - point1.y, z: point2.z - point1.z};
	var vector2 = {x: point3.x - point1.x, y: point3.y - point1.y, z: point3.z - point1.z};

	return {
		x: Math.abs(vector1.y * vector2.z - vector1.z * vector2.y),
		y: Math.abs(vector1.z * vector2.x - vector1.x * vector2.z),
		z: Math.abs(vector1.x * vector2.y - vector1.y * vector2.x)
		};
};

MyTriangle.prototype.scaleTexture = function (s, t) {
	this.texCoords = [
		(this.x1/this.maxX)/s,(1-this.y1/this.maxY)/t,
		(this.x2/this.maxX)/s,(1-this.y2/this.maxY)/t,
		(this.x3/this.maxX)/s,(1-this.y3/this.maxY)/t
		];
	this.initGLBuffers();
};

MyTriangle.prototype.defaultTextureScale = function () {
	this.texCoords = [
		this.x1/this.maxX,1-this.y1/this.maxY,
		this.x2/this.maxX,1-this.y2/this.maxY,
		this.x3/this.maxX,1-this.y3/this.maxY
		];
	this.initGLBuffers();
};