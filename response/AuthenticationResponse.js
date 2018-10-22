var newPlayer = Spark.data.newPlayer;
if (newPlayer === true) {
    Spark.getPlayer().setScriptData("rating", 0);
    Spark.getPlayer().setScriptData("ratingDeviation", 350);
    Spark.getPlayer().setScriptData("volitility", 0.06);
    Spark.getPlayer().setScriptData("ratingElo", 0);
    Spark.getPlayer().setScriptData("gems", 0);
    Spark.getPlayer().setScriptData("coins", 0);
    Spark.getPlayer().setScriptData("wins", 0);
    Spark.getPlayer().setScriptData("losses", 0);
    Spark.getPlayer().setScriptData("tournamentWins", 0);
    Spark.getPlayer().setScriptData("tournamentLosses", 0);
    Spark.getPlayer().setScriptData("gamesStarted", 0);
    // Spark.getPlayer().setScriptData("gamePieceId", 0);
} else {
    
    var playerID = Spark.getData().userId;
    var displayName = Spark.getData().displayName;
    var userName = Spark.getPlayer().getUserName();

    var results = Spark.runtimeCollection('playerList').find({"id" : playerID});

    if(results.count() == 0) // add entry in the playerList if the player is not already there
    {
        Spark.runtimeCollection("playerList").insert({
            "id" : playerID,
            "displayName" : displayName,
            "userName" : userName,
            "gamePieceId" : "0"
        })
    }

    var rating = Spark.getPlayer().getScriptData("rating");
    var ratingDeviation = Spark.getPlayer().getScriptData("ratingDeviation");
    
    var ratingElo = Spark.getPlayer().getScriptData("ratingElo");
    
    var tournamentWins = Spark.getPlayer().getScriptData("tournamentWins");
    var tournamentLosses = Spark.getPlayer().getScriptData("tournamentLosses");
    var gamesStarted = Spark.getPlayer().getScriptData("gamesStarted");
    // var gamePieceId = Spark.getPlayer().getScriptData("gamePieceId");
    
    // var request = new SparkRequests.LogEventRequest();
    // request.eventKey = "submitPlayerWin";
    // request.wins = wins;
    // var response = request.Send();
    
    // var request = new SparkRequests.LogEventRequest();
    // request.eventKey = "submitPlayerLoss";
    // request.losses = losses;
    // var response = request.Send();
    
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitTournamentWin";
    request.wins = tournamentWins;
    var response = request.Send();
    
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitTournamentLoss";
    request.losses = tournamentLosses;
    var response = request.Send();
    
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitPlayerRating";
    request.playerRating = rating;
    var response = request.Send();
    
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitPlayerRatingDeviation";
    request.playerRatingDeviation = ratingDeviation;
    var response = request.Send();
}