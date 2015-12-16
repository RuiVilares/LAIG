% GAME FUNCTIONS

% create game Player vs Player
createPlayerVsPlayer(Game, Points):-
	emptyBoard(EmptyBoard),
	putJokers(EmptyBoard, 5, Board),
	Game = [Board, [[14, 18], [14, 18]], player1, playerVSplayer, Points, []].

% create game Player vs PC
createPlayerVsPc(Game, Points, Level1):-
	write('Choose Player 2 difficult level: '), nl, definePcDifficultLevel(Level),
	emptyBoard(EmptyBoard),
	putJokers(EmptyBoard, 5, Board),
	Game = [Board, [[14, 18], [14, 18]], player1, playerVSpc, Points, [0, Level]].

% create game PC vs PC
createPcVsPc(Game, Points, Level1, Level2):-
	emptyBoard(EmptyBoard),
	putJokers(EmptyBoard, 5, Board),
	Game = [Board, [[14, 18], [14, 18]], player1, pcVSpc, Points, [Level1, Level2]].

%POINTS FUNCTIONS
% 3 is intern representation of Player1
% 4 is intern representation of Player2
% 5 is intern representation of Joker
% used to check out player turn
replacePiece([3,_], [-1,11], Game, NewGame):-
	decNumMarkersPlayer1(Game, Game1),
	incNumPiecesPlayer1(Game1, NewGame).

replacePiece([4,_], [-1,22], Game, NewGame):-
	decNumMarkersPlayer2(Game, Game1),
	incNumPiecesPlayer2(Game1, NewGame).

replacePiece([5,Y], [-1,Y], Game, Game).
replacePiece([X,Y], [X,Y], Game, Game).

fixLine([], [], X, X).
fixLine([L|Ls], [X|Xs], Game, NewGame):-
	replacePiece(L, X, Game, Game1),
	fixLine(Ls, Xs, Game1, NewGame).

fixBoard([],[], X, X).
fixBoard([Board|Boards], [NewBoard|NewBoards], Game, NewGame):-
	fixLine(Board, NewBoard, Game, X),
	fixBoard(Boards, NewBoards, X, NewGame).

% Final replace, in case of player punctuation
replace(Board, Row, Col, NewBoard):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(0, Elem, ResElem),
	replaceAux(ResElem, ElemToReplace),
	insertPiece(Board, ElemToReplace, Row, Col, NewBoard).

replaceAux(1, 3).
replaceAux(2, 4).
replaceAux(0, 5).
replaceAux(X, X).

% End player turn
endTurn(Game, NewGame):-
	getGameBoard(Game, Board),
	getGamePlayerTurn(Game, Player),
	((Player == player1, checkAll(Board, 1, Board1));
	(Player == player2, checkAll(Board, 2, Board1))),
	fixBoard(Board1, Board2, Game, Game1),
	assertNumJokers(Board2, NewBoard),
	setGameBoard(Game1, NewBoard, NewGame).

% End pc turn
endRandomTurn(Game, NewGame):-
	getGameBoard(Game, Board),
	getGamePlayerTurn(Game, Player),
	((Player == player1, checkAll(Board, 1, Board1));
	(Player == player2, checkAll(Board, 2, Board1))),
	fixBoard(Board1, Board2, Game, Game1),
	assertNumJokersRandom(Board2, NewBoard),
	setGameBoard(Game1, NewBoard, NewGame).

% Check piece in a specific position
checkCond(Board, Piece, Row, Col):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(0, Elem, ResElem),
	Piece2 is Piece + 2,
	(ResElem == Piece ; ResElem == 0 ; ResElem == 5 ; ResElem == Piece2).

% check all patterns
checkAll(Board, Piece, NewBoard):-
	checkAllX(Board, Piece, Board1),
	checkAllPlus(Board1, Piece, Board2),
	checkAll5Hor(Board2, Piece, Board3),
	checkAll5Ver(Board3, Piece, Board4),
	checkAll5DiaRight(Board4, Piece, Board5),
	checkAll5DiaLeft(Board5, Piece, NewBoard).

