
function MySceneGraph(filename, scene) {
    this.loadedOk = null ;
        
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    this.filename = 'scenes/' + filename;
    
    // File reading 
    this.reader = new CGFXMLreader();

    this.parser = new XMLparser(this.reader);
    
    /*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
    
    this.reader.open(this.filename, this);
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
	
	error = this.parseAnimations(rootElement);
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
    
    this.processTree = new ProcessTree(this, this.scene);

    this.loadedOk = true;
    
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};

/*
 * Parse initials' block on lsx
 */
MySceneGraph.prototype.parseInitials = function(rootElement) {
	
	console.log("Started to read the initials' section.");
	
	var elems = rootElement.getElementsByTagName('INITIALS');
    if (elems == null ) {
        return "INITIALS element is missing.";
    }
    
    if (elems.length == 0) {
        return "initials missing";
    }

	var initialsElems = elems[0].children;
		
	var frustumVar, translateVar, rotationVar, rotationXVar, rotationYVar, rotationZVar, scaleVar, referenceVar;
	
	if (initialsElems.length != 7)
    {
		return "Initials misses components";
    }
	
	var matrix = mat4.create(); mat4.identity(matrix);
	var computeMatrix = new MyMatrix();

    for (var j = 0; j < initialsElems.length; j++) 
	{
        switch (initialsElems[j].nodeName) 
        {
			case "frustum":
				frustumVar = this.parser.parseFrustum(initialsElems[j]);
				break;
			case "translation":
				if (j != 1)
					console.warn("Warning: Initial translation isn't on the right place");
				translateVar = this.parser.parseTranslation(initialsElems[j]);
				computeMatrix.computeMatrix(translateVar, matrix);
				break;
			case "rotation":
				if (j < 2 || j > 4)
					console.warn("Warning: Initial rotation isn't on the right place");
				rotationVar = this.parser.parseTranslation(initialsElems[j]);
				computeMatrix.computeMatrix(rotationVar, matrix);
				break;
			case "scale":
				if (j != 5)
					console.warn("Warning: Initial scale isn't on the right place");
				scaleVar = this.parser.parseTranslation(initialsElems[j]);
				computeMatrix.computeMatrix(scaleVar, matrix);
				break;
			case "reference":
				referenceVar = this.parser.parseReference(initialsElems[j]);
				break;
			default:
				return "compoment " + initialsElems.nodeName + " out of place.";
        }
    }

	this.initialsList = 
        {
        	frustum: frustumVar,
            transformation: matrix,
			reference: referenceVar
        };
	
};

/*
 * Parse illumination's block on lsx
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	console.log("Started to read the illumination' section.");
	
	var elems = rootElement.getElementsByTagName('ILLUMINATION');
    if (elems == null ) {
        return "ILLUMINATION element is missing.";
    }
    
    if (elems.length == 0) {
        return "illumination missing";
    }
	
	var illuminationElems = elems[0].children;
	
    var ambientVar, backgroundVar;
	
	if (illuminationElems.length != 2)
    {
		return "Illumination misses components";
    }
        
    for (var j = 0; j < illuminationElems.length; j++) 
	{
        switch (illuminationElems[j].nodeName) 
        {
			case "ambient":
				ambientVar = this.parser.parseRGBA(illuminationElems[j]);
				break;
			case "background":
				backgroundVar = this.parser.parseRGBA(illuminationElems[j]);
				break;
			default:
				return "compoment " + illuminationElems.nodeName + " out of place.";
        }
    }

	this.illuminationList = 
    {
		ambient: ambientVar,
		background: backgroundVar
    };

    console.log("Finished to read the illumination's section.");
};

/*
 * Parse lights'block on lsx
 */
MySceneGraph.prototype.parseLights = function(rootElement) {
	
    console.log("Started to read the lights' section.");
    
    var elems = rootElement.getElementsByTagName('LIGHTS');
    if (elems == null ) {
        return "LIGHTS element is missing.";
    }
    
    if (elems.length == 0) {
        return "lights missing.";
    }
    
    var lightsElems = elems[0].getElementsByTagName('LIGHT');
    
    this.lightsList = [];
    var children;
    var idVar;
    var enableVar, positionVar, ambientVar, diffuseVar, specularVar;
	
	if (lightsElems.length > 8)
		console.warn("Maximum number of lights exceeded (max. 8): " + lightsElems.length);

	var maximumLights = Math.min(lightsElems.length, 8);

	// iterate over every element
    for (var i = 0; i < maximumLights; i++) 
    {
        idVar = lightsElems[i].id;
        if (idVar == null )
            return "id of light number " + i + " not found.";
        
        // iterate over every element
        if (lightsElems[i].children.length != 5)
        {
            return "Light " + idVar + " misses components";
        }
        
        children = lightsElems[i].children;
        
        for (var j = 0; j < children.length; j++) 
        {
            switch (children[j].nodeName) 
            {
            case "enable":
                enableVar = this.parser.parseEnable(children[j]);
                break;
            case "position":
                positionVar = this.parser.parsePosition(children[j]);
                break;
			case "ambient":
                ambientVar = this.parser.parseRGBA(children[j]);
                break;
			case "diffuse":
                diffuseVar = this.parser.parseRGBA(children[j]);
                break;
			case "specular":
                specularVar = this.parser.parseRGBA(children[j]);
                break;
            default:
                return "compoment " + children.nodeName + " out of place.";
            }
        }

        if (enableVar == null  || positionVar == null || ambientVar == null || diffuseVar == null || specularVar == null)
            return "one of the components of the light " + idVar + " isn't correctly defined.";
        
        if (this.isRepeatedId(this.lightsList, idVar))
            return "light " + idVar + " already exists.";
           
        this.lightsList.push({
								id: i,
								name: idVar,
								enable: enableVar,
								position: positionVar,
								ambient: ambientVar,
								diffuse: diffuseVar,
								specular: specularVar
							});
        /*
			How to access?
				this.lightsList(index).id;
				or
				this.lightsList(index).diffuse.g;
		*/
    }
    ;
    
    console.log("Finished to read the lights' section.");
};

/*
 * Parse texture's block on lsx
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
	
    
    console.log("Started to read the textures' section.");
    
    var elems = rootElement.getElementsByTagName('TEXTURES');
    if (elems == null ) {
        return "TEXTURES element is missing.";
    }
    
    if (elems.length == 0) {
        return "textures missing.";
    }
    
    var texturesElems = elems[0].getElementsByTagName('TEXTURE');
    
    this.textureList = [];
    var children;
    var idVar;
    var filePathVar, amplifVar;

    var path=this.filename.substring(0, this.filename.lastIndexOf("/"));
	
	// iterate over every element
    for (var i = 0; i < texturesElems.length; i++) 
    {
        idVar = texturesElems[i].id;
        if (idVar == null )
            return "id of texture number " + i + " not found.";
        
        // iterate over every element
        if (texturesElems[i].children.length != 2)
        {
            return "Texture " + idVar + " misses components";
        }
        
        children = texturesElems[i].children;
        
        for (var j = 0; j < children.length; j++) 
        {
            switch (children[j].nodeName) 
            {
            case "file":
                filePathVar = this.parser.parseFile(children[j].attributes);
                break;
            case "amplif_factor":
                amplifVar = this.parser.parseAmplif_factor(children[j]);
                break;
            default:
                return "compoment " + children.nodeName + " out of place.";
            }
        }
        
        if (filePathVar == null  || amplifVar == null)
            return "one of the components of the texture " + idVar + " isn't correctly defined.";
        
        if (this.textureList[idVar] != null)
            return "texture " + idVar + " already exists.";

        filePathVar = path + '/' + filePathVar;

        this.textureList[idVar] = 
        {
            file: filePathVar,
            amplif_factor: amplifVar,
            obj: new CGFtexture(this.scene, filePathVar)
        };
        /*
			How to access?
				this.textureList(index).id;
				or
				this.textureList(index).diffuse.g;
		*/
    }
    ;
    
    console.log("Finished to read the textures' section.");
};

