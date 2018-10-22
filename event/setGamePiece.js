var gamePieceId = Spark.data.gamePieceId;
var playerID = Spark.getPlayer().getPlayerId();
var displayName = Spark.getData().displayName;
var userName = Spark.getPlayer().getUserName();
    
var success = Spark.runtimeCollection('playerList').update({"id" : playerID}, { $set: {"gamePieceId" : gamePieceId}});