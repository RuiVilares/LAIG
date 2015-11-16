/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @param {Number} x1,y1,z1 - The top coordinate
 * @param {Number} x2,y2,z2 - The left coordinate
 * @param {Number} x3,y3,z3 - The right coordinate
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
				1
			  /  \
			 /	  \	
			/	   \
			2------3

	*/
	
	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/**
 * Initialize the buffers of the primitive
 */
MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3
			];

	this.indices = [
		//triangles
            0, 1, 2
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;

	var normal = this.getNormalVector();
	
	this.normals = [
	normal.x, normal.y, normal.z,
	normal.x, normal.y, normal.z,
	normal.x, normal.y, normal.z
	];

	this.a = 0; this.b = 0; this.c = 0;
	this.setTriangleSizes();

	this.sinB = 0; this.cosB = 0;
	this.setTrignometry();

	this.p2x = this.c - this.a * this.cosB;
	this.p2y = this.a * this.sinB;

	this.defaultTextureScale();

	this.initGLBuffers();
};

/**
 * Computes the texture coordinates
 */
MyTriangle.prototype.setTrignometry = function () {

	this.cosB = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);

	this.sinB = Math.sin(Math.acos(this.cosB));

};

/**
 * Computes the sizes of the triangle
 */
MyTriangle.prototype.setTriangleSizes = function () {
		
	this.a = Math.sqrt(
				Math.pow(this.x1-this.x3 ,2) + 
				Math.pow(this.y1-this.y3 ,2) +
				Math.pow(this.z1-this.z3 ,2) );
	
	this.b = Math.sqrt(
				Math.pow(this.x2-this.x1 ,2) + 
				Math.pow(this.y2-this.y1 ,2) +
				Math.pow(this.z2-this.z1 ,2) );
	
	this.c = Math.sqrt(
				Math.pow(this.x3-this.x2 ,2) + 
				Math.pow(this.y3-this.y2 ,2) +
				Math.pow(this.z3-this.z2 ,2) );
};

/**
 * Computes the normal vector of the triangle
 * @returns {Array|Float} The normal vector (x,y,z)
 */
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

/**
 * Scale the texCoords of the primitive
 * @param {Number} s,t - The scale of the texture
 */
MyTriangle.prototype.scaleTexture = function (s, t) {
	this.texCoords = [
		this.p2x/s,1-this.p2y/t,
		0,1,
		this.c/s,1
		];
	this.initGLBuffers();
};

MyTriangle.prototype.defaultTextureScale = function () {
	this.texCoords = [
		this.p2x, 1-this.p2y,
		0, 1,
		this.c, 1
	];
	this.initGLBuffers();
};