/**
 * MyQuadWText
 * @param gl {WebGLRenderingContext}
 * @param {Number} xl,yl - The left top coordinate
 * @param {Number} xr,yr - The right bottom coordinate
 * @constructor
 */
function MyQuadWText(scene, xl, yl, xr, yr) {
	CGFobject.call(this,scene);
	this.xl = xl;
	this.yl = yl;
	this.xr = xr;
	this.yr = yr;

	this.initBuffers();
};

MyQuadWText.prototype = Object.create(CGFobject.prototype);
MyQuadWText.prototype.constructor=MyQuadWText;

/**
 * Initialize the buffers of the primitive
 */
MyQuadWText.prototype.initBuffers = function () {
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

	this.initGLBuffers();
};
