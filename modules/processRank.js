// var currentRank = Spark.getPlayer().getScriptData("rating");

// if (outcome === "victory") {
//     //Because the player just won, increase the rank
//     currentRank = currentRank + 2;
//     Spark.getPlayer().setScriptData("rating", currentRank);
// } else {
//     if (currentRank > 0) {
//         //Because the player just lost, decrease the rank
//         currentRank--;
//         Spark.getPlayer().setScriptData("rating", currentRank);
//     }
// }

// var request = new SparkRequests.LogEventRequest();
// request.eventKey = "submitPlayerRating";
// request.playerRating = currentRank;
// var response = request.Send();