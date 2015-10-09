/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
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

MyQuad.prototype.scaleTexture = function (s, t) {
	this.texCoords = [
	0,1/t,
	1/s,1/t,
	0,0,
	1/s,0
	];
};