var challenge = Spark.getChallenge(Spark.data.challenge.challengeId);

challenge.setScriptData("isVisible", true);

var gameBoardData = challenge.getScriptData("gameBoard");
var tokenBoardData = challenge.getScriptData("tokenBoard");
var lastTokenBoardData = challenge.getScriptData("lastTokenBoard");
var moveListData = challenge.getScriptData("moveList");
var lastGameBoardData = challenge.getScriptData("lastGameBoard");
// var lastGameBoardData = gameBoardData;
var initialGameBoardData = challenge.getScriptData("initialGameBoard");
var currentPlayerMoveData = challenge.getScriptData("currentPlayerMove");
var pieceTypeBoardData = challenge.getScriptData("pieceTypeBoard");
var gameBoard;
var tokenBoard;
var lastTokenBoard;
var initialGameBoard;
var moveList;
var lastGameBoard;
var currentPlayerMove;
var pieceTypeBoard;

if (gameBoardData === null) {
    gameBoard = [0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0,
                 0,0,0,0,0,0,0,0];
                 
    //We save our board to this challenge instance with a key value pair.
    challenge.setScriptData("gameBoard", gameBoard);
}

if (tokenBoardData === null) {
    tokenBoard = [0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0];
                 
    //We save our board to this challenge instance with a key value pair.
    challenge.setScriptData("tokenBoard", tokenBoard);
}

if (lastTokenBoardData === null) {
    lastTokenBoard = [0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0];
                 
    //We save our board to this challenge instance with a key value pair.
    challenge.setScriptData("lastTokenBoard", lastTokenBoard);
}

if (initialGameBoardData === null) {
    initialGameBoard = [0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0,
                      0,0,0,0,0,0,0,0];
                 
    //We save our board to this challenge instance with a key value pair.
    challenge.setScriptData("initialGameBoard", initialGameBoard);
}

if (pieceTypeBoardData === null) {
    pieceTypeBoard = [0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0,
                  0,0,0,0,0,0,0,0];
                 
    //We save our board to this challenge instance with a key value pair.
    challenge.setScriptData("pieceTypeBoard", pieceTypeBoard);
}

if (moveListData === null) {
    moveList = [];
    challenge.setScriptData("moveList", moveList);
}

if (lastGameBoardData === null) {
    lastGameBoard = [0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0,
                     0,0,0,0,0,0,0,0];
                 
    challenge.setScriptData("lastGameBoard", lastGameBoard);
}

if (currentPlayerMoveData === null) {
    currentPlayerMove = 2;
    challenge.setScriptData("currentPlayerMove", currentPlayerMove);
}

var nextPlayer = Spark.getData().challenge.nextPlayer;
var challengerId = challenge.getChallengerId();
if (challengerId == nextPlayer) {
    var result = challenge.consumeTurn(nextPlayer);
}