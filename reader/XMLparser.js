
function XMLparser(true1, false1) {
    this.TRUE = true1;
    this.FALSE = false1;
}

XMLparser.prototype.parseField = function(root, field) {
    var fieldTemp = root.getNamedItem(field);
    if (fieldTemp == null )
        return null ;
    
    return fieldTemp.value;
};

XMLparser.prototype.parseRGBA = function(root) {
    var rVar, gVar, bVar, aVar;
    
    rVar = this.parseField(root, "r");
    gVar = this.parseField(root, "g");
    bVar = this.parseField(root, "b");
    aVar = this.parseField(root, "a");
    
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
				var xVar, yVar, zVar;
				xVar = children.attributes.getNamedItem("x").value;
				yVar = children.attributes.getNamedItem("y").value;
				zVar = children.attributes.getNamedItem("z").value;
				if (xVar == null || yVar == null || zVar == null)
					return null;

				return ({
					type: "translation",
					x: xVar,
					y: yVar,
					z: zVar
				});

		case 'ROTATION':
				var axisVar, angleVar;
				axisVar = children.attributes.getNamedItem("axis").value;
				angleVar = children.attributes.getNamedItem("angle").value;
				if (axisVar == null || angleVar == null)
					return null;

				return ({
					type: "rotation",
					axis: axisVar,
					angle: angleVar
				});

		case 'SCALE':
				var sxVar, syVar, szVar;
				sxVar = children.attributes.getNamedItem("sx").value;
				syVar = children.attributes.getNamedItem("sy").value;
				szVar = children.attributes.getNamedItem("sz").value;
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

	switch (typeVar)
	{
		case "rectangle":
			argsElems = argsVar.split(" ");
			if (argsElems.length != 4)
				return null;

			// 2D coordinates for left-top and right-bottom vertices.
			return {
				xl: parseFloat(argsElems[0]),
				yl: parseFloat(argsElems[1]),
				xr: parseFloat(argsElems[2]),
				yr: parseFloat(argsElems[3])
			};

		case "cylinder":
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
			argsVar = argsVar.split("  ");
			if (argsVar.length != 3)
				return null;

			var argsElems2, argsElems3;
			argsElems = argsVar[0].split(" ");
			argsElems2 = argsVar[1].split(" ");
			argsElems3 = argsVar[2].split(" ");
			if (argsElems.length != 3 || argsElems2.length != 3 || argsElems3.length != 3)
				return null;

			// coordinates of each vertex
			return {
				x1: parseFloat(argsElems[0]),
				y1: parseFloat(argsElems[1]),
				z1: parseFloat(argsElems[2]),

				x2: parseFloat(argsElems2[0]),
				y2: parseFloat(argsElems2[1]),
				z2: parseFloat(argsElems2[2]),

				x3: parseFloat(argsElems3[0]),
				y3: parseFloat(argsElems3[1]),
				z3: parseFloat(argsElems3[2])
			};

		default:
			return null;
	}

	return null;
};
