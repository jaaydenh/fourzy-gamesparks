const numColumns = 8;
const numRows = 8;
var pieceEnum = {"empty":0, "blue":1, "red":2};
var pieceTypeEnum = {};
var directionEnum = {"up":0, "down":1, "left":2, "right":3, "none":4};
var tokenEnum = {"empty":0,"up_arrow":1, "down_arrow":2, "left_arrow":3, "right_arrow":4, "sticky":5, "blocker":6, "ghost":7, "ice_sheet":8, "pit":9, "ninety_right_arrow":10, "ninety_left_arrow":11, "bumper":12, "coin":13, "fruit":14, "fruit_tree":15, "web":16, "spider":17, "sand":18, "water":19 };
var isMoveable = [0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0];
                  
var isMoveableUp = [];
var isMoveableDown = [];
var isMoveableLeft = [];
var isMoveableRight = [];
                  
//Get our challenge information so we can store ScriptData to it.
var challenge = Spark.getChallenge(Spark.data.challengeInstanceId);

// Get the game data created in ChallengeStartedMessage
var lastGameBoard = challenge.getScriptData("lastGameBoard");
var gameBoard = challenge.getScriptData("gameBoard");
var lastTokenBoardData = challenge.getScriptData("lastTokenBoard");
var tokenBoardData = challenge.getScriptData("tokenBoard");
var initialGameBoard = challenge.getScriptData("initialGameBoard");

var pieceTypeBoardData = challenge.getScriptData("pieceTypeBoard"); //NOT USED YET
//var tokenStatusBoardData = challenge.getScriptData("tokenStatusBoard"); //NOT USED YET
//var pieceStatusBoardData = challenge.getScriptData("pieceStatusBoard"); //NOT USED YET
var currentPlayerMove = challenge.getScriptData("currentPlayerMove");
var moveList = challenge.getScriptData("moveList");

var tokenBoard = [];
var pieceTypeBoard = [];
// var currentTokenBoard = [];
var activePieces = [];
var opponentPiece;
var players;
var opponentId;
var opponentPlayer;
var player = Spark.player;
// var random = 20 + parseInt(challenge.getId().substr(0, 10),16) % 20;
random = 30;

initIsMoveable();

if (currentPlayerMove === null) {
    currentPlayerMove = 1;
}

processMove();

function initIsMoveable() {
    for (var x = 0; x <= numColumns * numRows; x ++) {
        isMoveableUp.push(1);
        isMoveableDown.push(1);
        isMoveableLeft.push(1);
        isMoveableRight.push(1);
    }
}

function updateMoveablePieces() {
    for(var row = 0; row < numRows; row++) {
        for(var col = 0; col < numColumns; col++) {
            if (gameBoard[row * numRows + col] != 0) {
                if (tokenBoard[row * numRows + col].key == "sticky" || tokenBoard[row * numRows + col].key == "ice_sheet" || tokenBoard[row * numRows + col].key == "sand" || tokenBoard[row * numRows + col].key == "water")  {
                    if (canMoveInPosition(col, row, directionEnum["up"])) {
                        isMoveableUp[row * numRows + col] = 1;
                    } else {
                        isMoveableUp[row * numRows + col] = 0;
                    }
                    if (canMoveInPosition(col, row, directionEnum["down"])) {
                        isMoveableDown[row * numRows + col] = 1;
                    } else {
                        isMoveableDown[row * numRows + col] = 0;
                    }
                    if (canMoveInPosition(col, row, directionEnum["left"])) {
                        isMoveableLeft[row * numRows + col] = 1;
                    } else {
                        isMoveableLeft[row * numRows + col] = 0;
                    }
                    if (canMoveInPosition(col, row, directionEnum["right"])) {
                        isMoveableRight[row * numRows + col] = 1;
                    } else {
                        isMoveableRight[row * numRows + col] = 0;
                    }
                } else {
                    isMoveableUp[row * numRows + col] = 0;
                    isMoveableDown[row * numRows + col] = 0;
                    isMoveableLeft[row * numRows + col] = 0;
                    isMoveableRight[row * numRows + col] = 0;
                }
            }

        }
    }
}

