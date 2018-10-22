// //get the array of challengeIntances from the response

// var challenges = Spark.getData().challengeInstances;
// //var challenges = Spark.getScriptData("challengeInstances");

// if (challenges) {

// 	//an array to parse our challengeId's into
// 	var challengeInstanceId = []; 

// 	//for every object in the challenges array, get the challengeId field and push to challengeInstanceId[]
// 	for(instanceId in challenges )
// 	{
// 	    challengeInstanceId.push(challenges[instanceId].challengeId)
// 	}
// 	//generate pseudorandom number in our defined range. 
// 	var randNum = Math.floor((Math.random() * challengeInstanceId.length) + 0); 
// 	//reference the id at that random numbers location
// 	var randomChallengeId = challengeInstanceId[randNum];
// 	//each time you run this code, a different id is set in the scriptdata
// 	Spark.setScriptData("challenge to join", randomChallengeId);

// 	//now we have our random challenge we can join it with a SparkRequest
// 	var request = new SparkRequests.JoinChallengeRequest();

// 	//join our random challenge
// 	request.challengeInstanceId = randomChallengeId;

// 	var response = request.Send();
// } else {

// 	var request = new SparkRequests.CreateChallengeRequest();
// 	request.accessType = "PUBLIC";
// 	request.autoStartJoinedChallengeOnMaxPlayers = true;
// 	//request.challengeMessage = "";
// 	request.challengeShortCode = "chalRanked";
// 	//request.eligibilityCriteria = ...;
// 	request.maxPlayers = 2;
// 	request.minPlayers = 1;
// 	//request.silent = false;
    
//     //var endTime = getGameSparksTimeFormat(addMinutes(new Date(), 60*15))
    
//     var battleEndDate = new Date(Date.now()+(1000*60*60*24));

//     var endDate = battleEndDate.getFullYear()+ "-" + battleEndDate.getUTCMonth() + 1 +"-"+ battleEndDate.getUTCDate() + "T" + battleEndDate.getUTCHours() +":" + battleEndDate.getUTCMinutes()+ "Z";
    
// 	request.endTime = endDate;

// 	var response = request.Send();

// 	var challengeInstanceId = response.challengeInstanceId; 
// 	var scriptData = response.scriptData; 

// }