/*
 * Parse material's block on lsx
 */
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
                    value: this.reader.getFloat(children[j], "value")
                };
                break;
            case "specular":
                specularVar = this.parser.parseRGBA(children[j]);
                break;
            case "diffuse":
                diffuseVar = this.parser.parseRGBA(children[j]);
                break;
            case "ambient":
                ambientVar = this.parser.parseRGBA(children[j]);
                break;
            case "emission":
                emissionVar = this.parser.parseRGBA(children[j]);
                break;
            default:
                return "compoment " + children.nodeName + " out of place.";
            }
        }
        
        if (shininessVar == null  || specularVar == null  || diffuseVar == null  || ambientVar == null  || emissionVar == null )
            return "one of the components of the material " + idVar + " isn't correctly defined.";
        
        if (this.materialList[idVar] != null)
            return "material " + idVar + " already exists.";
            
        this.materialList[idVar] = 
        {
            shininess: shininessVar,
            specular: specularVar,
            diffuse: diffuseVar,
            ambient: ambientVar,
            emission: emissionVar
        };
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

/*
 * Parse animation's block on lsx
 */

MySceneGraph.prototype.parseAnimations = function(rootElement) {
   
    console.log("Started to read the animation' section.");
	
    var elems = rootElement.getElementsByTagName('ANIMATIONS');
	 
    if (elems == null ) {
        return "ANIMATIONS element is missing.";
    }
    
    if (elems.length == 0) {
        return "animations missing.";
    }
	
    var animationsElems = elems[0].getElementsByTagName('ANIMATION');
   
    this.animationsList = [];
	
    var idVar, typeVar;
	var spanVar;
	 
	 
	for (var i = 0; i < animationsElems.length; i++) 
    {
        idVar = animationsElems[i].id;
        if (idVar == null )
            return "id of animation number " + i + " not found.";
		if (this.animationsList[idVar] != null)
			return "id " + idVar + " already exists.";
		
		spanVar = this.reader.getFloat(animationsElems[i], "span");
        if (spanVar == null )
            return "span of animation number " + i + " not found.";
		
		typeVar = this.reader.getString(animationsElems[i], "type");
        if (typeVar == null )
            return "type of animation number " + i + " not found.";
        
		if (typeVar == "linear"){
			var children;
			var controlpointVar;
			this.controlpointsList = [];
			children = animationsElems[i].children;
			for (var j = 0; j < children.length; j++) 
			{
				if (children[j].nodeName == "controlpoint"){ 
					controlpointVar = this.parser.parsePoints(children[j]);
					this.controlpointsList.push(controlpointVar);
				}
				else
					return "compoment " + children.nodeName + " out of place.";
            }
			if (this.controlpointsList.length < 2)
				return "missing control points on animation id " + idVar;
			this.animationsList[idVar] = {
								span: spanVar,
								type: typeVar,
								controlpoints: this.controlpointsList
							};
        }
		else if (typeVar == "circular"){
			var centerVar, radiusVar, startangVar, rotangVar;
			centerVar = this.parser.parseCenter(this.reader.getString(animationsElems[i], "center"));
			radiusVar = this.reader.getFloat(animationsElems[i], "radius");
			startangVar = this.reader.getFloat(animationsElems[i], "startang");
			rotangVar = this.reader.getFloat(animationsElems[i], "rotang");
			this.animationsList[idVar] = {
				span: spanVar,
				type: typeVar,
				center: centerVar,
				radius: radiusVar,
				startang: startangVar,
				rotang: rotangVar
			};
		}
		else
			return "type " + typeVar + " didn't exist.";
    }
	console.log("Finished to read the animation' section.");
}

