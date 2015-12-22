BoardAnimation.prototype.constructor=BoardAnimation;

function BoardAnimation(scene, board) {
	this.scene = scene;
    this.board = board;

    this.animationList = [];
    this.animationTimeLength = 2; //seconds

    this.temporaryPlace1 = [];
    this.temporaryPlace2 = [];
    this.temporaryPlaceJoker = [];

    this.piecesHeigth = 3;
    this.markerHeigth = 1;
};

BoardAnimation.prototype.makeAnimation = function(boardPrev, boardAfter, normal) {
	this.timeStarted = this.scene.currTime;
	
	this.normal = normal;
	this.boardPrev = boardPrev;

    this.temporaryPlace1 = this.board.player1PiecesOutside.slice();
    this.temporaryPlace2 = this.board.player2PiecesOutside.slice();
    this.temporaryPlaceJoker = this.board.jokerPiecesOutside.slice();
    this.temporaryMarker1 = this.board.player1MarkersOutside;
    this.temporaryMarker2 = this.board.player2MarkersOutside;

    for (var i = 0; i < boardPrev.length; i++) {
        for (var j = 0; j < boardPrev[i].length; j++) {
            if (boardPrev[i][j][0] != boardAfter[i][j][0]) {
                //por
                if (boardPrev[i][j][0] == -1) {
                    this.putPiece(i,j,boardAfter[i][j][0]);
                }
                //tirar
                else if (boardAfter[i][j][0] == -1) {
                    this.takeOutPiece(i,j,boardPrev[i][j][0]);
                    boardPrev[i][j][0] = -1;
                }
                //tirar e por
                else {
                    this.takeOutPiece(i,j,boardPrev[i][j][0]);
                    boardPrev[i][j][0] = -1;
                    this.putPiece(i,j,boardAfter[i][j][0]);
                }
            }

            if (boardPrev[i][j][1] != boardAfter[i][j][1]) {
            	if (boardAfter[i][j][1] == -1) {
            		//tirar
            		this.takeMarker(i,j,boardPrev[i][j][1]);
            	} else {
					//por
					this.putMarker(i,j,boardAfter[i][j][1]);
            	}
            }
        }
    }
    
	if (this.normal) {
		this.board.board = boardPrev;
		this.newBoard = boardAfter;
	}
};

BoardAnimation.prototype.takeOutPiece = function(i,j,playerVar) {
	if (playerVar == -1) {
	    return;
	}
    
    var beginVar, end, routeVectorVar;
    beginVar = {
      x: 0.3+1.2*j,
      z: 0.3+1.2*i
    };

    var placeVar;
    if (playerVar == 1) {
        placeVar = this.firstEmptyPosition(this.temporaryPlace1);
        this.temporaryPlace1[placeVar] = true;
        end = {
          x: 1.3*(placeVar%7)+0.6,
          z: -1-Math.floor(placeVar/7)
        };
    } else if (playerVar == 2){
        placeVar = this.firstEmptyPosition(this.temporaryPlace2);
        this.temporaryPlace2[placeVar] = true;
        end = {
          x: 1.3*(placeVar%7)+0.6,
          z: 10.2+Math.floor(placeVar/7)
        };
    } else {
        placeVar = this.firstEmptyPosition(this.temporaryPlaceJoker);
        this.temporaryPlaceJoker[placeVar] = true;
        end = {
          x: 10.4,
          z: 1.5+1.6*placeVar
        };
    }
    
    routeVectorVar = {
        x: end.x - beginVar.x,
        z: end.z - beginVar.z
    };

    this.animationList.push({
        begin: beginVar,
        routeVector: routeVectorVar,
        player: playerVar,
        place: placeVar,
        placeBool: true,
        heigth: this.piecesHeigth,
        type: "piece"
    });
};

BoardAnimation.prototype.takeMarker = function(i,j,playerVar) {
	if (playerVar == -1) {
	    return;
	}
    
    var beginVar, end, routeVectorVar, heigthVar;
    beginVar = {
      x: 0.3+1.2*j,
      z: 0.3+1.2*i
    };
    this.boardPrev[i][j][1] = -1;

    var placeVar;
    if (playerVar == 11) {
    	this.temporaryMarker1++;
    	var position = 18-this.temporaryMarker1;
    	heigthVar = (position / 18) * Math.abs(this.piecesHeigth - this.markerHeigth) + this.markerHeigth;
        end = {
          x: 1.2*(position%8)+0.2,
          z: -3.5-1.2*Math.floor(position/8)
        };
    } else {
    	this.temporaryMarker2++;
    	var position = 18-this.temporaryMarker2;
    	heigthVar = (position / 18) * Math.abs(this.piecesHeigth - this.markerHeigth) + this.markerHeigth;
        end = {
          x: 1.2*(position%8)+0.2,
          z: 12.2+1.2*Math.floor(position/8)
        };
    }
    
    routeVectorVar = {
        x: end.x - beginVar.x,
        z: end.z - beginVar.z
    };

    this.animationList.push({
        begin: beginVar,
        routeVector: routeVectorVar,
        player: playerVar,
        heigth: heigthVar,
        action: "take",
        type: "marker"
    });
};

