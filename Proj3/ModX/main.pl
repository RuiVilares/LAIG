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

% assertNumJokers
playGame(Game, Row, Col, ResGame):-
	checkEndConditions(Game),
	getGameBoard(Game, Board),
	assertNumJokers(Board),
	putJoker(Board, Row, Col, NewBoard),
	setGameBoard(Game, NewBoard, ResGame).

% NORMAL GAME
playGame(Game, Row, Col, ResGame):-
	(
		% pc vs pc
		(getGameMode(Game, Mode), Mode == pcVSpc) -> (
			(getGamePcLevel(Game, Level), Level == 1) -> (pcRandomMove(Game, TempGame));
			(getGamePcLevel(Game, Level), Level == 2) -> (pcSmartMove(Game, TempGame))
		);
		% player vs. player or player vs. bot
		(
			(
				% player vs player
				(getGameMode(Game, Mode), Mode == playerVSplayer) -> (humanTurn(Game, Row, Col, TempGame));

				% player vs pc
				(
					(getGamePlayerTurn(Game, Player), Player == player1) -> (humanTurn(Game, Row, Col, TempGame));
					(getGamePlayerTurn(Game, Player), Player == player2) ->
					(
						(getGamePcLevel(Game, Level), Level == 1) -> (pcRandomMove(Game, TempGame));
						(getGamePcLevel(Game, Level), Level == 2) -> (pcSmartMove(Game, TempGame))
					)
				)
			)
		)
	),
	condition(TempGame, ResGame).

condition(TempGame, TempGame):-
	checkEndConditions(TempGame).

condition(TempGame, ResGame):-
	endGame(TempGame, ResGame).

% END GAME
endGame(Game, ResGame):-
	%%clearConsole,
	getGameBoard(Game, Board),
	%%once(printBoard(Board)),
	getPontuationPlayer1(Game, Pont1),
	getPontuationPlayer2(Game, Pont2),
	% check which player won
	(
		(Pont1 > Pont2 ->
			(setInfoMode(Game, 1, ResGame)));
		(Pont1 < Pont2 ->
			(setInfoMode(Game, 2, ResGame)));
		(getNumPiecesPlayer1(Game, Num1), getNumPiecesPlayer2(Game, Num2),
			(Num1 @>  Num2 ->
			(setInfoMode(Game, 1, ResGame)));
			(Num1 @< Num2 ->
			(setInfoMode(Game, 2, ResGame)))
		)
	),
	nl, !.

	% HUMAN TURN
	humanTurn(Game, Row, Col, ResGame):-
		getGameBoard(Game, Board), getGamePlayerTurn(Game, Player),
		%%clearConsole,
		%%once(printBoard(Board)),
		%%printTurnInfo(Player, Game), nl, nl,
		putPlayerPiece(Board, Player, Row, Col, NewBoard),
		decNumPiecesPlayer(Game, Player, Game1),
		setGameBoard(Game1, NewBoard, Game2),
		endTurn(Game2, TempGame),
		%%once(printBoard(NewBoard)),
		setInfoMode(TempGame, 0, TempGame1),
		changePlayer(TempGame1, ResGame), !.

	humanTurn(Game, _, _, ResGame):-
			setInfoMode(Game, 3, ResGame).


% CHANGE PLAYER TURN
changePlayer(Game, ResGame):-
	getGamePlayerTurn(Game, Player),
	(
		Player == player1 ->
			NextPlayer = player2;
		NextPlayer = player1
	),
	setGamePlayerTurn(Game, NextPlayer, ResGame).
