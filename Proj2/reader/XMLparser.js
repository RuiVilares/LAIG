/**
 * Creates a custom XML parser
 * @constructor
 * @param {XMLParser} reader
 */
function XMLparser(reader) {
	this.reader = reader;
}

/**
 * Parse a field from the node
 * @param {string} root - The node to be read
 * @param {string} field - The name of the field
 * @returns {string} The field parsed
 */
XMLparser.prototype.parseField = function(root, field) {
    var fieldTemp = root.getNamedItem(field);
    if (fieldTemp == null )
        return null ;
    
    return fieldTemp.value;
};

/**
 * Parse the fields r,g,b,a from the node
 * @param {string} root - The node to be read
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseRGBA = function(root) {
    var rVar, gVar, bVar, aVar;
    
	rVar = this.reader.getFloat(root, "r");
	bVar = this.reader.getFloat(root, "b");
	gVar = this.reader.getFloat(root, "g");
	aVar = this.reader.getFloat(root, "a");
    
    if (rVar == null  || gVar == null  || bVar == null  || aVar == null )
        return null ;
    
    return {
        r: rVar,
        g: gVar,
        b: bVar,
        a: aVar
    };
};

/**
 * Parse a transformation (translation, scale, rotation) from the node
 * @param {Node} children - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseTranslation = function(children) {

    switch (children.tagName)
	{
		case 'TRANSLATION':
		case "translation":
				var xVar, yVar, zVar;
				xVar = this.reader.getFloat(children, "x");
				yVar = this.reader.getFloat(children, "y");
				zVar = this.reader.getFloat(children, "z");
				if (xVar == null || yVar == null || zVar == null)
					return null;

				return ({
					type: "translation",
					x: xVar,
					y: yVar,
					z: zVar
				});

		case 'ROTATION':
		case "rotation":
				var axisVar, angleVar;
				axisVar = children.attributes.getNamedItem("axis").value;
				angleVar = this.reader.getFloat(children, "angle");
				if (axisVar == null || angleVar == null)
					return null;

				return ({
					type: "rotation",
					axis: axisVar,
					angle: angleVar
				});

		case 'SCALE':
		case "scale":
				var sxVar, syVar, szVar;
				sxVar = this.reader.getFloat(children, "sx");
				syVar = this.reader.getFloat(children, "sy");
				szVar = this.reader.getFloat(children, "sz");

				if (sxVar == null || syVar == null || szVar == null)
					return null;

				return ({
					type: "scale",
					sx: sxVar,
					sy: syVar,
					sz: szVar
				});

		default:
			return "";
	}

	return null;
};

/**
 * Parse the primitives from the node
 * @param {string} typeVar - The name of the primitive
 * @param {string} argsVar - The args of the primitive
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.argsParser = function(typeVar, argsVar) {

	var argsElems;
	argsVar = argsVar.trim();

	switch (typeVar)
	{
		case "rectangle":
			while(argsVar.indexOf('  ')!=-1)
				argsVar = argsVar.replace('  ',' ');
			argsElems = argsVar.split(" ");
			if (argsElems.length != 4)
			{
				return null;
			}
			
			// 2D coordinates for left-top and right-bottom vertices.
			return {
				xl: parseFloat(argsElems[0]),
				yl: parseFloat(argsElems[1]),
				xr: parseFloat(argsElems[2]),
				yr: parseFloat(argsElems[3])
			};

		case "cylinder":
			while(argsVar.indexOf('  ')!=-1)
				argsVar = argsVar.replace('  ',' ');
			argsElems = argsVar.split(" ");
			if (argsElems.length != 5)
				return null;

			// height, bottom radius, top radius, sections along height, parts per section
			return {
				h: parseFloat(argsElems[0]),
				br: parseFloat(argsElems[1]),
				tr: parseFloat(argsElems[2]),
				sh: parseInt(argsElems[3]),
				ps: parseInt(argsElems[4])
			};

		case "sphere":
			while(argsVar.indexOf('  ')!=-1)
				argsVar = argsVar.replace('  ',' ');
			argsElems = argsVar.split(" ");
			if (argsElems.length != 3)
				return null;

			// radius, parts along radius, parts per section
			return {
				r: parseFloat(argsElems[0]),
				pr: parseInt(argsElems[1]),
				ps: parseInt(argsElems[2])
			};

		case "triangle":
			while(argsVar.indexOf('  ')!=-1)
				argsVar = argsVar.replace('  ',' ');
			argsElems = argsVar.split(" ");
			if (argsElems.length != 9)
			{
				return null;
			}

			// coordinates of each vertex
			return {
				x1: parseFloat(argsElems[0]),
				y1: parseFloat(argsElems[1]),
				z1: parseFloat(argsElems[2]),

				x2: parseFloat(argsElems[3]),
				y2: parseFloat(argsElems[4]),
				z2: parseFloat(argsElems[5]),

				x3: parseFloat(argsElems[6]),
				y3: parseFloat(argsElems[7]),
				z3: parseFloat(argsElems[8])
			};

		default:
			return null;
	}

	return null;
};

/**
 * Parse near and far from the frustum from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseFrustum = function(root) {
    var nearVar, farVar;
    
	nearVar = this.reader.getFloat(root, "near");
	farVar = this.reader.getFloat(root, "far");
    
    if (nearVar == null  || farVar == null)
        return null ;
    
    return {
        near: nearVar,
        far: farVar
    };
};

/**
 * Parse length from the reference from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseReference = function(root) {
    var referenceVar;
    
	referenceVar = this.reader.getFloat(root, "length");
    
    if (referenceVar == null)
        return null ;
    
    return referenceVar;
};

/**
 * Parse value from the enable from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseEnable = function(root) {
    var enableVar;
    
	enableVar = this.reader.getInteger(root, "value");
    
    if (enableVar == null)
        return null ;
    
    enableVar = (enableVar == 1);
    	
    return enableVar;
};

/**
 * Parse position from the position from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parsePosition = function(root) {
    var xVar, yVar, zVar, wVar;
    
	xVar = this.reader.getFloat(root, "x");
	yVar = this.reader.getFloat(root, "y");
	zVar = this.reader.getFloat(root, "z");
	wVar = this.reader.getFloat(root, "w");
    
    if (xVar == null || yVar == null || zVar == null || wVar == null)
        return null ;
    
    return {
        x: xVar,
		y: yVar,
		z: zVar, 
		w: wVar
    };
};

/**
 * Parse path from the file from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseFile = function(root) {
    var fileVar;
    
    fileVar = this.parseField(root, "path");
    
    if (fileVar == null)
        return null ;
    
    return fileVar;
};

/**
 * Parse s and t from the amplication factor from the node
 * @param {Node} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseAmplif_factor = function(root) {
    var sVar, tVar;
    
	sVar = this.reader.getFloat(root, "s");
	tVar = this.reader.getFloat(root, "t");
    
    if (sVar == null || tVar == null)
        return null ;
    
    return {
        s: sVar,
        t: tVar
    };
};

/**
 * Parse the field into x, y and z
 * @param {string} argsVar - The field
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parseCenter = function(argsVar) {    
	argsElems = argsVar.split(" ");
	if (argsElems.length != 3)
	{
		return null;
	}
    
    return {
        x: parseFloat(argsElems[0]),
        y: parseFloat(argsElems[1]),
		z: parseFloat(argsElems[2])
    }
};

/**
 * Parse xx, yy and zz from the points from the node
 * @param {string} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parsePoints = function(root) {
    var xVar, yVar, zVar;
    
	xVar = this.reader.getFloat(root, "xx");
	yVar = this.reader.getFloat(root, "yy");
	zVar = this.reader.getFloat(root, "zz");
    
    if (xVar == null || yVar == null || zVar == null)
        return null ;
    
    return {
        x: xVar,
		y: yVar,
		z: zVar 
    };
};

/**
 * Parse x, y and z from the points of the patch from the node
 * @param {string} root - The node
 * @returns {Array|float} The field parsed
 */
XMLparser.prototype.parsePointsPatch = function(root) {
    var xVar, yVar, zVar;
    
	xVar = this.reader.getFloat(root, "x");
	yVar = this.reader.getFloat(root, "y");
	zVar = this.reader.getFloat(root, "z");
    
    if (xVar == null || yVar == null || zVar == null)
        return null ;
    
    return {
        x: xVar,
		y: yVar,
		z: zVar 
    };
};
