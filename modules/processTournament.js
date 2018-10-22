var wins = Spark.getPlayer().getScriptData("tournamentWins");
var losses = Spark.getPlayer().getScriptData("tournamentLosses");

if (outcome === "victory") {
    wins++;
    Spark.getPlayer().setScriptData("tournamentWins", wins);
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitTournamentWin";
    request.wins = wins;
    var response = request.Send();
} else {
    losses++;
    Spark.getPlayer().setScriptData("tournamentLosses", losses);
    var request = new SparkRequests.LogEventRequest();
    request.eventKey = "submitTournamentLoss";
    request.losses = losses;
    var response = request.Send();
}