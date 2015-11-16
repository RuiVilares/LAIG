/**
 * Patch
 * @constructor
 * @param {Number} order
 * @param {Number} partsU
 * @param {Number} partsV
 * @param {Number} controlPoints
 */
 function Patch(scene, order, partsU, partsV, controlPoints) {
 	CGFobject.call(this,scene);

 	this.initBuffers(scene, order, partsU, partsV, controlPoints);
 };

 Patch.prototype = Object.create(CGFobject.prototype);
 Patch.prototype.constructor = Patch;

/**
 * Computes the knots from the order
 * @param {float} order
 * @returns {Array|Integer} The knots
 */
 Patch.prototype.getKnotsFromOrder = function(order) {
 	switch(order) {
 		case 1:
 			return [0, 0, 1, 1];
 		case 2:
 			return [0, 0, 0, 1, 1, 1];
 		default:
 			return [0, 0, 0, 0, 1, 1, 1, 1];
 	}
 };

/**
 * Initialize the buffers of the primitive
 * @param {Number} order
 * @param {Number} partsU
 * @param {Number} partsV
 * @param {Number} controlPoints
 */
 Patch.prototype.initBuffers = function(scene, order, partsU, partsV, controlPoints) {

 	var controlPointsArray = [];

 	for (var i = 0; i < controlPoints.length; ) {
 		var arrayU = [];

 		for (var j = 0; j <= order; j++) {
 			arrayU.push([controlPoints[i].x, controlPoints[i].y, [controlPoints[i].z], 1]);
 			i++;
 		}

 		controlPointsArray.push(arrayU);
 	}

	this.makeSurface(scene,
					 order, // degree on U: 3 control vertexes U
					 order, // degree on V: 2 control vertexes on V
					this.getKnotsFromOrder(order), // knots for U
					this.getKnotsFromOrder(order), // knots for V
					partsU,
					partsV,					
					controlPointsArray);
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
Patch.prototype.makeSurface = function (scene, degree1, degree2, knots1, knots2, partsU, partsV, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, partsU, partsV);
};

/**
 * Display the primitive
 */
Patch.prototype.display = function () {
	this.obj.display();
};