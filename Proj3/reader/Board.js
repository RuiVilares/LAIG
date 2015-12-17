Board.prototype.constructor=Board;

function Board(scene) {
	this.scene = scene;

var str = "[[[[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]],[[14,18],[14,18]],player1,playerVSplayer,5,[]]";

	this.nextReadIndex;

	this.board = this.getBoardFromRequest(str);
	console.log(this.board);

	this.pieces = this.getNumPiecesFromRequest(str);
	console.log(this.pieces);

	this.playerTurn = this.getPlayerTurn(str);
	console.log(this.playerTurn);

	this.gameStarted = false;
	this.gameList = [];
	Board.currGame = 0;
	Board.updatedBoard = false;

	//interface GUI
	this.ScoreBoard = '0 - 0';
	this.difficultyPlayer1 = "Human";
	this.difficultyPlayer2 = "Human";
	this.RemainingTime = 60;
	this.ScoreToWin = 5;

	this.mode1;
	this.mode2;
	this.gameState = "0";

	this.server = new Server(this);
};

Board.prototype.startGame = function() {
	var sendMsg = [];
	sendMsg.push(this.ScoreToWin.toString());
	if (this.difficultyPlayer1 == "Human" && this.difficultyPlayer2 == "Human") {
	    this.mode1 = "Human";
	    this.mode2 = "Human";
		sendMsg.push("playerVSplayer");
	} else if (this.difficultyPlayer1 == "Human") {
	    this.mode1 = "Human";
	    this.mode2 = "PC";
		sendMsg.push("playerVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer2));
	} else if (this.difficultyPlayer2 == "Human") {
	    this.mode1 = "Human";
	    this.mode2 = "PC";
		var temp = this.difficultyPlayer1;
		this.difficultyPlayer1 = this.difficultyPlayer2;
		this.difficultyPlayer2 = temp;
	    this.mode = "playerVSpc";
		sendMsg.push("playerVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer1));
	} else {
	    this.mode1 = "PC";
	    this.mode2 = "PC";
	    this.mode = "pcVSpc";
		sendMsg.push("pcVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer1));
		sendMsg.push(this.getDifficulty(this.difficultyPlayer2));
	}
	console.log(sendMsg.toString());
	this.server.makeRequest("["+sendMsg.toString()+"]");
	this.scene.initTime = this.scene.lastUpdate;
	this.gameStarted = true;
};

Board.prototype.getDifficulty = function(text) {
	if (text == "Random") {
		return "1";
	} else {
		return "2";
	}
}

Board.prototype.quit = function() {
	this.server.quit();
}

Board.prototype.play = function() {
	this.startGame();
	console.log("play");
}

Board.prototype.undo = function() {
	console.log("undo");
}

Board.prototype.redo = function() {
	console.log("redo");
}

Board.prototype.getBoardFromRequest = function(request) {
	var patt=/\[\[\[[^\[](.)*\]\]\]/i;
	var match=patt.exec(request);
	var tabuleiro = JSON.parse(match[0]);
	this.nextReadIndex = match[0].length + 2;
	return tabuleiro;
};

Board.prototype.getNumPiecesFromRequest = function(request) {
	var sub = request.substring(this.nextReadIndex, request.length-1);
	var patt=/\[\[(.)*\]\]/i;
	var match=patt.exec(sub);
	this.nextReadIndex += (match[0].length+1);
	var pieces = JSON.parse(match[0]);
	return pieces;
};

Board.prototype.getPlayerTurn = function(request) {
	var player = parseInt(request[this.nextReadIndex+6]);
	this.nextReadIndex += ("playerX".length+1);
	return player;
};

Board.prototype.sendMove = function(id) {
	if (!this.gameStarted) {
		return;
	}
	if (this.gameState != "0" && this.gameState != "3") {
		return;
	}

	id = id - 1;
	var row = Math.floor(id / 8);
	var col = id - row * 8;

	this.server.makeRequest("[" + Board.currGame + "," + row + "," + col +"]");
};

Board.prototype.makePlay = function() {
	if (!this.gameStarted) {
		return;
	}
  	this.RemainingTime = 60 - this.scene.secondsElapsed;

	if (Board.updatedBoard) {
		Board.updatedBoard = false;
		this.board = this.getBoardFromRequest(Board.currGame);
		console.log(this.board);

		this.pieces = this.getNumPiecesFromRequest(Board.currGame);
		this.ScoreBoard = (18-this.pieces[0][1]) + " - " + (18-this.pieces[1][1]);
		console.log(this.pieces);

		this.playerTurn = this.getPlayerTurn(Board.currGame);
		console.log(this.playerTurn);

		this.gameState = Board.currGame[Board.currGame.length - 2];
		console.log(this.gameState);

		this.scene.initTime = this.scene.lastUpdate;
	}
	else if (this.RemainingTime < 0) {
		(this.playerTurn == 1) ? (this.playerTurn = 2) : (this.playerTurn = 1);
		Board.currGame = Board.currGame.replaceAt(this.nextReadIndex-2, this.playerTurn.toString());
		console.log("Timeout -> " + Board.currGame);
		this.scene.initTime = this.scene.lastUpdate;
	} else {
		return;
	}

	if (this.gameState != "0" && this.gameState != "3") {
		this.ScoreBoard = "Player " + this.gameState + " won!";
		this.scene.initTime = this.scene.lastUpdate;
		return;
	}

	if (this.playerTurn == 1 && this.mode1 == "PC") {
		console.log("this.playerTurn == 1");
        this.server.makeRequest("[" + Board.currGame +"]");
	} else if (this.playerTurn == 2 && this.mode2 == "PC") {
		console.log("this.playerTurn == 2");
        this.server.makeRequest("[" + Board.currGame +"]");
	}
};

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}