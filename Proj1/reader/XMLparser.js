
function XMLparser(reader) {
	this.reader = reader;
}

XMLparser.prototype.parseField = function(root, field) {
    var fieldTemp = root.getNamedItem(field);
    if (fieldTemp == null )
        return null ;
    
    return fieldTemp.value;
};

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

XMLparser.prototype.parseReference = function(root) {
    var referenceVar;
    
	referenceVar = this.reader.getFloat(root, "length");
    
    if (referenceVar == null)
        return null ;
    
    return referenceVar;
};

XMLparser.prototype.parseEnable = function(root) {
    var enableVar;
    
	enableVar = this.reader.getInteger(root, "value");
    
    if (enableVar == null)
        return null ;
    
    enableVar = (enableVar == 1);
    	
    return enableVar;
};

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

XMLparser.prototype.parseFile = function(root) {
    var fileVar;
    
    fileVar = this.parseField(root, "path");
    
    if (fileVar == null)
        return null ;
    
    return fileVar;
};

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
