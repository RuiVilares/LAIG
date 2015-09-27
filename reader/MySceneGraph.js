
function MySceneGraph(filename, scene) {
    this.loadedOk = null ;
    
    this.TRUE = 1;
    this.FALSE = 0;
    
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;
    
    // File reading 
    this.reader = new CGFXMLreader();
    
    /*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
    
    this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() 
{
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;
    if (rootElement.nodeName != "SCENE") {
        this.onXMLError("SCENE block not found.");
        return;
    }
    
    var error;
    
    // Here should go the calls for different functions to parse the various blocks
    /********************to delete this block***********************************/
    /*error = this.parseGlobalsExample(rootElement);	
	if (error != null) {
		this.onXMLError(error);
		return;
	}*/
    /********************delete until this block***********************************/
    
    error = this.parseInitials(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseIllumination(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseLights(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseTextures(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseMaterials(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseLeaves(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    error = this.parseNodes(rootElement);
    if (error != null ) {
        this.onXMLError(error);
        return;
    }
    
    
    this.loadedOk = true;
    
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample = function(rootElement) {
    
    var elems = rootElement.getElementsByTagName('globals');
    if (elems == null ) {
        return "globals element is missing.";
    }
    
    if (elems.length != 1) {
        return "either zero or more than one 'globals' element found.";
    }
    
    // various examples of different types of access
    var globals = elems[0];
    this.background = this.reader.getRGBA(globals, 'background');
    this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill", "line", "point"]);
    this.cullface = this.reader.getItem(globals, 'cullface', ["back", "front", "none", "frontandback"]);
    this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw", "cw"]);
    
    console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");
    
    var tempList = rootElement.getElementsByTagName('list');
    
    if (tempList == null  || tempList.length == 0) {
        return "list element is missing.";
    }
    
    this.list = [];
    // iterate over every element
    var nnodes = tempList[0].children.length;
    for (var i = 0; i < nnodes; i++) 
    {
        var e = tempList[0].children[i];
        
        // process each element and store its information
        this.list[e.id] = e.attributes.getNamedItem("coords").value;
        console.log("Read list item id " + e.id + " with value " + this.list[e.id]);
    };

};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};


MySceneGraph.prototype.parseInitials = function(rootElement) {
}
;

MySceneGraph.prototype.parseIllumination = function(rootElement) {
};

MySceneGraph.prototype.parseLights = function(rootElement) {
};

MySceneGraph.prototype.parseTextures = function(rootElement) {
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {
    
    console.log("Started to read the materials' section.");
    
    var elems = rootElement.getElementsByTagName('MATERIALS');
    if (elems == null ) {
        return "MATERIALS element is missing.";
    }
    
    if (elems.length == 0) {
        return "materials missing.";
    }
    
    var materialsElems = elems[0].getElementsByTagName('MATERIAL');
    
    this.materialList = [];
    var children;
    var idVar;
    var shininessVar, specularVar, diffuseVar, ambientVar, emissionVar;
    var tempArray;
    
    // iterate over every element
    for (var i = 0; i < materialsElems.length; i++) 
    {
        idVar = materialsElems[i].id;
        if (idVar == null )
            return "id of material number " + i + " not found.";
        
        // iterate over every element
        if (materialsElems[i].children.length != 5) 
        {
            return "Material " + idVar + " misses components";
        }
        
        children = materialsElems[i].children;
        
        for (var j = 0; j < children.length; j++) 
        {
            switch (children[j].nodeName) 
            {
            case "shininess":
                shininessVar = {
                    value: this.parseField(children[j].attributes, "value")
                };
                break;
            case "specular":
                specularVar = this.parseRGBA(children[j].attributes);
                break;
            case "diffuse":
                diffuseVar = this.parseRGBA(children[j].attributes);
                break;
            case "ambient":
                ambientVar = this.parseRGBA(children[j].attributes);
                break;
            case "emission":
                emissionVar = this.parseRGBA(children[j].attributes);
                break;
            default:
                return "compoment " + children.nodeName + " out of place.";
            }
        }
        
        if (shininessVar == null  || specularVar == null  || diffuseVar == null  || ambientVar == null  || emissionVar == null )
            return "one of the components of the material " + idVar + " isn't correctly defined.";
        
        if (this.isRepeatedId(this.materialList, idVar))
            return "material " + idVar + " already exists.";
        
        this.materialList.push(
        {
            id: idVar,
            shininess: shininessVar,
            specular: specularVar,
            diffuse: diffuseVar,
            ambient: ambientVar,
            emission: emissionVar
        });
        /*
			How to access?
				this.materialList(index).id;
				or
				this.materialList(index).diffuse.g;
		*/
    }
    ;
    
    console.log("Finished to read the materials' section.");
};

MySceneGraph.prototype.parseLeaves = function(rootElement) {
    
    console.log("Started to read the leaves' section.");
    
    var elems = rootElement.getElementsByTagName('LEAVES');
    if (elems == null ) {
        return "LEAVES element is missing.";
    }
    
    if (elems.length == 0) {
        return "leaves missing";
    }
    
    var leaf = elems[0].getElementsByTagName('LEAF');
    var idVar, typeVar, argsVar;
    
    this.leafList = [];
    
    for (var i = 0; i < leaf.length; i++) 
    {
        idVar = this.reader.getString(leaf[i], 'id', "id of leaf " + i + " not found.");
        typeVar = this.reader.getItem(leaf[i], 'type', ["rectangle", "cylinder", "sphere", "triangle"]);
        argsVar = this.reader.getString(leaf[i], 'args', "args of leaf " + idVar + " not found.");

        if (this.isRepeatedId(this.leafList, idVar))
            return "leaf " + idVar + " already exists.";

		//argsParser returns number and not text
		argsVar = this.argsParser(typeVar, argsVar);
        if (argsVar == null)
        	return "args of leave " + idVar + " are incorrect.";

        this.leafList.push(
        			{
        				id: idVar,
        				type: typeVar,
        				args: argsVar
        			});
        /*
			How to access?
				this.leafList(index).id;
		*/
    }
    
    console.log("Finished to read the leaves' section.");
};

MySceneGraph.prototype.parseNodes = function(rootElement) {
	console.log("Started to read the nodes' section.");
    
    var elems = rootElement.getElementsByTagName('NODES');
    if (elems == null ) {
        return "NODES element is missing.";
    }
    
    if (elems.length == 0) {
        return "nodes missing.";
    }
    
    var rootElem = elems[0].getElementsByTagName('ROOT');
    if (rootElem == null)
    	return "missing root node.";

    rootElem = this.reader.getString(rootElem[0], 'id', "id of root not found.");

    /***************************
	don't forget the root id
    *///////////////////////////

    var nodes = elems[0].getElementsByTagName('NODE');
    if (nodes.length == 0)
    	return "at least one node must be present.";

    this.nodeList = [];
    var idVar;
    var materialIdVar, textureIdVar;
    var transformation = []; var transform;

    for (var i = 0; i < nodes.length; i++)
	{
		idVar = this.reader.getString(nodes[i], 'id', "id of node " + i + " not found.");
		if (this.isRepeatedId(this.nodeList, idVar))
					return "node " + idVar + " already exists.";

		materialIdVar = nodes[i].getElementsByTagName('MATERIAL');
		if (materialIdVar == null || materialIdVar.length == 0)
			return "missing material in node " + idVar + ".";
		materialIdVar = this.reader.getString(materialIdVar[0], 'id', "id of material of node " + idVar + " not found.");
		if (!this.isRepeatedId(this.materialList, materialIdVar))
					return "material " + materialIdVar + " of node " + idVar + " already exists.";

		/*****************************************for now it won't work
		textureIdVar = nodes[i].getElementsByTagName('TEXTURE');
		if (textureIdVar == null || textureIdVar.length == 0)
			return "missing texture in node " + idVar + ".";
		textureIdVar = this.reader.getString(textureIdVar[0], 'id', "id of texture of node " + idVar + " not found.");
		if (!this.isRepeatedId(this.textureList, textureIdVar))
					return "texture " + textureIdVar + " of node " + idVar + " already exists.";
					********************************************************************************/

		for (var j = 0; j < nodes[i].children.length; j++)
		{
			transform = this.parseTranslation(nodes[i].children[j]);
			if (transform == null)
				return "transformation incorrectly defined in node " + idVar + ".";
			
			if (transform != "")
				transformation.push(transform);
		}
    }
    
    console.log("Finished to read the nodes' section.");
};

MySceneGraph.prototype.parseField = function(root, field) {
    var fieldTemp = root.getNamedItem(field);
    if (fieldTemp == null )
        return null ;
    
    return fieldTemp.value;
};

MySceneGraph.prototype.parseRGBA = function(root) {
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

MySceneGraph.prototype.isRepeatedId = function(array, id) {
    for (var i = 0; i < array.length; i++) 
    {
        if (array[i].id == id)
            return this.TRUE;
    }
    
    return this.FALSE;
};

MySceneGraph.prototype.parseTranslation = function(children) {

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

MySceneGraph.prototype.argsParser = function(typeVar, argsVar) {

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
