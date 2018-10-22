var playerID = Spark.getPlayer().getPlayerId();

var results = Spark.runtimeCollection('playerList').find({"id" : playerID});

if(results.count() > 0)
{
    var player = results.next();
    Spark.setScriptData("gamePieceId", player.gamePieceId);
} else {
    
}

