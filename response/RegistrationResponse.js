
var playerID = Spark.getData().userId;
var displayName = Spark.getData().displayName;
var userName = Spark.getPlayer().getUserName();

if(Spark.getData().newPlayer) // only save if it is a new player
{
    Spark.runtimeCollection("playerList").insert({
        "id" : playerID,
        "displayName" : displayName,
        "userName" : userName,
        "gamePieceId" : 0
    })
}