BoardAnimation.prototype.putMarker = function(i,j,playerVar) {
	if (playerVar == -1) {
	    return;
	}
    
    var beginVar, end, routeVectorVar;
    end = {
      x: 0.3+1.2*j,
      z: 0.3+1.2*i
    };

    var placeVar;
    if (playerVar == 11) {
    	this.board.player1MarkersOutside--;
    	this.temporaryMarker1--;
    	var position = 18 - this.board.player1MarkersOutside;
    	heigthVar = (position / 18) * Math.abs(this.piecesHeigth - this.markerHeigth) + this.markerHeigth;
        beginVar = {
          x: 1.2*(position%8)+0.2,
          z: -3.5-1.2*Math.floor(position/8)
        };
    } else {
    	this.board.player2MarkersOutside--;
    	this.temporaryMarker2--;
    	var position = 18 - this.board.player2MarkersOutside;
    	heigthVar = (position / 18) * Math.abs(this.piecesHeigth - this.markerHeigth) + this.markerHeigth;
        beginVar = {
          x: 1.2*(position%8)+0.2,
          z: 12.2+1.2*Math.floor(position/8)
        };
    }
    
    routeVectorVar = {
        x: end.x - beginVar.x,
        z: end.z - beginVar.z
    };

    this.animationList.push({
        begin: beginVar,
        routeVector: routeVectorVar,
        player: playerVar,
        action: "put",
        heigth: heigthVar,
        type: "marker"
    });
};

BoardAnimation.prototype.putPiece = function(i,j,playerVar) {
	if (playerVar == -1) {
	    return;
	}
    
    var beginVar, end, routeVectorVar;
    end = {
      x: 0.3+1.2*j,
      z: 0.3+1.2*i
    };

    var placeVar;
    if (playerVar == 1) {
        placeVar = this.firstFilledPosition(this.temporaryPlace1);
        this.board.player1PiecesOutside[placeVar] = false;
        this.temporaryPlace1[placeVar] = false;
        beginVar = {
          x: 1.3*(placeVar%7)+0.6,
          z: -1-Math.floor(placeVar/7)
        };
    } else if (playerVar == 2){
        placeVar = this.firstFilledPosition(this.temporaryPlace2);
        this.board.player2PiecesOutside[placeVar] = false;
        this.temporaryPlace2[placeVar] = false;
        beginVar = {
          x: 1.3*(placeVar%7)+0.6,
          z: 10.2+Math.floor(placeVar/7)
        };
    } else {
        placeVar = this.firstFilledPosition(this.temporaryPlaceJoker);
        this.board.jokerPiecesOutside[placeVar] = false;
        this.temporaryPlaceJoker[placeVar] = false;
        beginVar = {
          x: 10.4,
          z: 1.5+1.6*placeVar
        };
    }
    
    routeVectorVar = {
        x: end.x - beginVar.x,
        z: end.z - beginVar.z
    };

    this.animationList.push({
        begin: beginVar,
        routeVector: routeVectorVar,
        player: playerVar,
        place: placeVar,
        placeBool: false,
        heigth: this.piecesHeigth,
        type: "piece"
    });
};

BoardAnimation.prototype.firstEmptyPosition = function(vectorList) {
	for (var i = 0; i < vectorList.length; i++) {
	    if (!vectorList[i]) {
	        return i;
	    }
	}

	//console.log("Not found an empty position!!");
	return -1;
};

BoardAnimation.prototype.firstFilledPosition = function(vectorList) {
	for (var i = 0; i < vectorList.length; i++) {
	    if (vectorList[i]) {
	        return i;
	    }
	}

	//console.log("Not found a filled position!!");
	return -1;
};

BoardAnimation.prototype.drawAnimation= function() {
	if (this.animationList.length == 0) {
	    return;
	}

	var time = (this.scene.currTime - this.timeStarted) / (this.animationTimeLength * 1000);
	time /= this.animationTimeLength;

    var i = 0;
	while (i < this.animationList.length) {
	    this.scene.pushMatrix();
            this.scene.translate(this.animationList[i].begin.x,0.01,this.animationList[i].begin.z);
            this.scene.translate(this.animationList[i].routeVector.x * time, 0.01+Math.sin(Math.PI*time)*this.animationList[i].heigth, this.animationList[i].routeVector.z * time);
            if (this.animationList[i].type == "piece") {
            	if (this.animationList[i].player == 0) {
                    this.scene.piece.white.apply();
					if (time >= 1) {
						this.board.jokerPiecesOutside[this.animationList[i].place] = this.animationList[i].placeBool;
					}
                } else if (this.animationList[i].player == 1) {
                    this.scene.piece.red.apply();
					if (time >= 1) {
						this.board.player1PiecesOutside[this.animationList[i].place] = this.animationList[i].placeBool;
					}
                } else {
                    this.scene.piece.orange.apply();
					if (time >= 1) {
						this.board.player2PiecesOutside[this.animationList[i].place] = this.animationList[i].placeBool;
					}
                }
				
                this.scene.piece.display();

            } else {
            	if (this.animationList[i].action == "take") {
            		if (time >= 1) {
            			if (this.animationList[i].player == 11) {
    						this.board.player1MarkersOutside++;
            			} else {
            				this.board.player2MarkersOutside++;
            			}
					}
            	}
				if (this.animationList[i].player == 11) {
                    this.scene.markerColors.red.apply();
                } else {
                    this.scene.markerColors.orange.apply();
                }
                this.scene.marker.display();
            }

	    this.scene.popMatrix();
	    i++;
	}


	if (time >= 1) {
	    this.animationList = [];
	    if (this.normal) {
			this.board.board = this.newBoard;
	    }
	}
};