function processMove() {
    //We create a variable to accept the attributes we pass on to our event
    var pos = Spark.data.pos;
    var direction = Spark.data.direction;
    currentPlayer = Spark.data.player;
    var col,row;
    
    var move = {
        position:pos,
        direction:direction,
        player:currentPlayer,
        timestamp: new Date()
        // pieceType:pieceType
        // tokenType
        // tokenPosition
        // Maybe orientation
    };
    
    //var moveMetaData = {
        // array of integers for tokens with random effects
        //randomActions:randomActions
    //};
    
    moveList.push(move);
    
    switch(direction) {
        case directionEnum["up"]:
            col = pos;
            row = numRows;
            break;
        case directionEnum["down"]:
            col = pos;
            row = -1;
            break;
        case directionEnum["left"]:
            col = numColumns;
            row = pos;
            break;
        case directionEnum["right"]:
            col = -1;
            row = pos;
            break;
    }
    if (tokenBoardData) {
        createTokenBoard();    
    }
    
    updateMoveablePieces();
    
    playWithTokens(col, row, direction);
}

function playWithTokens(col, row, direction) {
    var pos = getNextPosition(col, row, direction);
    if (canMoveInPosition(pos.col, pos.row, direction)) {
        var gameBoardCopy = JSON.parse(JSON.stringify(gameBoard));
        lastGameBoard = gameBoardCopy;
        
        var tokenBoardCopy = JSON.parse(JSON.stringify(tokenBoardData));
        lastTokenBoardData = tokenBoardCopy;
        // var moveList = challenge.getScriptData("moveList")
        
        // var randomMomentum = 20 + parseInt(challenge.getId().substr(0, 10),16) % 20;
        
        activePieces.push({col: col, row: row, direction: direction, player: currentPlayerMove, friction: 0, momentum: random});
        //gameBoard[pos.row * numRows + pos.col] = currentPlayerMove;
        tokenBoard[pos.row * numRows + pos.col].updateBoard(false);
        
        while (activePieces.length > 0) {
            var piece = activePieces[0];
            var nextPos = getNextPosition(piece.col, piece.row, piece.direction);

            if (canMoveInPosition(nextPos.col, nextPos.row, piece.direction)) {
                tokenBoard[nextPos.row * numRows + nextPos.col].updateBoard(true);    
            } else {
                activePieces.shift();
            }
        }
        
        for(var row = 0; row < numRows; row++) {
          for(var col = 0; col < numColumns; col++) {
            if (tokenBoard[row*numRows + col].chanceDestroyOnEnd > 0){
                if (gameBoard[row*numRows + col] >0)
                {
                    gameBoard[row*numRows + col] =0;
                    tokenBoard[row * numRows + col] = {
                    key: "empty",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                    }
                };                    
                }
            }
         
          }
        }
        
        
        //We update and save our gameBoard
        challenge.setScriptData("moveList", moveList);
        challenge.setScriptData("gameBoard", gameBoard);
        challenge.setScriptData("lastGameBoard", lastGameBoard);
        challenge.setScriptData("tokenBoard", tokenBoardData);
        challenge.setScriptData("lastTokenBoard", lastTokenBoardData);
        challenge.setScriptData("initialGameBoard", initialGameBoard);
        
        opponentPiece = currentPlayerMove == 1 ? 2 : 1;
        var isGameOver = false;
        var didPlayer1Win = false;
        
        //Check to see if we've won
        if(didCurrentPlayerWin(currentPlayerMove)){
            isGameOver = true;
            didPlayer1Win = true;
            //If we have won, save the winner's name to ScriptData so we can easily reference 
            //it when searching for "COMPLETED" games
            challenge.setScriptData("winnerName", Spark.player.displayName);
            challenge.setScriptData("winner", Spark.player.displayName);
            challenge.setScriptData("winnerId", Spark.getPlayer().getPlayerId());
       
            //Set this challenge instance to won and which player won it.
            challenge.winChallenge(Spark.player);
        }
            
        if(didCurrentPlayerWin(opponentPiece)) {
                isGameOver = true;

                if (didPlayer1Win) {
                    //Save the "winner" as draw, so we can easily reference it when
                    //search for "COMPLETED" games
                    challenge.setScriptData("winner", "Draw");
       
                    //End the challenge with draw
                    challenge.drawChallenge();
                } else {
                    players = challenge.getAcceptedPlayerIds();
                    if(Spark.getPlayer().getPlayerId() !== players[0])
                    {
                        opponentId = players[0];
                    } else {
                        opponentId = players[1];
                    }

                    opponentPlayer = Spark.loadPlayer(opponentId);
                    
                    //If we have won, save the winner's name to ScriptData so we can easily reference 
                    //it when searching for "COMPLETED" games
                    challenge.setScriptData("winnerName", opponentPlayer.displayName);
                    challenge.setScriptData("winner", opponentPlayer.displayName);
                    challenge.setScriptData("winnerId", opponentId);
       
                    //Set this challenge instance to won and which player won it.
                    challenge.winChallenge(opponentPlayer);
                }
            
        }
        
        if(!isGameOver && checkDraw2())
        {
            //Save the "winner" as draw, so we can easily reference it when
            //search for "COMPLETED" games
            challenge.setScriptData("winner", "Draw");
       
            //End the challenge with draw
            challenge.drawChallenge();
        }

    } else {
        // show user facing error and dont consume player turn
        Spark.setScriptError("error", "error during takeTurn function because intended move is not possible");
        Spark.exit();
    }
}

