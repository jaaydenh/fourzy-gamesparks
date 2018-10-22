var challengeShortCode = Spark.getData().challengeShortCode;

var position = Spark.getData().position;

var directionTest = Spark.getData().direction;
var playerTest = Spark.getData().player;
var board = Spark.getData().gameBoard;
Spark.getLog().debug(Spark.getData().gameBoard);

var gameBoard = Spark.data.scriptData.gameBoard;
// var lastGameBoard = Spark.data.scriptData.lastGameBoard;
var tokenBoard = Spark.data.scriptData.tokenBoard;
var lastTokenBoard = Spark.data.scriptData.lastTokenBoard;
var initialGameBoard = Spark.data.scriptData.initialGameBoard;

var tokenBoardId = Spark.data.scriptData.tokenBoardId;
var tokenBoardName = Spark.data.scriptData.tokenBoardName;
var opponentId = Spark.data.scriptData.opponentId;

var moveList = [];
var pos = Spark.data.scriptData.position;
var direction = Spark.data.scriptData.direction;
var player = Spark.data.scriptData.player;

var move = {
    position:pos,
    direction:direction,
    player:player,
    timestamp:new Date()
};
moveList.push(move);

// var challengerGamePieceId = Spark.getPlayer().getScriptData("gamePieceId");
// if (challengerGamePieceId === null) {
//     challengerGamePieceId = 0;
// }
// var playerRecord = Spark.runtimeCollection("playerList").findOne({ "id" : Spark.getPlayer().getPlayerId() });

var challengerPlayer = Spark.runtimeCollection("playerList").findOne({ "id" : Spark.getPlayer().getPlayerId() });
var challengerGamePieceId = "0";
if (challengerPlayer !== null) {
    challengerGamePieceId = challengerPlayer.gamePieceId;
    
    if (typeof challengerGamePieceId === 'undefined') {
        challengerGamePieceId = "0";
    }
}

var challengedGamePieceId;
if (typeof opponentId !== 'undefined') {
    challengedGamePieceId = Spark.runtimeCollection("playerList").findOne({ "id" : opponentId }).gamePieceId;
    if (typeof challengedGamePieceId === 'undefined') {
        challengedGamePieceId = "0";
    }
}

Spark.setScriptData("gameBoard", gameBoard);
Spark.setScriptData("lastGameBoard", initialGameBoard);
Spark.setScriptData("tokenBoard", tokenBoard);
Spark.setScriptData("lastTokenBoard", lastTokenBoard);
Spark.setScriptData("initialGameBoard", initialGameBoard);
Spark.setScriptData("tokenBoardId", tokenBoardId);
Spark.setScriptData("tokenBoardName", tokenBoardName);
Spark.setScriptData("moveList", moveList);
Spark.setScriptData("currentPlayerMove", 2);
Spark.setScriptData("challengerGamePieceId", challengerGamePieceId);
Spark.setScriptData("challengedGamePieceId", challengedGamePieceId);