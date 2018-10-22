var chalData = Spark.getData();

//New request to join the challenge automatically
var request = new SparkRequests.AcceptChallengeRequest();

//Retrieve the challenge ID to use it in the AcceptChallenge request
request.challengeInstanceId = chalData.challenge.challengeId;
request.message = "Joining";

//Send the request as the player receiving this message
request.SendAs(chalData.challenge.challenged[0].id);