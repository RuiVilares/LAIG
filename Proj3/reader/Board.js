Board.prototype.constructor=Board;

function Board() {
   
var str = "[[[[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]],[[14,18],[14,18]],player1,playerVSplayer,5,[]]";

	//o request vai ter que devolver qual foi a jogada (a peca movida)
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//temos de falar sobre como e que vamos dizer qual peca
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	this.nextReadIndex;

	var board = this.getBoardFromRequest(str);
	console.log(board);
	
	var pieces = this.getNumPiecesFromRequest(str);
	console.log(pieces);

	var playerTurn = this.getPlayerTurn(str);
	console.log(playerTurn);

	//endPoints é o número de Pontos em que o jogo acaba
	//level1 e level2 e o nivel de dificuldade do jogador 1 e 2
	//typeOfGame pode ser humanoVShumano, playerVSplayer, ...
	//timeForEachPlayer e o tempo para cada jogador (se acabar o tempo, passa a vez)
	var endPoints, level1, level2, typeOfGame, timeForEachPlayer;

	//so sao guardadas as jogadas e tabuleiros validos
	//para depois fazer o filme (com animacao) basta chamar o prolog com a moveList
	//para depois fazer undo e so ir buscar o ultimo elemento do array
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//(temos de falar sobre quando e que o undo e possivel!!!)
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	var boardsList = []; //Exemplo: boardsList[0] = tabuleiro
	var movesList = []; //Exemplo: movesList[0] = [Peca, jogador] (temos de falar como guardamos a peca/jogada)
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

Board.prototype.getPlayerTurn = function(request) {
	var player = parseInt(request[this.nextReadIndex+6]);
	this.nextReadIndex += ("playerX".length+1);
	return player;
};