function createTokenBoard() {
    for (var x = 0; x <= numColumns * numRows; x ++) {
        switch(tokenBoardData[x]) {
            case tokenEnum["empty"]:
                tokenBoard.push({
                    key: "empty",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                    }
                });
                break;
            case tokenEnum["up_arrow"]:
                tokenBoard.push({
                    key: "up_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }


                            activePieces[0].col = nextPos.col;
                            activePieces[0].row = nextPos.row;

                        activePieces[0].direction = directionEnum["up"];
                    }
                });
                break;
            case tokenEnum["down_arrow"]:
                tokenBoard.push({
                    key: "down_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                            activePieces[0].col = nextPos.col;
                            activePieces[0].row = nextPos.row;

                        activePieces[0].direction = directionEnum["down"];
                    }
                });
                break;
            case tokenEnum["left_arrow"]:
                tokenBoard.push({
                    key: "left_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                            activePieces[0].col = nextPos.col;
                            activePieces[0].row = nextPos.row;

                        activePieces[0].direction = directionEnum["left"];
                    }
                });
                break;
            case tokenEnum["right_arrow"]:
                tokenBoard.push({
                    key: "right_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                            activePieces[0].col = nextPos.col;
                            activePieces[0].row = nextPos.row;

                        activePieces[0].direction = directionEnum["right"];
                    }
                });
                break;
            case tokenEnum["sticky"]:
                tokenBoard.push({
                    key: "sticky",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: true,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (gameBoard[nextPos.row * numRows + nextPos.col] != 0) {
                            var player = gameBoard[nextPos.row * numRows + nextPos.col];
                            activePieces.push({col: nextPos.col, row: nextPos.row, direction: piece.direction, player: player, friction: 0, momentum: random});
                        }
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        activePieces.splice(0, 1);
                    }
                });
                break;
            case tokenEnum["ice_sheet"]:
                tokenBoard.push({
                    key: "ice_sheet",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: true,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        var pieceInSquare = false;
                        activePieces[0].momentum--;
                        
                        if (gameBoard[nextPos.row * numRows + nextPos.col] != 0) {
                            pieceInSquare = true;
                            var player = gameBoard[nextPos.row * numRows + nextPos.col];
                            activePieces.push({col: nextPos.col, row: nextPos.row, direction: piece.direction, player: player, friction: 0, momentum: random});
                        }
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        if (pieceInSquare) {
                            activePieces.splice(0, 1);
                        }
                    }
                });
                break;
            case tokenEnum["blocker"]:
                tokenBoard.push({
                    key: "blocker",
                    canPassThrough: false,
                    canStopOn: false,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {

                    }
                });
                break;
            case tokenEnum["ghost"]:
                tokenBoard.push({
                    key: "ghost",
                    canPassThrough: true,
                    canStopOn: false,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);

                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                    }
                });
                break;
            case tokenEnum["pit"]:
                tokenBoard.push({
                    key: "pit",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    chanceDestroyOnEnd: 1.0,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);

                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        //gameBoard[nextPos.row * numRows + nextPos.col] = 0;
                        
                        //activePieces.splice(0, 1);
                        
                        // lastTokenBoardData = tokenBoardData.slice(0);
                        //tokenBoardData[nextPos.row * numRows + nextPos.col] = 0;
                    
                    }
                });
                break;
            case tokenEnum["ninety_right_arrow"]:
                tokenBoard.push({
                    key: "ninety_right_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;

                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        
                        if (activePieces[0].direction == directionEnum["up"]) {
                            activePieces[0].direction = directionEnum["right"];
                        } else if (activePieces[0].direction == directionEnum["down"]) {
                            activePieces[0].direction = directionEnum["left"];
                        } else if (activePieces[0].direction == directionEnum["left"]) {
                            activePieces[0].direction = directionEnum["up"];
                        } else if (activePieces[0].direction == directionEnum["right"]) {
                            activePieces[0].direction = directionEnum["down"];
                        }
                    }
                });
                break;
            case tokenEnum["ninety_left_arrow"]:
                tokenBoard.push({
                    key: "ninety_left_arrow",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }

                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        
                        if (activePieces[0].direction == directionEnum["up"]) {
                            activePieces[0].direction = directionEnum["left"];
                        } else if (activePieces[0].direction == directionEnum["down"]) {
                            activePieces[0].direction = directionEnum["right"];
                        } else if (activePieces[0].direction == directionEnum["left"]) {
                            activePieces[0].direction = directionEnum["down"];
                        } else if (activePieces[0].direction == directionEnum["right"]) {
                            activePieces[0].direction = directionEnum["up"];
                        }
                    }
                });
                break;
            case tokenEnum["bumper"]:
                tokenBoard.push({
                    key: "bumper",
                    canPassThrough: false,
                    canStopOn: false,
                    isMoveable: false,
                    canEvaluateWithoutEntering: true,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        
                        if (activePieces[0].direction == directionEnum["up"]) {
                            activePieces[0].direction = directionEnum["down"];
                        } else if (activePieces[0].direction == directionEnum["down"]) {
                            activePieces[0].direction = directionEnum["up"];
                        } else if (activePieces[0].direction == directionEnum["left"]) {
                            activePieces[0].direction = directionEnum["right"];
                        } else if (activePieces[0].direction == directionEnum["right"]) {
                            activePieces[0].direction = directionEnum["left"];
                        }
                    }
                });
                break;
            case tokenEnum["fruit"]:
                tokenBoard.push({
                    key: "fruit",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: false,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        activePieces[0].momentum--;
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        lastTokenBoardData = tokenBoardData.slice(0);
                        tokenBoardData[nextPos.row * numRows + nextPos.col] = 5;
                        // CreateStickyToken(nextPos.row, nextPos.col);
                        
                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                    }
                });
                break;
            case tokenEnum["sand"]:
                tokenBoard.push({
                    key: "sand",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: true,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        var pieceInSquare = false;
                        activePieces[0].momentum--;
                        
                        if (gameBoard[nextPos.row * numRows + nextPos.col] != 0) {
                            pieceInSquare = true;
                            var player = gameBoard[nextPos.row * numRows + nextPos.col];
                            activePieces.push({col: nextPos.col, row: nextPos.row, direction: piece.direction, player: player, friction: 0, momentum: random});
                        }
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        activePieces[0].friction += 0.5;
                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        if (pieceInSquare || activePieces[0].friction >= 1) {
                            activePieces.splice(0, 1);
                        }
                    }
                });
                break;
            case tokenEnum["water"]:
                tokenBoard.push({
                    key: "water",
                    canPassThrough: true,
                    canStopOn: true,
                    isMoveable: true,
                    canEvaluateWithoutEntering: false,
                    updateBoard: function(swapPiece) {
                        var piece = activePieces[0];
                        var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
                        // var pieceInSquare = false;
                        activePieces[0].momentum--;
                        
                        if (gameBoard[nextPos.row * numRows + nextPos.col] != 0) {
                            // pieceInSquare = true;
                            var player = gameBoard[nextPos.row * numRows + nextPos.col];
                            activePieces.push({col: nextPos.col, row: nextPos.row, direction: piece.direction, player: player, friction: 0, momentum: 1});
                        }
                        
                        if (piece.player != 0 ) {
                            gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                            piece.player = 0;
                        } else {
                            if (swapPiece) {
                                swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                            }
                        }
                        
                        activePieces[0].col = nextPos.col;
                        activePieces[0].row = nextPos.row;
                        // if (pieceInSquare) {
                            activePieces.splice(0, 1);
                        // }
                    }
                });
                break;
        }
    }
}

