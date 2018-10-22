var challengeID = Spark.data.challengeId;
var challenge = Spark.getChallenge(challengeID)
var playerID = Spark.getPlayer().getPlayerId();
var challengerId = challenge.getChallengerId();
var challengedId = challenge.getChallengedPlayerIds()[0];

if (playerID === challengerId) {
    var ratingDelta = challenge.getScriptData("challengerRatingDelta");
    Spark.setScriptData("ratingDelta", ratingDelta);
} else if (playerID === challengedId) {
    var ratingDelta = challenge.getScriptData("challengedRatingDelta");
    Spark.setScriptData("ratingDelta", ratingDelta);
} else {
    Spark.setScriptData("ratingDelta", 0);
}

// var opponentID = Spark.data.opponentId;
// var gameResult = parseFloat(Spark.data.gameResult);

// if ([0, 0.5, 1].indexOf(gameResult) !== -1) {
//     var player = Spark.getPlayer();
//     var playerRatingElo = player.getScriptData("ratingElo");
//     var opponentPlayer = Spark.loadPlayer(opponentID);
//     var opponentRatingElo = opponentPlayer.getScriptData("ratingElo");
    
//     var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRatingElo - playerRatingElo) / 400));

//     var ratingDelta = Math.floor(60 * (gameResult - myChanceToWin));

//     Spark.setScriptData("ratingDelta", ratingDelta);
// } else {
//     Spark.setScriptData("ratingDelta", 0);
// }