% Find X patterns
% Column 0 - 5
% Row 0 - 5
checkAllX(Board, Piece, NewBoard):-
	checkAllXAux(Board, Piece, 0, 0, NewBoard).

checkAllXAux(Board, Piece, 5, 5, NewBoard):-
	checkXAndReplace(Board, Piece, 5, 5, NewBoard).

checkAllXAux(Board, Piece, Row, 5, NewBoard):-
	checkXAndReplace(Board, Piece, Row, 5, NewBoard1),
	Row1 is Row + 1,
	Col1 is 0,
	checkAllXAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAllXAux(Board, Piece, Row, Col, NewBoard):-
	checkXAndReplace(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAllXAux(NewBoard1, Piece, Row, Col1, NewBoard).

checkX(Board, Piece, Row, Col) :-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Col1 is Col + 1,
	Col2 is Col + 2,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row, Col2),
	checkCond(Board, Piece, Row2, Col2),
	checkCond(Board, Piece, Row2, Col),
	checkCond(Board, Piece, Row1, Col1).

replaceX(Board, Row, Col, NewBoard):-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Col1 is Col + 1,
	Col2 is Col + 2,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row, Col2, Board2),
	replace(Board2, Row2, Col2, Board3),
	replace(Board3, Row2, Col, Board4),
	replace(Board4, Row1, Col1, NewBoard).

checkXAndReplace(Board, Piece, Row, Col, NewBoard):-
	checkX(Board, Piece, Row, Col),
	replaceX(Board, Row, Col, NewBoard).

checkXAndReplace(Board, _, _, _, Board).

% Find + pattern
% Column 1 - 6
% Row 1 - 6
checkAllPlus(Board, Piece, NewBoard):-
	checkAllPlusAux(Board, Piece, 0, 1, NewBoard).

checkAllPlusAux(Board, Piece, 5, 6, NewBoard):-
	checkAndReplacePlus(Board, Piece, 5, 6, NewBoard).

checkAllPlusAux(Board, Piece, Row, 6, NewBoard):-
	checkAndReplacePlus(Board, Piece, Row, 6, NewBoard1),
	Row1 is Row + 1,
	Col1 is 1,
	checkAllPlusAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAllPlusAux(Board, Piece, Row, Col, NewBoard):-
	checkAndReplacePlus(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAllPlusAux(NewBoard1, Piece, Row, Col1, NewBoard).

checkPlus(Board, Piece, Row, Col):-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Col0 is Col - 1,
	Col1 is Col + 1,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row1, Col),
	checkCond(Board, Piece, Row2, Col),
	checkCond(Board, Piece, Row1, Col0),
	checkCond(Board, Piece, Row1, Col1).

replacePlus(Board, Row, Col, NewBoard):-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Col0 is Col - 1,
	Col1 is Col + 1,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row1, Col, Board2),
	replace(Board2, Row2, Col, Board3),
	replace(Board3, Row1, Col0, Board4),
	replace(Board4, Row1, Col1, NewBoard).

checkAndReplacePlus(Board, Piece, Row, Col, NewBoard):-
	checkPlus(Board, Piece, Row, Col),
	replacePlus(Board, Row, Col, NewBoard).

checkAndReplacePlus(Board, _, _, _, Board).

% Find 5-in-line horizontal pattern
% Column 0 - 3
% Row 0 - 7
checkAll5Hor(Board, Piece, NewBoard):-
	checkAll5HorAux(Board, Piece, 0, 0, NewBoard).

checkAll5HorAux(Board, Piece, 7, 3, NewBoard):-
	checkAndReplace5Hor(Board, Piece, 7, 3, NewBoard).

checkAll5HorAux(Board, Piece, Row, 3, NewBoard):-
	checkAndReplace5Hor(Board, Piece, Row, 3, NewBoard1),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5HorAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAll5HorAux(Board, Piece, Row, Col, NewBoard):-
	checkAndReplace5Hor(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAll5HorAux(NewBoard1, Piece, Row, Col1, NewBoard).

check5Hor(Board, Piece, Row, Col):-
	Col1 is Col + 1,
	Col2 is Col + 2,
	Col3 is Col + 3,
	Col4 is Col + 4,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row, Col1),
	checkCond(Board, Piece, Row, Col2),
	checkCond(Board, Piece, Row, Col3),
	checkCond(Board, Piece, Row, Col4).