function CreateStickyToken(row, col) {
    tokenBoard[row * numRows + col] = {
        key: "sticky",
        canPassThrough: true,
        canStopOn: true,
        isMoveable: true,
        canEvaluateWithoutEntering: false,
        updateBoard: function(swapPiece) {
            var piece = activePieces[0];
            var nextPos = getNextPosition(piece.col, piece.row, piece.direction);
            activePieces[0].momentum--;
            
            if (gameBoard[nextPos.row * numRows + nextPos.col] != 0) {
                var player = gameBoard[nextPos.row * numRows + nextPos.col];
                activePieces.push({col: nextPos.col, row: nextPos.row, direction: piece.direction, player: player, friction: 0, momentum: random});
                }
                        
                if (piece.player != 0 ) {
                    gameBoard[nextPos.row * numRows + nextPos.col] = piece.player;
                    piece.player = 0;
                } else {
                    if (swapPiece) {
                        swapPiecePosition({column:piece.col, row:piece.row}, {column: nextPos.col, row:nextPos.row});    
                    }
                }

                activePieces[0].col = nextPos.col;
                activePieces[0].row = nextPos.row;
                activePieces.splice(0, 1);
            }
        };
}

// Layout of gameboard
// 00  08  16  24  32  40  48  56 
// 01  09  17  25  33  41  49  57
// 02  10  18  26  34  42  50  58
// 03  11  19  27  35  43  51  59
// 04  12  20  28  36  44  52  60
// 05  13  21  29  37  45  53  61
// 06  14  22  30  38  46  54  62
// 07  15  23  31  39  47  55  63

