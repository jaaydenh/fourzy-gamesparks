var challengeInstanceId = Spark.data.challengeInstanceId;
var playerId = Spark.data.player;

var challenge = Spark.getChallenge(challengeInstanceId);

var playersViewedResult = [];

var players = challenge.getScriptData("playersViewedResult");    
if (players) {
    players.push(playerId);
    playersViewedResult = players;
} else {
    playersViewedResult.push(playerId);
}

challenge.setScriptData("playersViewedResult", playersViewedResult);