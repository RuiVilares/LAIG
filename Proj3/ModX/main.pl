% INCLUDES
:- use_module(library(random)).
:- use_module(library(system)).
:- include('menu.pl').
:- include('auxiliaryFunctions.pl').
:- include('printFunctions.pl').
:- include('jokerFunctions.pl').
:- include('gameFunctions.pl').
:- include('randomPC.pl').

% START GAME
modx:-
	initializeRandom,
	mainMenu.

% NORMAL GAME
playGame(Game, Row, Col, ResGame):-
	checkEndConditions(Game),
	(
		% pc vs pc
		(getGameMode(Game, Mode), Mode == pcVSpc) -> (
			(getGamePcLevel(Game, Level), Level == 1) -> (pcRandomMove(Game, ResGame));
			(getGamePcLevel(Game, Level), Level == 2) -> (pcSmartMove(Game, ResGame))
		);
		% player vs. player or player vs. bot
		(
			(
				% player vs player
				(getGameMode(Game, Mode), Mode == playerVSplayer) -> (humanTurn(Game, Row, Col, ResGame));

				% player vs pc
				(
					(getGamePlayerTurn(Game, Player), Player == player1) -> (humanTurn(Game, Row, Col, ResGame));
					(
						(getGamePcLevel(ResGame, Level), Level == 1) -> (pcRandomMove(ResGame, ResGame));
						(getGamePcLevel(ResGame, Level), Level == 2) -> (pcSmartMove(ResGame, ResGame))
					)
				)
			)
		)
	).

% END GAME
playGame(Game, Row, Col, ResGame):-
	clearConsole,
	getGameBoard(Game, Board),
	once(printBoard(Board)),
	getPontuationPlayer1(Game, Pont1),
	getPontuationPlayer2(Game, Pont2),
	% check which player won
	(
		(Pont1 > Pont2 ->
			(write('# Game over. Player 1 won, congratulations!'), nl));
		(Pont1 < Pont2 ->
			(write('# Game over. Player 2 won, congratulations!'), nl));
		(getNumPiecesPlayer1(Game, Num1), getNumPiecesPlayer2(Game, Num2),
			(Num1 @>  Num2 ->
			(write('# Game over. Player 1 won, Player 1 was more unused pieces'), nl));
			(Num1 @< Num2 ->
			(write('# Game over. Player 2 won, Player 2 was more unused pieces'), nl))
		)
	),
	nl, !.

	% HUMAN TURN
	humanTurn(Game, Row, Col, ResGame):-
		getGameBoard(Game, Board), getGamePlayerTurn(Game, Player),
		clearConsole,
		once(printBoard(Board)),
		printTurnInfo(Player, Game), nl, nl,
		putPlayerPiece(Board, Player, Row, Col, NewBoard),
		decNumPiecesPlayer(Game, Player, Game1),
		setGameBoard(Game1, NewBoard, Game2),
		endTurn(Game2, TempGame),
		once(printBoard(NewBoard)),
		changePlayer(TempGame, ResGame), !.

	humanTurn(Game, _, _, Game).


% CHANGE PLAYER TURN
changePlayer(Game, ResGame):-
	getGamePlayerTurn(Game, Player),
	(
		Player == player1 ->
			NextPlayer = player2;
		NextPlayer = player1
	),
	setGamePlayerTurn(Game, NextPlayer, ResGame).