/*
 * Parse leaf's block on lsx
 */
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
        idVar = this.reader.getString(leaf[i], 'id');
        typeVar = this.reader.getItem(leaf[i], 'type', ["rectangle", "cylinder", "sphere", "triangle"]);
        argsVar = this.reader.getString(leaf[i], 'args');

        if (this.leafList[idVar] != null)
            return "leaf " + idVar + " already exists.";

		//argsParser returns number and not text
		argsVar = this.parser.argsParser(typeVar, argsVar);
        if (argsVar == null)
        	return "args of leaf " + idVar + " are incorrect.";
        
        var leafObj = this.transformToObj(typeVar, argsVar);

        this.leafList[idVar] = 
        			{
        				type: typeVar,
        				object: leafObj,
        				matrixToApply: []
        			};
        /*
			How to access?
				this.leafList(index).id;
		*/
    }
    
    console.log("Finished to read the leaves' section.");
};

/*
 * Parse node's block on lsx
 */
MySceneGraph.prototype.parseNodes = function(rootElement) {
	console.log("Started to read the nodes' section.");
    
    var elems = rootElement.getElementsByTagName('NODES');
    if (elems == null ) {
        return "NODES element is missing.";
    }
    
    if (elems.length == 0) {
        return "nodes missing.";
    }
    
    this.rootElem = elems[0].getElementsByTagName('ROOT');
    if (this.rootElem == null)
    	return "missing root node.";

    this.rootElem = this.reader.getString(this.rootElem[0], 'id');

    var nodes = elems[0].getElementsByTagName('NODE');
    if (nodes.length == 0)
    	return "at least one node must be present.";

    this.nodeList = [];
    var idVar;
    var materialIdVar, textureIdVar;
    var transform, animationIdVar;
    var descendantElems; var descendantIdField;
    var computeMatrix = new MyMatrix();
    var matrix = mat4.create();

    for (var i = 0; i < nodes.length; i++)
	{
    	var matrix = mat4.create();
		mat4.identity(matrix);
		var animationListVar = [];
    	var descendantId = [];

		idVar = this.reader.getString(nodes[i], 'id');
		if (this.nodeList[idVar] != null)
					return "node " + idVar + " already exists.";

		materialIdVar = nodes[i].getElementsByTagName('MATERIAL');
		if (materialIdVar == null || materialIdVar.length != 1)
			return "missing material in node " + idVar + ".";
		materialIdVar = this.reader.getString(materialIdVar[0], 'id');
		if ("null" != materialIdVar && this.materialList[materialIdVar] == null)
			return "material " + materialIdVar + " of node " + idVar + " is incorrect.";

		textureIdVar = nodes[i].getElementsByTagName('TEXTURE');
		if (textureIdVar == null || textureIdVar.length != 1)
			return "missing texture in node " + idVar + ".";
		textureIdVar = this.reader.getString(textureIdVar[0], 'id');
		if ("null" != textureIdVar && "clear" != textureIdVar && this.textureList[textureIdVar] == null)
					return "texture " + textureIdVar + " of node " + idVar + " is incorrect.";

		for (var j = 0; j < nodes[i].children.length; j++)
		{
			
			if (nodes[i].children[j].tagName == "animationref") {
				animationIdVar = this.reader.getString(nodes[i].children[j], "id");
				if (animationIdVar == null)
					return "animation " + animationIdVar + " of node id " + idVar + "is incorrectly defined.";
				
				animationListVar.push(animationIdVar);
				continue;
			}
			
			transform = this.parser.parseTranslation(nodes[i].children[j]);
			if (transform == null)
				return "transformation incorrectly defined in node " + idVar + ".";
			
			if (transform != "" && transform != null)
				computeMatrix.computeMatrix(transform, matrix);
			
		}

		descendantElems = nodes[i].getElementsByTagName('DESCENDANTS');
		if (descendantElems == null || descendantElems == 0)
			return "node " + idVar + " must have one descendant block.";
		descendantElems = descendantElems[0].getElementsByTagName('DESCENDANT');
		if (descendantElems == null || descendantElems == 0)
			return "node " + idVar + " must have at least one descendant element.";

		for (var j = 0; j < descendantElems.length; j++)
		{
			descendantIdField = descendantElems[j].attributes.getNamedItem("id").value;
			if (descendantIdField == null)
				return "at least one descendant of node " + idVar + "doesn't have id.";
			
			descendantId.push(descendantIdField);
		}
		
		this.nodeList[idVar] = {
			material: materialIdVar,
			texture: textureIdVar,
			transformationsMatrix: matrix,
			descendants: descendantId,
			animationList: animationListVar
		};
		
	}
	if(this.nodeList[this.rootElem] == null)
		return "definition of root element " + this.rootElem + " is missing.";
    
    console.log("Finished to read the nodes' section.");
};

/*
 * Search for a repeated id on a given array
 */
MySceneGraph.prototype.isRepeatedId = function(array, id) {
    for (var i = 0; i < array.length; i++) 
    {
        if (array[i].id == id)
            return true;
    }
    
    return false;
};

/*
 * Transform the information fecthed from lsx to a primitive
 */
MySceneGraph.prototype.transformToObj = function(type, argsVar) {
	switch (type)
	{
		case "rectangle":
			return new MyQuad(this.scene, argsVar.xl, argsVar.yl, argsVar.xr, argsVar.yr);

		case "cylinder":
			return new MyCylinder(this.scene, argsVar.h, argsVar.br, argsVar.tr, argsVar.sh, argsVar.ps);

		case "sphere":
			return new MySphere(this.scene, argsVar.r, argsVar.pr, argsVar.ps);

		case "triangle":
			return new MyTriangle(this.scene, argsVar.x1, argsVar.y1, argsVar.z1
									, argsVar.x2, argsVar.y2, argsVar.z2
									, argsVar.x3, argsVar.y3, argsVar.z3);
		default:
			return null;
	}
};