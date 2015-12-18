% JOKER FUCTIONS

% Assert number of jokers, in case of pontuation
assertNumJokers(Board):-
	countNumOfJokers(Board, Num), !,
	Num < 5.

% Assert number of jokers randomly
assertNumJokersRandom(Board, NewBoard):-
	countNumOfJokers(Board, Num),
	Num1 is 5 - Num,
	putJokers(Board, Num1, NewBoard).

% Count number of jokers in the board
countNumOfJokersAux([],0).
countNumOfJokersAux([[0, _]|Ls], Num):-
	countNumOfJokersAux(Ls, Num1),
	Num is Num1 + 1.
countNumOfJokersAux([_|Ls], Num):-
	countNumOfJokersAux(Ls, Num).

countNumOfJokers([], 0).
countNumOfJokers([Board|Boards], Num):-
	countNumOfJokersAux(Board, NumAux),
	countNumOfJokers(Boards, NumAux1),
	Num is NumAux + NumAux1.

% put a joker in the board
putJokers(X, 0, X).
putJokers(Board, Num, NewBoard):-
	Num > 0,
	Num1 is Num - 1,
	putRandomJoker(Board, X),
	putJokers(X, Num1, NewBoard).

% put a joker in the board by player
putPlayerJokers(X, 0, X).
putPlayerJokers(Board, Num, NewBoard):-
	Num > 0,
	Num1 is Num - 1,
	putJoker(Board, X),
	putPlayerJokers(X, Num1, NewBoard).

% check if the joker can be added
putJoker(Board, Row, Col, NewBoard):-
	%%printBoard(Board),
	checkValidPosition(Board, Row, Col),
	checkPatern(Board, Row, Col),
	insertPiece(Board, 0, Row, Col, NewBoard).

% put a joker in the board by pc
putRandomJoker(Board, NewBoard):-
	repeat,
		once(random(0, 8, Row)),
		once(random(0, 8, Col)),
		once(checkValidPosition(Board, Row, Col)),
		once(checkPatern(Board, Row, Col)),
		insertPiece(Board, 0, Row, Col, NewBoard),
	!.

% PUT JOKER CONDITIONS

% check if the X pattern is formed
checkAllXJoker(Board, Piece):-
	checkAllXAuxJoker(Board, Piece, 0, 0).

checkAllXAuxJoker(Board, Piece, 5, 5):-
	checkX(Board, Piece, 5, 5).

checkAllXAuxJoker(Board, Piece, Row, 5):-
	checkX(Board, Piece, Row, 5),
	Row1 is Row + 1,
	Col1 is 0,
	checkAllXAuxJoker(Board, Piece, Row1, Col1).

checkAllXAuxJoker(Board, Piece, Row, Col):-
	checkX(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAllXAuxJoker(Board, Piece, Row, Col1).

% check if the + pattern is formed
checkAllPlusJoker(Board, Piece):-
	checkAllPlusAuxJoker(Board, Piece, 0, 1).

checkAllPlusAuxJoker(Board, Piece, 5, 6):-
	checkPlus(Board, Piece, 5, 6).

checkAllPlusAuxJoker(Board, Piece, Row, 6):-
	checkPlus(Board, Piece, Row, 6),
	Row1 is Row + 1,
	Col1 is 1,
	checkAllPlusAuxJoker(Board, Piece, Row1, Col1).

checkAllPlusAuxJoker(Board, Piece, Row, Col):-
	checkPlus(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAllPlusAuxJoker(Board, Piece, Row, Col1).

% check if the 5-in-line horizontal pattern is formed
checkAll5HorJoker(Board, Piece):-
	checkAll5HorAuxJoker(Board, Piece, 0, 0).

checkAll5HorAuxJoker(Board, Piece, 7, 3):-
	check5Hor(Board, Piece, 7, 3).

checkAll5HorAuxJoker(Board, Piece, Row, 3):-
	check5Hor(Board, Piece, Row, 3),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5HorAuxJoker(Board, Piece, Row1, Col1).

checkAll5HorAuxJoker(Board, Piece, Row, Col):-
	check5Hor(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAll5HorAuxJoker(Board, Piece, Row, Col1).

% check if the 5-in-line vertical pattern is formed
checkAll5VerJoker(Board, Piece):-
	checkAll5VerAuxJoker(Board, Piece, 0, 0).

checkAll5VerAuxJoker(Board, Piece, 3, 7):-
	check5Ver(Board, Piece, 3, 7).

checkAll5VerAuxJoker(Board, Piece, Row, 7):-
	check5Ver(Board, Piece, Row, 7, Board),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5VerAuxJoker(Board, Piece, Row1, Col1).

checkAll5VerAuxJoker(Board, Piece, Row, Col):-
	check5Ver(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAll5VerAuxJoker(Board, Piece, Row, Col1).

% check if the 5-in-line diagonal right pattern is formed
checkAll5DiaRightJoker(Board, Piece):-
	checkAll5DiaRightAuxJoker(Board, Piece, 0, 0).

checkAll5DiaRightAuxJoker(Board, Piece, 3, 3):-
	check5DiaRight(Board, Piece, 3, 3).

checkAll5DiaRightAuxJoker(Board, Piece, Row, 3):-
	check5DiaRight(Board, Piece, Row, 3),
	Row1 is Row + 1,
	Col1 is 0,
	checkAll5DiaRightAuxJoker(Board, Piece, Row1, Col1).

checkAll5DiaRightAuxJoker(Board, Piece, Row, Col):-
	check5DiaRight(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAll5DiaRightAuxJoker(Board, Piece, Row, Col1).

% check if the 5-in-line diagonal left pattern is formed
checkAll5DiaLeftJoker(Board, Piece):-
	checkAll5DiaLeftAuxJoker(Board, Piece, 0, 4).

checkAll5DiaLeftAuxJoker(Board, Piece, 4, 7):-
	check5DiaLeft(Board, Piece, 4, 7).

checkAll5DiaLeftAuxJoker(Board, Piece, Row, 7):-
	check5DiaLeft(Board, Piece, Row, 7),
	Row1 is Row + 1,
	Col1 is 4,
	checkAll5DiaLeftAuxJoker(Board, Piece, Row1, Col1).

checkAll5DiaLeftAuxJoker(Board, Piece, Row, Col):-
	check5DiaLeft(Board, Piece, Row, Col),
	Col1 is Col + 1,
	checkAll5DiaLeftAuxJoker(Board, Piece, Row, Col1).

% check all paterns
checkPatern(Board, Row, Col):-
	insertPiece(Board, 0, Row, Col, NewBoard),
	(\+ checkAllXJoker(NewBoard, 1)), (\+ checkAllXJoker(NewBoard, 2)),
	(\+ checkAllPlusJoker(NewBoard, 1)), (\+ checkAllPlusJoker(NewBoard, 2)),
	(\+ checkAll5HorJoker(NewBoard, 1)), (\+ checkAll5HorJoker(NewBoard, 2)),
	(\+ checkAll5VerJoker(NewBoard, 1)), (\+ checkAll5VerJoker(NewBoard, 2)),
	(\+ checkAll5DiaRightJoker(NewBoard, 1)), (\+ checkAll5DiaRightJoker(NewBoard, 2)),
	(\+ checkAll5DiaLeftJoker(NewBoard, 1)), (\+ checkAll5DiaLeftJoker(NewBoard, 2)).
