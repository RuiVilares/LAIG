%PC INSERT PIECE PLAYER1 AND PLAYER2 LEVEL 0
pcMove(Board, player1, NewBoard):-
	repeat,
		once(random(0, 8, Row)),
		once(random(0, 8, Col)),
		once(checkValidPosition(Board, Row, Col)),
		insertPiece(Board, 1, Row, Col, NewBoard),
	!.

pcMove(Board, player2, NewBoard):-
	repeat,
		once(random(0, 8, Row)),
		once(random(0, 8, Col)),
		once(checkValidPosition(Board, Row, Col)),
		insertPiece(Board, 2, Row, Col, NewBoard),
	!.

%PC INSERT PIECE PLAYER1 AND PLAYER2 SMART ALGORITHM
pcSmartMoveAlgorithm(Board, Player, NewBoard, Game):-
	findBestOption(Board, 20, Player, _, NewBoard, Game, -1).

findBestOption(_, 0, _, Board, Board, _, _).
findBestOption(Board, Num, Player, _, NewBoard, Game, Points):-
	Num > 0,
	Num1 is Num - 1,
	pcMove(Board, Player, BoardTemp),
	(
	Player == player1 ->
			(checkAll(BoardTemp, 1, BoardChecked));
	checkAll(BoardTemp, 2, BoardChecked)
	),
	fixBoard(BoardChecked, _, Game, NewGame),
	(
	Player == player1 ->
			(getPontuationPlayer1(NewGame, Pontuation));
	(getPontuationPlayer2(NewGame, Pontuation))
	),
	(
	Pontuation > Points->
			(findBestOption(Board, Num1, Player, BoardTemp, NewBoard, Game, Pontuation));
		findBestOption(Board, Num1, Player, BoardTemp, NewBoard, Game, Points)
	).


	% PC RANDOM MOVE TURN
	pcRandomMove(Game, NewGame):-
		getGameBoard(Game, Board), getGamePlayerTurn(Game, Player),
		%%clearConsole,
		%%printBoard(Board),
		%%printTurnInfo(Player, Game), nl, nl,
		pcMove(Board, Player, NewBoard),
		decNumPiecesPlayer(Game, Player, Game1),
		setGameBoard(Game1, NewBoard, Game2),
		endRandomTurn(Game2, TempGame),
		changePlayer(TempGame, NewGame), !.

	% PC SMART MOVE TURN
	pcSmartMove(Game, NewGame):-
		getGameBoard(Game, Board), getGamePlayerTurn(Game, Player),
		%%clearConsole,
		%%printBoard(Board),
		%%printTurnInfo(Player, Game), nl, nl,
		pcSmartMoveAlgorithm(Board, Player, NewBoard, Game),
		decNumPiecesPlayer(Game, Player, Game1),
		setGameBoard(Game1, NewBoard, Game2),
		endRandomTurn(Game2, TempGame),
		changePlayer(TempGame, NewGame), !.
