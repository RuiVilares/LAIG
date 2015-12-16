% AUXILIRY FUNCTIONS

setInfoMode(Game, Elem, ResGame):-
	setListElemAtWith(6, Elem, Game, ResGame).

%getMatrixElemAt(Row, Col, Matrix, Result)
getMatrixElemAt(0, Col, [X|_], Elem):-
	getListElemAt(Col, X, Elem).
getMatrixElemAt(Row, Col, [_|Y], Elem):-
	Row > 0,
	Row1 is Row-1,
	getMatrixElemAt(Row1, Col, Y, Elem).

%getListElemAt(Pos, List, Result)
getListElemAt(0, [X|_], X).
getListElemAt(Pos, [_|Y], Elem):-
	Pos > 0,
	Pos1 is Pos-1,
	getListElemAt(Pos1, Y, Elem).

%setMatrixElemAtWith(Row, Col, Elem, Matrix, ResMatrix)
setMatrixElemAtWith(0, Col, Elem, [X|Y], [Z|Y]):-
	setListElemAtWith(Col, Elem, X, Z).
setMatrixElemAtWith(Row, Col, Elem, [X|Y], [X|W]):-
	Row > 0,
	Row1 is Row-1,
	setMatrixElemAtWith(Row1, Col, Elem, Y, W).

%setListElemAtWith(Pos, Elem, List, ResList)
setListElemAtWith(0, Elem, [_|L], [Elem|L]).
setListElemAtWith(Pos, Elem, [H|L], [H|ResL]):-
	Pos > 0,
	Pos1 is Pos-1,
	setListElemAtWith(Pos1, Elem, L, ResL).


% INITIALIZE RANDOM SEED
initializeRandom:-
	now(Usec), Seed is Usec mod 30269,
	getrand(random(X, Y, Z, _)),
	setrand(random(Seed, X, Y, Z)), !.

% CLEAN CONSOLE
clearConsole:-
	clearConsole(40), !.
clearConsole(0).
clearConsole(N):-
	nl,
	N1 is N-1,
	clearConsole(N1).


% INPUT FUNCTIONS
getInt(Input):-
	get_code(TempInput),
	Input is TempInput - 48.

getChar(Input):-
	get_char(Input),
	get_char(_).

% discard input
discardInputChar:-
	get_code(_).

% wait enter key
pressEnterToContinue:-
	write('Press ENTER to continue'), nl,
	waitForEnter, !.

waitForEnter:-
	get_char(_).

% insert piece
insertPiece(Row, Col):-
	readCoords(Row, Col), nl.

% read coordinates
readCoords(Row, Col):-
	write('Line: '),
	getInt(SrcRow),

	discardInputChar,
	write('Col: '),
	getInt(SrcCol),

	discardInputChar,

	Row is SrcRow-1,
	Col is SrcCol-1.