function squaresMatchPiece(piece, col, row, moveX, moveY) {
	// bail out eary if we can't win from here
	if (row + (moveX * 3) < 0) { return false; }
    if (row + (moveX * 3) >= numRows) { return false; }
    if (col + (moveY * 3) < 0) { return false; }
    if (col + (moveY * 3) >= numColumns) { return false; }
		
    // still here? Check every square
    var boardPosition = row * numRows + col;
    if (gameBoard[boardPosition] != piece) { return false; }
    if (gameBoard[boardPosition + (moveX * numRows) + moveY] != piece) { return false; }
    if (gameBoard[boardPosition + ((moveX * 2) * numRows) + (moveY * 2)] != piece) { return false; }
    if (gameBoard[boardPosition + ((moveX * 3) * numRows) + (moveY * 3)] != piece) { return false; }
		
    return true;
}

function didCurrentPlayerWin(currentPlayer) {
    for(var row = 0; row < numRows; row++)
    {
        for(var col = 0; col < numColumns; col++)
        {
            if (squaresMatchPiece(currentPlayer, col, row, 1, 0)) {
                return true;
            } else if (squaresMatchPiece(currentPlayer, col, row, 0, 1)) {
                return true;
            } else if (squaresMatchPiece(currentPlayer, col, row, 1, 1)) {
                return true;
            } else if (squaresMatchPiece(currentPlayer, col, row, 1, -1)) {
                return true;
            }
        }
    }
	return false;
}

function updateWinCounter(row, col, player, wins)
{
    var winCounter = wins
    if (gameBoard[row * numRows + col] != 0) {
        if (gameBoard[row * numRows + col] == player) {
            winCounter++;
        } else {
            winCounter = 0;
        }
    } else {
        winCounter = 0;
    }

    return winCounter;
}

//Check if no space is empty
function checkDraw()
{
   for(i=0; i<64; i++)
   {
       if(gameBoard[i]==0)
       {
        return false;   
       }
   }
   
   return true;
}

function checkDraw2()
{
    for(var col = 0; col < numColumns; col++)
    {
        if (canMoveInPosition(col, 0, directionEnum["down"]))
        {
            return false;
        }
            
        if (canMoveInPosition(col, numRows - 1, directionEnum["up"]))
        {
            return false;
        }
    }
        
    for(var row = 0; row < numRows; row++)
    {
        if (canMoveInPosition(0, row, directionEnum["right"]))
        {
            return false;
        }
            
        if (canMoveInPosition(numColumns - 1, row, directionEnum["left"]))
        {
            return false;
        }
    }
    
    return true;
}