replace5Hor(Board, Row, Col, NewBoard):-
	Col1 is Col + 1,
	Col2 is Col + 2,
	Col3 is Col + 3,
	Col4 is Col + 4,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row, Col1, Board2),
	replace(Board2, Row, Col2, Board3),
	replace(Board3, Row, Col3, Board4),
	replace(Board4, Row, Col4, NewBoard).

checkAndReplace5Hor(Board, Piece, Row, Col, NewBoard):-
	check5Hor(Board, Piece, Row, Col),
	replace5Hor(Board, Row, Col, NewBoard).

checkAndReplace5Hor(Board, _, _, _, Board).

% Find 5-in-line vertical pattern
% Column 0 - 5
% Row 0 - 5
checkAll5Ver(Board, Piece, NewBoard):-
	checkAll5VerAux(Board, Piece, 0, 0, NewBoard).

checkAll5VerAux(Board, Piece, 3, 7, NewBoard):-
	checkAndReplace5Ver(Board, Piece, 3, 7, NewBoard).

checkAll5VerAux(Board, Piece, Row, 7, NewBoard):-
	checkAndReplace5Ver(Board, Piece, Row, 7, NewBoard1),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5VerAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAll5VerAux(Board, Piece, Row, Col, NewBoard):-
	checkAndReplace5Ver(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAll5VerAux(NewBoard1, Piece, Row, Col1, NewBoard).

check5Ver(Board, Piece, Row, Col):-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Row3 is Row + 3,
	Row4 is Row + 4,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row1, Col),
	checkCond(Board, Piece, Row2, Col),
	checkCond(Board, Piece, Row3, Col),
	checkCond(Board, Piece, Row4, Col).

replace5Ver(Board, Row, Col, NewBoard):-
	Row1 is Row + 1,
	Row2 is Row + 2,
	Row3 is Row + 3,
	Row4 is Row + 4,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row1, Col, Board2),
	replace(Board2, Row2, Col, Board3),
	replace(Board3, Row3, Col, Board4),
	replace(Board4, Row4, Col, NewBoard).

checkAndReplace5Ver(Board, Piece, Row, Col, NewBoard):-
	check5Ver(Board, Piece, Row, Col),
	replace5Ver(Board, Row, Col, NewBoard).

checkAndReplace5Ver(Board, _, _, _, Board).

% Find 5-in-line diagonal right pattern
% Column 0 - 3
% Row 0 - 3
checkAll5DiaRight(Board, Piece, NewBoard):-
	checkAll5DiaRightAux(Board, Piece, 0, 0, NewBoard).

checkAll5DiaRightAux(Board, Piece, 3, 3, NewBoard):-
	checkAndReplace5DiaRight(Board, Piece, 3, 3, NewBoard).

checkAll5DiaRightAux(Board, Piece, Row, 3, NewBoard):-
	checkAndReplace5DiaRight(Board, Piece, Row, 3, NewBoard1),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5DiaRightAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAll5DiaRightAux(Board, Piece, Row, Col, NewBoard):-
	checkAndReplace5DiaRight(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAll5DiaRightAux(NewBoard1, Piece, Row, Col1, NewBoard).

check5DiaRight(Board, Piece, Row, Col):-
	Row1 is Row + 1,
	Col1 is Col + 1,
	Row2 is Row + 2,
	Col2 is Col + 2,
	Row3 is Row + 3,
	Col3 is Col + 3,
	Row4 is Row + 4,
	Col4 is Col + 4,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row1, Col1),
	checkCond(Board, Piece, Row2, Col2),
	checkCond(Board, Piece, Row3, Col3),
	checkCond(Board, Piece, Row4, Col4).

