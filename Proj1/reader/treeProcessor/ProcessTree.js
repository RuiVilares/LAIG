/**
 * ProcessTree
 * @constructor
 */
 function ProcessTree(graph, scene) {

    this.graph = graph;
    this.scene = scene;

 };

/*
 * Run through the tree starting on the root node.
 * Initial node -> root
 * Initial texture -> clear
 * Initial material -> null
 * This function calls another function that will efectively go through the tree. Please check processInformation function for more information.
 */
ProcessTree.prototype.fillTexturesMaterialsAndProcessMatrix = function() {
	console.log("Started to process the information read.");
	var currentNode;

	var matrix = mat4.create();
	mat4.identity(matrix);

	//search for the root node
	for (var w = 0; w < this.graph.nodeList.length; w++)
	{
		if (this.graph.nodeList[w].id == this.graph.rootElem)
		{
			currentNode = this.graph.nodeList[w];

			if (currentNode.material == "null")
				console.log("Warning: using default values for the root's material.");
			if (currentNode.texture == "null" || currentNode.texture == "clear")
				console.log("Warning: using default values for the root's texture.");

			//go through the tree starting on the root element
			this.processInformation(currentNode.id, "null", "clear", matrix);
			console.log("Finished to process the information read.");
			return;
		}
	}
};

/*
 * This function is recursive. The arguments are the current node/leaf, the current material, texture and matrix (from heritage).
 * The current node is the child node from the parent. If it's a leaf, then the material, texture and matrix are pushed to the leaf (to a special field created with this intent).
 * The matrix is computed through the nodes. So, when it reaches a leaf, it has all the transformations required.
 * If it's a node, then the matrix is computed and the textures and materials are calculated (according to the tree rules).
 * This way of saving the matrix, textures and materials is far more efficient when the tree is complex.
 * This computing is only done once.
 */
ProcessTree.prototype.processInformation = function(currentNode, material, texture, matrix) {
	var index = this.findId(this.graph.leafList, currentNode);
	//if it's a leaf...
	if (index != -1)
	{
		this.pushInfoToLeaf(index, material, matrix, texture);
		return;
	}

	index = this.findId(this.graph.nodeList, currentNode);
	if (index == -1)
	{
		console.log("Node " + currentNode + " hasn't been found (lacks implementation). This node will be ignored.");
		return;
	}
	currentNode = this.graph.nodeList[index];
	
	var tex = this.getTexture(currentNode.texture, texture);
	
	//multiply matrix
	var m = mat4.create();
	mat4.multiply(m, matrix, currentNode.transformationsMatrix);

	//recursive
	for (var i = 0; i < currentNode.descendants.length; i++)
	{
		if (currentNode.material == "null")
			this.processInformation(currentNode.descendants[i], material, tex, m);
		else
			this.processInformation(currentNode.descendants[i], currentNode.material, tex, m);
	}
};

/*
 * Get material data of materialId (string) and copies to material (CFGappearance).
 */
ProcessTree.prototype.setMaterial = function(materialId, material) {
	if (!(typeof materialId === "string" || materialId instanceof String))
	{
		//already processed this node
		console.log("error -> already processed this node");
		return;
	}

	if (materialId == "null")
	{
		this.setDefaultMaterialAppearance(material);
		return;
	}

	var index = this.findId(this.graph.materialList, materialId);
	var node = this.graph.materialList[index];

	this.copyMaterialProperties(material, node);
};

/*
 * Decide if the texture should be the one from the parent node or the one on the node.
 */
ProcessTree.prototype.getTexture = function(textureId, texture) {
	if (textureId == "null")
	{
		return texture;
	}

	return textureId;
};

/*
 * Search for a specific id on a given array.
 */
ProcessTree.prototype.findId = function(array, id) {
	for (var i = 0; i < array.length; i++)
	{
		if (array[i].id == id)
			return i;
	}

	return -1;
};

/*
 * As previously explained on processInformation, this function pushes the material, texture and matrix to an array of a specific leaf.
 */
ProcessTree.prototype.pushInfoToLeaf = function(index, material, matrix, texture) {
    if (texture == "null")
    {
        console.log("Warning: will not be used a texture on the scene.");
    }

    var mat = new CGFappearance(this.scene);
    this.setMaterial(material, mat);

    var w;
    for (w = 0; w < this.graph.textureList.length; w++)
    {
        if (this.graph.textureList[w].id == texture)
        {
            break;
        }
    }

    //now the fully computed matrix is on the leaves
    this.graph.leafList[index].matrixToApply.push([mat, matrix, w]);
};

/*
 * This function is only executed when a material is null. This properties (white) are the default.
 */
ProcessTree.prototype.setDefaultMaterialAppearance = function(material) {
	material.setAmbient(1,1,1,1);
	material.setDiffuse(1,1,1,1);
	material.setSpecular(1,1,1,1);
	material.setEmission(1,1,1,1);
	material.setShininess(10);
};

/*
 * Copy the material properties of a node material to a material
 */
ProcessTree.prototype.copyMaterialProperties = function(material, node) {
	material.setAmbient(node.ambient.r, node.ambient.g, node.ambient.b, node.ambient.a);
	material.setDiffuse(node.diffuse.r, node.diffuse.g, node.diffuse.b, node.diffuse.a);
	material.setSpecular(node.specular.r, node.specular.g, node.specular.b, node.specular.a);
	material.setEmission(node.emission.r, node.emission.g, node.emission.b, node.emission.a)
	material.setShininess(node.shininess.value);
};