% AUXILIARY PRINT FUNCTIONS

% Print matrix function, only for tests
printMatrix([]).
printMatrix([Line | Tail]):-
	printList(Line), nl,
	printMatrix(Tail).

% Print list function, only for tests
printList([]).
printList([Head | Tail]):-
	write(Head),
	write(','),
	printList(Tail).
	
	
% BOARD PRINT FUNCTIONS

%translate code to game piece
translateCodeToChar(-1, ' ').
translateCodeToChar(11, '*').
translateCodeToChar(22, ':').
translateCodeToChar(X, X).

%print horizontal lines
printHorizontalLine(0).
printHorizontalLine(NumberOfDashes) :-
	write('-'),
	N is NumberOfDashes - 1,
	printHorizontalLine(N).
horizontalLine(Number) :-
	Number < 8,
	write('  '),
	write('|'),
	printHorizontalLine(63),
	write('|').
horizontalLine(_). %to prevent fail

%print vertical lines
printBeginning(_) :-
	write('| ').
printMiddle(_) :-
	write(' | ').
printEnd(_) :-
	write(' |').
toPrintMiddle(N) :-
	N > 0,
	N < 8,
	printMiddle(_).
toPrintMiddle(_). %to prevent fail
writeChar(_, 0). %base case
writeChar(X, N) :-
	write(X),
	N1 is N - 1,
	writeChar(X, N1).

%Print Board
%65 horizontal chars
printBoard(Board) :-
	nl, write('      1       2       3       4       5       6       7       8    '), nl,
	write('  '),
	printHorizontalLine(65),
	printBoardAux(Board,0),
	write('  '),
	printHorizontalLine(65),
	nl.

%Display (Board.length div 8) times
printBoardAux([],_).
printBoardAux([Line|Board], CurrentNumberVertical) :-
	Block is CurrentNumberVertical + 1,
	printBlock(Line, Block),
	nl,
	horizontalLine(Block),
	printBoardAux(Board, Block).

%print every horizontal blocks 
printBlock(Line, LineNum) :-
	nl,
	write('  '),
	printBeginning(_), % '| '
	printLine1(Line, 0), %display first block line
	printEnd(_), nl, % ' |\n'
	write(LineNum), write(' '),
	printBeginning(_),
	printLine2(Line, 0), %display second block line
	printEnd(_), nl,
	write('  '),
	printBeginning(_),
	printLine3(Line, 0), %display third block line
	printEnd(_).

%print first block line
print1(' ', Tile) :-
	writeChar(Tile, 5).
print1(Cross, Tile) :-
	writeChar(Cross, 1), writeChar(Tile, 3), writeChar(Cross, 1).
printLine1([], _).
printLine1([Current|Line], N) :-
	toPrintMiddle(N),
	convertCode(Current, Cross, Tile),
	print1(Cross, Tile),
	N1 is N + 1,
	printLine1(Line, N1).

%print second block line
print2(' ', Tile) :-
	writeChar(Tile, 5).
print2(Cross, Tile) :-
	writeChar(Tile, 2), writeChar(Cross, 1), writeChar(Tile, 2).
printLine2([], _).
printLine2([Current|Line], N) :-
	toPrintMiddle(N),
	convertCode(Current, Cross, Tile),
	print2(Cross, Tile),
	N1 is N + 1,
	printLine2(Line, N1).

%print third block line
print3(' ', Tile) :-
	writeChar(Tile, 5).
print3(Cross, Tile) :-
	writeChar(Cross, 1), writeChar(Tile, 3), writeChar(Cross, 1).
printLine3([], _).
printLine3([Current|Line], N) :-
	toPrintMiddle(N),
	convertCode(Current, Cross, Tile),
	print3(Cross, Tile),
	N1 is N + 1,
	printLine3(Line, N1).

%convert code in game piece
convertCode([Cross|Tile], X, Y) :-
	convertCodeAux(Cross, Tile, X, Y).

convertCodeAux(Cross, [Tile|_], X, Y) :-
	translateCodeToChar(Cross, X),
	translateCodeToChar(Tile, Y).
	
%print player 1 information
printTurnInfo(player1, Game):-
	write('Player 1 info:'), nl,
	getNumPiecesPlayer1(Game, Pieces),
	getNumMarkersPlayer1(Game, Markers),
	getPontuationPlayer1(Game, Pont),
	write('> Pieces: '), write(Pieces), nl,
	write('> Markers: '), write(Markers), nl,
	write('> Pontuation: '), write(Pont), nl.

%print player 2 information
printTurnInfo(player2, Game):-
	write('Player 2 info:'), nl,
	getNumPiecesPlayer2(Game, Pieces),
	getNumMarkersPlayer2(Game, Markers),
	getPontuationPlayer2(Game, Pont),
	write('> Pieces: '), write(Pieces), nl,
	write('> Markers: '), write(Markers), nl,
	write('> Pontuation: '), write(Pont), nl.