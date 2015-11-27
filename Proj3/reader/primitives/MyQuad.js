/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @param {Number} xl,yl - The left top coordinate
 * @param {Number} xr,yr - The right bottom coordinate
 * @constructor
 */
function MyQuad(scene, xl, yl, xr, yr) {
	CGFobject.call(this,scene);
	this.xl = xl;
	this.yl = yl;
	this.xr = xr;
	this.yr = yr;
	
	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

/**
 * Initialize the buffers of the primitive
 */
MyQuad.prototype.initBuffers = function () {
	this.vertices = [
		//square
            this.xl, this.yr, 0,
            this.xr, this.yr, 0,
            this.xl, this.yl, 0,
            this.xr, this.yl, 0
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

	
	this.scaleTexture(1,1);

	this.initGLBuffers();
};

/**
 * Scale the texCoords of the primitive
 * @param {Number} s,t - The scale of the texture
 */
MyQuad.prototype.scaleTexture = function (s, t) {
	var width = this.xr - this.xl;
	var height = this.yl - this.yr;
	this.texCoords = [
	0,height/t,
	width/s,height/t,
	0,0,
	width/s,0
	];
	this.initGLBuffers();
};