// ====================================================================================================
//
// Cloud Code for ChallengeTurnTakenMessage, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

var nextPlayer = Spark.getData().challenge.nextPlayer;

var challenger = Spark.getData().challenge.challenger;

var challenged = Spark.getData().challenge.challenged;

//var challengeId = Spark.getData().challengeId;
//var challengeId1 = Spark.data.challenge.challengeId;
var challengeId = Spark.getData().challenge.challengeId;
//var challengeid = Spark.getData().challenge.challengeInstanceId;
//var challengetest = Spark.getChallenge(Spark.data.challengeInstanceId);

if (nextPlayer === challenger.id) {
    Spark.getChallenge(challengeId).setScriptData("currentPlayerMove", 1);
} else if (nextPlayer === challenged[0].id) {
    Spark.getChallenge(challengeId).setScriptData("currentPlayerMove", 2);
}
