//If our match is ranked
// if (Spark.getData().matchShortCode === "matchRanked")
// {
//     //If the first participant
//     if(Spark.getPlayer().getPlayerId() === Spark.getData().participants[0].id){

//         //Create a challenge request
//         var request = new SparkRequests.CreateChallengeRequest();

//         request.accessType = "PRIVATE";
//         request.challengeShortCode = "chalRanked";
//         request.endTime = "2018-02-23T13:47Z";
//         // 	request.autoStartJoinedChallengeOnMaxPlayers = true;
//         // 	request.eligibilityCriteria = ...;
//         // 	request.maxPlayers = 2;
//         // 	request.minPlayers = 1;
//         //  request.challengeMessage = "";
//         //  request.silent = false;
//         var gameEndDate = new Date(Date.now()+(1000*60*14*24));
//         var endDate = gameEndDate.getFullYear()+ "-" + gameEndDate.getUTCMonth() + 1 +"-"+ gameEndDate.getUTCDate() + "T" + gameEndDate.getUTCHours() +":" + gameEndDate.getUTCMinutes()+ "Z";
//         request.endTime = endDate;
        
//         //request.expiryTime = "2018-02-23T12:47Z";
//         request.usersToChallenge = [Spark.getData().participants[1].id];

//         //Send the request
//         request.Send();
//     }
// }