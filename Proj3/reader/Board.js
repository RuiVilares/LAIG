Board.prototype.constructor=Board;

function Board() {
    
var str = "[[[[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]],[[14,18],[14,18]],player1,playerVSplayer,5,[]]";

	this.nextReadIndex;

	var board = this.getBoardFromRequest(str);
	console.log(board);
	
	var pieces = this.getNumPiecesFromRequest(str);
	console.log(pieces);
};

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