var challengedPlayer = Spark.runtimeCollection("playerList").findOne({ "id" : Spark.getPlayer().getPlayerId() });
var challengedGamePieceId = "0";

if (challengedPlayer !== null) {
    // challengedGamePieceId = challengedPlayer.gamePieceId;
    if (challengedPlayer.gamePieceId !== null) {
        challengedGamePieceId = challengedPlayer.gamePieceId;
    }
}

// Spark.setScriptData("challengedGamePieceId", challengedGamePieceId);

//Load the challenge, you'll be able to get the challenge ID because we've just created it
var challengeInstanceId = Spark.getData().challengeInstanceId;
var currentChallenge = Spark.getChallenge(challengeInstanceId);

currentChallenge.setScriptData("challengedGamePieceId", challengedGamePieceId);

// var playerEloRating = Spark.getPlayer().getScriptData("ratingElo");
// currentChallenge.setScriptData("challengedPlayerRating", playerEloRating);