replace5DiaRight(Board, Row, Col, NewBoard):-
	Row1 is Row + 1,
	Col1 is Col + 1,
	Row2 is Row + 2,
	Col2 is Col + 2,
	Row3 is Row + 3,
	Col3 is Col + 3,
	Row4 is Row + 4,
	Col4 is Col + 4,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row1, Col1, Board2),
	replace(Board2, Row2, Col2, Board3),
	replace(Board3, Row3, Col3, Board4),
	replace(Board4, Row4, Col4, NewBoard).

checkAndReplace5DiaRight(Board, Piece, Row, Col, NewBoard):-
	check5DiaRight(Board, Piece, Row, Col),
	replace5DiaRight(Board, Row, Col, NewBoard).

checkAndReplace5DiaRight(Board, _, _, _, Board).

% Find 5-in-line diagonal left pattern
% Column 4 - 7
% Row 4 - 7
checkAll5DiaLeft(Board, Piece, NewBoard):-
	checkAll5DiaLeftAux(Board, Piece, 0, 4, NewBoard).

checkAll5DiaLeftAux(Board, Piece, 4, 7, NewBoard):-
	checkAndReplace5DiaLeft(Board, Piece, 4, 7, NewBoard).

checkAll5DiaLeftAux(Board, Piece, Row, 7, NewBoard):-
	checkAndReplace5DiaLeft(Board, Piece, Row, 7, NewBoard1),
	Row1 is Row + 1,
	Col1 is 4,
	checkAll5DiaLeftAux(NewBoard1, Piece, Row1, Col1, NewBoard).

checkAll5DiaLeftAux(Board, Piece, Row, Col, NewBoard):-
	checkAndReplace5DiaLeft(Board, Piece, Row, Col, NewBoard1),
	Col1 is Col + 1,
	checkAll5DiaLeftAux(NewBoard1, Piece, Row, Col1, NewBoard).

check5DiaLeft(Board, Piece, Row, Col):-
	Row1 is Row + 1,
	Col1 is Col - 1,
	Row2 is Row + 2,
	Col2 is Col - 2,
	Row3 is Row + 3,
	Col3 is Col - 3,
	Row4 is Row + 4,
	Col4 is Col - 4,
	checkCond(Board, Piece, Row, Col),
	checkCond(Board, Piece, Row1, Col1),
	checkCond(Board, Piece, Row2, Col2),
	checkCond(Board, Piece, Row3, Col3),
	checkCond(Board, Piece, Row4, Col4).

replace5Left(Board, Row, Col, NewBoard):-
	Row1 is Row + 1,
	Col1 is Col - 1,
	Row2 is Row + 2,
	Col2 is Col - 2,
	Row3 is Row + 3,
	Col3 is Col - 3,
	Row4 is Row + 4,
	Col4 is Col - 4,
	replace(Board, Row, Col, Board1),
	replace(Board1, Row1, Col1, Board2),
	replace(Board2, Row2, Col2, Board3),
	replace(Board3, Row3, Col3, Board4),
	replace(Board4, Row4, Col4, NewBoard).

checkAndReplace5DiaLeft(Board, Piece, Row, Col, NewBoard):-
	check5DiaLeft(Board, Piece, Row, Col),
	replace5Left(Board, Row, Col, NewBoard).

checkAndReplace5DiaLeft(Board, _, _, _, Board).

% Check if a position is empty
checkValidPosition(Board, Row, Col):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(0, Elem, ResElem),
	ResElem == -1.

%% CHECK END CONDITIONS
checkEndConditions(Game):-
	checkPointsEnd(Game),
	checkPiecesEnd(Game),
	checkMarkersEnd(Game).

% max points
checkPointsEnd(Game):-
	getEndPoins(Game, Points),
	getPontuationPlayer1(Game, Pont1),
	getPontuationPlayer2(Game, Pont2),
	Pont1 < Points,
	Pont2 < Points.

% num pieces expire
checkPiecesEnd(Game):-
	getNumPiecesPlayer1(Game, Pieces1),
	getNumPiecesPlayer2(Game, Pieces2),
	Pieces1 > 0,
	Pieces2 > 0.

