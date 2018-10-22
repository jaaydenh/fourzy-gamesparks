var wins = Spark.getPlayer().getScriptData("wins");
var losses = Spark.getPlayer().getScriptData("losses");
var playerId = Spark.getPlayer().getPlayerId();
var challengeId = Spark.getData().challenge.challengeId;
var gameBoard = Spark.getChallenge(challengeId).getScriptData("gameBoard");
//var currentChallenge = Spark.getChallenge(challengeId);
var challengerId = Spark.getChallenge(challengeId).getChallengerId();

var player = 0;
if(Spark.getPlayer().getPlayerId() === challengerId) {
    player = 1;
} else {
    player = 2;
}

var pieceCount = 0;

for (i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === player) {
        pieceCount++;
    }
}
var coinsEarned = 0;
if (outcome === "victory") {
    wins++;
    coinsEarned = 25 + pieceCount;
    Spark.getPlayer().credit1(coinsEarned);
    Spark.getPlayer().setScriptData("wins", wins);
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitPlayerWin";
    request.wins = 1;
    var response = request.Send();
} else {
    losses++;
    coinsEarned = pieceCount;
    Spark.getPlayer().credit1(coinsEarned);
    Spark.getPlayer().setScriptData("losses", losses);
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitPlayerLoss";
    request.losses = 1;
    var response = request.Send();
}

var coinsEarnedrequest = new SparkRequests.LogEventRequest();
coinsEarnedrequest.eventKey = "submitCoinsEarned";
coinsEarnedrequest.coins = coinsEarned;
var response = coinsEarnedrequest.Send();

var gamesCompleted = wins + losses;
var request = new SparkRequests.LogEventRequest();
request.eventKey = "submitPlayerCompletedGame";
request.gamesCompleted = 1;
var response = request.Send();