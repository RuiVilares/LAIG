/**
 * Patch
 * @constructor
 */
 function Patch(scene, order, partsU, partsV, controlPoints) {
 	CGFobject.call(this,scene);

 	this.initBuffers(scene, order, partsU, partsV, controlPoints);
 };

 Patch.prototype = Object.create(CGFobject.prototype);
 Patch.prototype.constructor = Patch;

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

 Patch.prototype.initBuffers = function(scene, order, partsU, partsV, controlPoints) {

 	var controlPointsArray = [];

 	for (var i = 0; i < controlPoints.length; ) {
 		var arrayU = [];

 		for (var j = 0; j <= order; j++) {
 			console.log("i = " + i + " j = " + j);
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

Patch.prototype.makeSurface = function (scene, degree1, degree2, knots1, knots2, partsU, partsV, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(scene, getSurfacePoint, partsU, partsV);
};

Patch.prototype.display = function () {
		
	this.obj.display();
};