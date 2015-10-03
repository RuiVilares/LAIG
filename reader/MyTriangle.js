/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	
	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;


MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
		//square
            -0.5, 0, 0,
            0.5, 0, 0,
            0, 0.7071, 0
			];

	this.indices = [
		//triangles
            0, 1, 2,
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	
	this.normals = [
	0, 0, 1,	
	0, 0, 1,	
	0, 0, 1

	];

	
	this.texCoords = [
	this.minS,this.maxT,
	this.maxS,this.maxT,
	this.minS,this.minT,
	this.maxS,this.minT
	];

	this.initGLBuffers();
};