function canMoveInPosition(col, row, direction) {
    // if the next end position is outside of the board then return false;
    if (col >= numColumns || col < 0 || row >= numRows || row < 0) {
        return false;
    }

    var nextPos = getNextPosition(col, row, direction);
    
    // check for piece at end position if there is a piece and the piece is not moveable then return false
    if (this.gameBoard[row * numRows + col] != 0) {
        // if the piece is moveable then call CanMoveInPosition with the new start and end positions
        switch(direction) {
            case directionEnum["up"]:
                if (isMoveableUp[row * numRows + col] == 0) {
                    return false;
                }
                break;
            case directionEnum["down"]:
                if (isMoveableDown[row * numRows + col] == 0) {
                    return false;
                }
                break;
            case directionEnum["left"]:
                if (isMoveableLeft[row * numRows + col] == 0) {
                    return false;
                }
                break;
            case directionEnum["right"]:
                if (isMoveableRight[row * numRows + col] == 0) {
                    return false;
                }
                break;
        } 
        
        return canMoveInPosition(nextPos.col, nextPos.row, direction);
        
        // if (isMoveable[row * numRows + col] == 0) {
        //     return false;
        // } else {
        //     var nextPos = getNextPosition(col, row, direction);
        //     return canMoveInPosition(nextPos.col, nextPos.row, direction);
        // }
    }
    
    if (tokenBoard[row * numRows + col].canEvaluateWithoutEntering) {
        return true;
    }
    
    // if there is a token at the end position and canPassThrough is true then true
    // MUST CHECK FOR canPassThrough before checking canStopOn
    if (!tokenBoard[row * numRows + col].canPassThrough) {
        return false;
    }
    
    
    if (activePieces.length > 0) {
        if (activePieces[0].momentum <= 0) {
            return false;
        }
    }
    
    // if there is a token at the end position and canStopOn is false then check if the piece can move
    // to the next position, if not then return false
    if (!tokenBoard[row * numRows + col].canStopOn) {
        return canMoveInPosition(nextPos.col, nextPos.row, direction);
    }

    return true;
}

function swapPiecePosition(oldPos, newPos) {
    var oldPiece = gameBoard[oldPos.row * numRows + oldPos.column];
    gameBoard[oldPos.row * numRows + oldPos.column] = 0;
    gameBoard[newPos.row * numRows + newPos.column] = oldPiece;
}
        
function getNextPosition(col, row, direction) {
    var nextPos = {col: col, row: row};
    switch(direction) {
        case directionEnum["up"]:
            nextPos.row -= 1;
            break;
        case directionEnum["down"]:
            nextPos.row += 1;
            break;
        case directionEnum["left"]:
            nextPos.col -= 1;
            break;
        case directionEnum["right"]:
            nextPos.col += 1;
            break;
    }
    return nextPos;
}

// var emptyTokenProperties = { 
// 	canPassThrough: true, 
// 	actions: { 
// 		details: function() {
// 			return "I am " + this.age() + " years old.";
// 		},

		
// 		updateBoard: (function(gameboard) {
// 			var newGameBoard = gameboard,
// 				today = new Date(),
// 				ms = today.valueOf() - dob.valueOf(),

// 				minutes = ms / 1000 / 60,
// 				hours = minutes / 60,

// 				days = hours / 24,
// 				years = days / 365,

// 				updateBoard = newGameBoard;					
// 			return function() {
// 				return updateBoard;
// 			};
// 		})([])
// 	}
// };

// 1. Check if piece can move using the next position of the piece and its direction 
//    and if the square can be moved through, if the piece cannot move into the first position, then
//    cancel the move, if the piece can move into subsequent square then update the board state.
// 2. For each active piece, Check for token in the next position and update the board state and 
//    piece position and direction based on the logic of the token.

function EmptyToken(row, col, config) {
	// Pass in the methods we are expecting, 
	// followed by the name of the Interface instance that we're checking against
	//Interface.ensureImplements(config.actions, test);
 
	this.row = row;
	this.col = col;
	this.canPassThrough = config.canPassThrough;
	this.methods = config.actions;
}