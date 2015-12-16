Board.prototype.constructor=Board;

function Board(scene) {
	this.scene = scene;

var str = "[[[[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]],[[14,18],[14,18]],player1,playerVSplayer,5,[]]";

	this.nextReadIndex;

	var board = this.getBoardFromRequest(str);
	console.log(board);

	var pieces = this.getNumPiecesFromRequest(str);
	console.log(pieces);

	var playerTurn = this.getPlayerTurn(str);
	console.log(playerTurn);

	this.gameStarted = false;
	this.gameList = [];
	Board.currGame = 0;

	//interface GUI
	this.ScoreBoard = '0 - 0';
	this.difficultyPlayer1 = "Human";
	this.difficultyPlayer2 = "Human";
	this.RemainingTime = 0;
	this.ScoreToWin = 5;

	this.server = new Server(this);
};

Board.prototype.startGame = function() {
	var sendMsg = [];
	sendMsg.push(this.ScoreToWin.toString());
	if (this.difficultyPlayer1 == "Human" && this.difficultyPlayer2 == "Human") {
		sendMsg.push("playerVSplayer");
	} else if (this.difficultyPlayer1 == "Human") {
		sendMsg.push("playerVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer2));
	} else if (this.difficultyPlayer2 == "Human") {
		var temp = this.difficultyPlayer1;
		this.difficultyPlayer1 = this.difficultyPlayer2;
		this.difficultyPlayer2 = temp;
		sendMsg.push("playerVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer1));
	} else {
		sendMsg.push("pcVSpc");
		sendMsg.push(this.getDifficulty(this.difficultyPlayer1));
		sendMsg.push(this.getDifficulty(this.difficultyPlayer2));
	}
	console.log(sendMsg.toString());
	this.server.makeRequest("["+sendMsg.toString()+"]");
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
	id = id - 1;
	var row = Math.floor(id / 8);
	var col = id - row * 8;

	console.log("[" + Board.currGame + "," + row + "," + col +"]");

	this.server.makeRequest("[" + Board.currGame + "," + row + "," + col +"]");
};