% num markers expire
checkMarkersEnd(Game):-
	getNumMarkersPlayer1(Game, Markers1),
	getNumMarkersPlayer2(Game, Markers2),
	Markers1 > 0,
	Markers2 > 0.

% MARKERS AND PIECES
%put player 1 marker
putPlayer1Marker(Board, Row, Col, NewBoard):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(0, Elem, ResElem),
	putPlayerMarker(Board, ResElem, Row, Col, NewBoard).

%put player 2 marker
putPlayer2Marker(Board, Row, Col, NewBoard):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(0, Elem, ResElem),
	putPlayerMarker(Board, ResElem, Row, Col, NewBoard).

%put player 1 piece
putPlayerPiece(Board, player1,NewBoard):-
	putPlayer1Piece(Board, NewBoard).

%put player 2 piece
putPlayerPiece(Board, player2,NewBoard):-
	putPlayer2Piece(Board, NewBoard).

%put player 1 piece AUX
putPlayer1Piece(Board, NewBoard):-
	repeat,
		once(readCoords(Row, Col)),
		once(checkValidPosition(Board, Row, Col)),
		insertPiece(Board, 1, Row, Col, NewBoard),
	!.

%put player 2 piece AUX
putPlayer2Piece(Board, NewBoard):-
	repeat,
		once(readCoords(Row, Col)),
		once(checkValidPosition(Board, Row, Col)),
		insertPiece(Board, 2, Row, Col, NewBoard),
	!.

% Insert a piece in the board
insertPiece(Board, Piece, Row, Col, NewBoard):-
	getMatrixElemAt(Row, Col, Board, Elem),
	getListElemAt(1, Elem, ResElem),
	setMatrixElemAtWith(Row, Col, [Piece, ResElem], Board, NewBoard).

% Insert a marker in the board
insertMarker(Board, Marker, Row, Col, NewBoard):-
	setMatrixElemAtWith(Row, Col, [-1, Marker], Board, NewBoard).

% INC AND DEC NUMERO PIECES OR MARKERS
getNumPiecesPlayer1(Game, Num):-
	getListElemAt(1, Game, Lista),
	getListElemAt(0, Lista, Player1),
	getListElemAt(0, Player1, Num).

getNumMarkersPlayer1(Game, Num):-
	getListElemAt(1, Game, Lista),
	getListElemAt(0, Lista, Player1),
	getListElemAt(1, Player1, Num).

getNumPiecesPlayer2(Game, Num):-
	getListElemAt(1, Game, Lista),
	getListElemAt(1, Lista, Player2),
	getListElemAt(0, Player2, Num).

getNumMarkersPlayer2(Game, Num):-
	getListElemAt(1, Game, Lista),
	getListElemAt(1, Lista, Player2),
	getListElemAt(1, Player2, Num).

setNumPiecesPlayer1(Game, Num, NewGame):-
	getListElemAt(1, Game, Lista),
	getListElemAt(0, Lista, Player1),
	setListElemAtWith(0, Num, Player1, ResPlayer1),
	setListElemAtWith(0, ResPlayer1, Lista, ResLista),
	setListElemAtWith(1, ResLista, Game, NewGame).

setNumPiecesPlayer2(Game, Num, NewGame):-
	getListElemAt(1, Game, Lista),
	getListElemAt(1, Lista, Player2),
	setListElemAtWith(0, Num, Player2, ResPlayer2),
	setListElemAtWith(1, ResPlayer2, Lista, ResLista),
	setListElemAtWith(1, ResLista, Game, NewGame).

setNumMarkersPlayer1(Game, Num, NewGame):-
	getListElemAt(1, Game, Lista),
	getListElemAt(0, Lista, Player1),
	setListElemAtWith(1, Num, Player1, ResPlayer1),
	setListElemAtWith(0, ResPlayer1, Lista, ResLista),
	setListElemAtWith(1, ResLista, Game, NewGame).

setNumMarkersPlayer2(Game, Num, NewGame):-
	getListElemAt(1, Game, Lista),
	getListElemAt(1, Lista, Player2),
	setListElemAtWith(1, Num, Player2, ResPlayer2),
	setListElemAtWith(1, ResPlayer2, Lista, ResLista),
	setListElemAtWith(1, ResLista, Game, NewGame).

