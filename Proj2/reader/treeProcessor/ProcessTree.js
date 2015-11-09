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
	//console.log("Started to process the information read.");
	var currentNode;

	var matrix = mat4.create();
	mat4.identity(matrix);
	
	currentNode = this.graph.nodeList[this.graph.rootElem];

	/*if (currentNode.material == "null")
		console.log("Warning: using default values for the root's material.");
	if (currentNode.texture == "null" || currentNode.texture == "clear")
		console.log("Warning: using default values for the root's texture.");*/

	//go through the tree starting on the root element
	this.processInformation(this.graph.rootElem, "null", "clear", matrix);
	//console.log("Finished to process the information read.");
	return;
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
	//if it's a leaf...
	if (this.graph.leafList[currentNode] != null)
	{
		this.pushInfoToLeaf(currentNode, material, matrix, texture);
		return;
	}

	if (this.graph.nodeList[currentNode] == null)
	{
		console.log("Node " + currentNode + " hasn't been found (lacks implementation). This node will be ignored.");
		return;
	}
	
	var tex = this.getTexture(this.graph.nodeList[currentNode].texture, texture);
	
	//multiply matrix
	var m = mat4.create();
	mat4.multiply(m, matrix, this.graph.nodeList[currentNode].transformationsMatrix);

	//processar aqui as animações
	this.processAnimations(m, this.graph.nodeList[currentNode].animationList);

	//recursive
	for (var i = 0; i < this.graph.nodeList[currentNode].descendants.length; i++)
	{
		if (this.graph.nodeList[currentNode].material == "null")
			this.processInformation(this.graph.nodeList[currentNode].descendants[i], material, tex, m);
		else
			this.processInformation(this.graph.nodeList[currentNode].descendants[i], this.graph.nodeList[currentNode].material, tex, m);
	}
};

ProcessTree.prototype.processAnimations=function(matrix, animationList){
	var m = mat4.create();
	mat4.identity(m);
	var startTime = 0;
	//this.scene.secondsElapsed
	for (var i = 0; i < animationList.length; i++) {
		var animation = this.graph.animationsList[animationList[i]];
		
		if (animation.type == "linear") {
			//processar animação linear
		} else {
			//processar animação circular
		}

		startTime += animation.span;
	}

	mat4.multiply(m, matrix, m);
}

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

	this.copyMaterialProperties(material, this.graph.materialList[materialId]);
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

    this.drawScene(index, mat, matrix, texture);
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
	material.setEmission(node.emission.r, node.emission.g, node.emission.b, node.emission.a);
	material.setShininess(node.shininess.value);
};

ProcessTree.prototype.drawScene = function(index, material, matrix, texture) {
	var tex = null;
	var textureHasBeenWritten = false;

	//copy of the texture to a new variable
	tex = this.graph.textureList[texture];

	//push current scene's matrix
	this.scene.pushMatrix();
		//apply node's transformation
		this.scene.multMatrix(matrix);

		//apply node's material
		material.apply();

		if (tex != null && texture != "clear")
		{
			if (this.graph.leafList[index].type == "triangle" || this.graph.leafList[index].type == "rectangle")
			{
				//apply texture scaling in case of triangle or rectangle
				this.graph.leafList[index].object.scaleTexture(tex.amplif_factor.s, tex.amplif_factor.t);
			}
			//draw texture
			tex.obj.bind();
			textureHasBeenWritten = true;
		}
		else
		{
			textureHasBeenWritten = false;
		}
		this.graph.leafList[index].object.display();

		if (textureHasBeenWritten)
		{
			//undraw texture
			tex.obj.unbind();
		}
		
	this.scene.popMatrix();
}