/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
	this.scene;
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 
	
	this.gui.add(this.scene,'quit').name("Quit");
	this.gui.add(this.scene,'play').name("Play Game");
	this.gui.add(this.scene,'undo').name("Undo");
	this.gui.add(this.scene,'redo').name("Redo");
	this.gui.add(this.scene, 'RemainingTime', 0, 60).listen();
	this.gui.add(this.scene.board, 'ScoreBoard').listen();

	// add a group of controls (and open/expand by defult)
	//this.lightGroup = this.gui.addFolder("Lights");
	this.gui.add(this.scene, 'difficultyPlayer1', [ 'Human', 'Random', 'Smart' ]);
	this.gui.add(this.scene, 'difficultyPlayer2', [ 'Human', 'Random', 'Smart' ]);

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	
	
		//group.add(this.scene, 'Luz1');

	return true;
};

/**
 * @param {int} i - Number of the light.
 * @param {int} id - ID (name) of the light.
*/
MyInterface.prototype.addLightController = function(i, id){
	//this.lightGroup.add(this.scene.lightsBoolean, i, this.scene.lightsBoolean[i]).name(id);
}