decNumPiecesPlayer(Game, player1, NewGame):-
	decNumPiecesPlayer1(Game, NewGame).

decNumPiecesPlayer(Game, player2, NewGame):-
	decNumPiecesPlayer2(Game, NewGame).

decNumMarkersPlayer(Game, player1, NewGame):-
	decNumMarkersPlayer1(Game, NewGame).

decNumMarkersPlayer(Game, player2, NewGame):-
	decNumMarkersPlayer2(Game, NewGame).

decNumPiecesPlayer1(Game, NewGame):-
	getNumPiecesPlayer1(Game, Num),
	Num1 is Num - 1,
	setNumPiecesPlayer1(Game, Num1, NewGame).

decNumPiecesPlayer2(Game, NewGame):-
	getNumPiecesPlayer2(Game, Num),
	Num1 is Num - 1,
	setNumPiecesPlayer2(Game, Num1, NewGame).

decNumMarkersPlayer1(Game, NewGame):-
	getNumMarkersPlayer1(Game, Num),
	Num1 is Num - 1,
	setNumMarkersPlayer1(Game, Num1, NewGame).

decNumMarkersPlayer2(Game, NewGame):-
	getNumMarkersPlayer2(Game, Num),
	Num1 is Num - 1,
	setNumMarkersPlayer2(Game, Num1, NewGame).

incNumPiecesPlayer1(Game, NewGame):-
	getNumPiecesPlayer1(Game, Num),
	Num1 is Num + 1,
	setNumPiecesPlayer1(Game, Num1, NewGame).

incNumPiecesPlayer2(Game, NewGame):-
	getNumPiecesPlayer2(Game, Num),
	Num1 is Num + 1,
	setNumPiecesPlayer2(Game, Num1, NewGame).

incNumMarkersPlayer1(Game, NewGame):-
	getNumMarkersPlayer1(Game, Num),
	Num1 is Num + 1,
	setNumMarkersPlayer1(Game, Num1, NewGame).

incNumMarkersPlayer2(Game, NewGame):-
	getNumMarkersPlayer2(Game, Num),
	Num1 is Num + 1,
	setNumMarkersPlayer2(Game, Num1, NewGame).

%GET PONTUATION
getPontuationPlayer1(Game, Pont):-
	getNumMarkersPlayer1(Game, Num),
	Pont is 18 - Num.

getPontuationPlayer2(Game, Pont):-
	getNumMarkersPlayer2(Game, Num),
	Pont is 18 - Num.

% get end points
getEndPoins(Game, Points):-
	getListElemAt(4, Game, Points).

%BOARD FUNCTIONS
% get and set Board
getGameBoard(Game, Board):-
	getListElemAt(0, Game, Board).

setGameBoard(Game, Board, ResGame):-
	setListElemAtWith(0, Board, Game, ResGame).

% get Mode
getGameMode(Game, Mode):-
	getListElemAt(3, Game, Mode).

% get and set player turn
getGamePlayerTurn(Game, Player):-
	getListElemAt(2, Game, Player).

setGamePlayerTurn(Game, Player, ResGame):-
	setListElemAtWith(2, Player, Game, ResGame).

% get player1 pc level
getGamePc1Level(Game, Level):-
	getListElemAt(5, Game, Res),
	getListElemAt(0, Res, Level).

% get player2 pc level
getGamePc2Level(Game, Level):-
	getListElemAt(5, Game, Res),
	getListElemAt(1, Res, Level).

% get player1 pc level AUX
getGamePcLevel(Game, Level):-
	getGamePlayerTurn(Game, Player),
	Player == player1,
	getGamePc1Level(Game, Level),
	write(Level), nl.

% get player2 pc level AUX
getGamePcLevel(Game, Level):-
	getGamePlayerTurn(Game, Player),
	Player == player2,
	getGamePc2Level(Game, Level),
	write(Level), nl.

% INITIAL BOARD
emptyBoard([
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
			[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]
			]).
