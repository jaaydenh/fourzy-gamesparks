var position = Spark.data.position;
var direction = Spark.data.direction;
var gameBoard = Spark.data.gameBoard;
var player1 = Spark.data.player1;
var player2 = Spark.data.player2;

var request = new SparkRequests.CreateChallengeRequest();

var test = Spark.setScriptData("position", position);

request.setScriptData("gameBoard", gameBoard);
request.setScriptData("gameBoard", gameBoard);
request.setScriptData("position", position);
request.setScriptData("direction", direction);
request.setScriptData("player", 1);

request.usersToChallenge(player2);

request.accessType = "PUBLIC";
request.autoStartJoinedChallengeOnMaxPlayers = true;
//request.challengeMessage = "";
request.challengeShortCode = "chalRanked";
//request.eligibilityCriteria = ...;
request.maxPlayers = 2;
request.minPlayers = 1;
//request.silent = false;
    
var gameEndDate = new Date(Date.now()+(1000*60*14*24));

var endDate = gameEndDate.getFullYear()+ "-" + gameEndDate.getUTCMonth() + 1 +"-"+ gameEndDate.getUTCDate() + "T" + gameEndDate.getUTCHours() +":" + gameEndDate.getUTCMinutes()+ "Z";
    
request.endTime = endDate;

// var response = request.Execute();
var response = request.ExecuteAs(player1);

var challengeInstanceId = response.challengeInstanceId; 
var scriptData = response.scriptData;
var error = response.error;