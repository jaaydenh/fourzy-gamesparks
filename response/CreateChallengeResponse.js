var gameBoard = Spark.getScriptData("gameBoard");
// var lastGameBoard = Spark.getScriptData("lastGameBoard");
var tokenBoard = Spark.getScriptData("tokenBoard");
var lastTokenBoard = Spark.getScriptData("lastTokenBoard");
var initialGameBoard = Spark.getScriptData("initialGameBoard");
var tokenBoardId = Spark.getScriptData("tokenBoardId");
var tokenBoardName = Spark.getScriptData("tokenBoardName");
var moveList = Spark.getScriptData("moveList");
var currentPlayerMove = Spark.getScriptData("currentPlayerMove");
var challengerGamePieceId = Spark.getScriptData("challengerGamePieceId");
var challengedGamePieceId = Spark.getScriptData("challengedGamePieceId");

//Load the challenge, you'll be able to get the challenge ID because we've just created it
var challengeInstanceId = Spark.getData().challengeInstanceId;
var currentChallenge = Spark.getChallenge(challengeInstanceId);

//Set scriptData
currentChallenge.setScriptData("gameBoard", gameBoard);
currentChallenge.setScriptData("lastGameBoard", initialGameBoard);
currentChallenge.setScriptData("tokenBoard", tokenBoard);
currentChallenge.setScriptData("lastTokenBoard", lastTokenBoard);
currentChallenge.setScriptData("initialGameBoard", initialGameBoard);
currentChallenge.setScriptData("tokenBoardId", tokenBoardId);
currentChallenge.setScriptData("tokenBoardName", tokenBoardName);
currentChallenge.setScriptData("moveList", moveList);
currentChallenge.setScriptData("currentPlayerMove", currentPlayerMove);
currentChallenge.setScriptData("challengerGamePieceId", challengerGamePieceId);
currentChallenge.setScriptData("challengedGamePieceId", challengedGamePieceId);