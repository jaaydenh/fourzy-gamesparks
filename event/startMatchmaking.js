var matchshortCode = Spark.getData().matchShortCode;

//If shortCode is equal to 'matchRanked' send a matchmakingRequest for a ranked match
if (matchshortCode === "matchRanked"){
    //Create the request
    var matchRequest = new SparkRequests.MatchmakingRequest();

    //Assign shortCode and skill based on player rank
    matchRequest.matchShortCode = matchshortCode;
    matchRequest.skill = Spark.getPlayer().getScriptData("rating");

    matchRequest.Send();
}