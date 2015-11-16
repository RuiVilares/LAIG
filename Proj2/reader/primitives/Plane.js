/**
 * Plane
 * @constructor
 * @param {Number} parts - The number of parts of the primitive
 */
 function Plane(scene, parts) {
 	CGFobject.call(this,scene);

 	this.initBuffers(scene, parts);
 };

 Plane.prototype = Object.create(CGFobject.prototype);
 Plane.prototype.constructor = Plane;

/**
 * Initialize the buffers of the primitive with a custom number of parts
 * More parts is equal to more detail, but heavier processing
 * @param {Number} parts
 */
 Plane.prototype.initBuffers = function(scene, parts) {

	this.makeSurface(scene, parts,
					 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [ -0.5, 0, 0.5, 1 ],
							 [ -0.5,  0, -0.5, 1 ]
						],
						// U = 1
						[ // V = 0..1							 
							[ 0.5, 0, 0.5, 1 ],
							[ 0.5,  0, -0.5, 1 ]
						]
					]);
 };

/**
 * Create the nurb surface
 * @param {Number} degree1
 * @param {Number} degree2
 * @param {Number} knots1
 * @param {Number} knots2
 * @param {Number} partsV
 * @param {Number} controlvertexes
 */
Plane.prototype.makeSurface = function (scene, parts, degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, parts, parts);
};

/**
 * Display the primitive
 */
Plane.prototype.display = function () {
		
	this.obj.display();
};