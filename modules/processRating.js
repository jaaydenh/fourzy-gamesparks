var player = Spark.getPlayer();
var playerId = player.getPlayerId();

var playerRatingElo = player.getScriptData("ratingElo");
var playerRating = player.getScriptData("rating");
var playerRatingDeviation = player.getScriptData("ratingDeviation");


var challengeInstanceId = Spark.getData().challenge.challengeId;
var challenge = Spark.getChallenge(challengeInstanceId);
var challengerId = challenge.getChallengerId();
var challengedId = challenge.getChallengedPlayerIds()[0];

var players = Spark.getChallenge(challengeInstanceId).getAcceptedPlayerIds();
var opponentId;
if(playerId !== players[0])
{
    opponentId = players[0];
} else {
    opponentId = players[1];
}

var opponentPlayer = Spark.loadPlayer(opponentId);
var opponentRating = opponentPlayer.getScriptData("rating");
var opponentRatingDeviation = opponentPlayer.getScriptData("ratingDeviation");
var opponentRatingElo = opponentPlayer.getScriptData("ratingElo");

var s = 0;
if (outcome === "victory") {
    s = 1;
} else if (outcome === "draw") {
    s = 0.5;
} else {
    s = 0;
}

var player = {name:'a', rating:playerRating, rd:playerRatingDeviation}
var opponents = [{name:'b', rating:opponentRating, rd:opponentRatingDeviation, s:s}];

var results = calculateGlickoRating(player, opponents, null, 1);
playerRating = results.update.rating;
playerRatingDeviation = results.update.rd;

Spark.getPlayer().setScriptData("rating", playerRating);
Spark.getPlayer().setScriptData("ratingDeviation", playerRatingDeviation);

var request = new SparkRequests.LogEventRequest();
request.eventKey = "submitPlayerRating";
request.playerRating = playerRating;
var response = request.Send();

var request2 = new SparkRequests.LogEventRequest();
request2.eventKey = "submitPlayerRatingDeviation";
request2.playerRatingDeviation = playerRatingDeviation;
var response2 = request2.Send();

var newEloRating = getNewEloRating(playerRatingElo, opponentRatingElo, s);
Spark.getPlayer().setScriptData("ratingElo", newEloRating);

if (playerId === challengerId) {
    var ratingDelta = getEloRatingDelta(playerRatingElo, opponentRatingElo, s);
    challenge.setScriptData("challengerRatingDelta", ratingDelta);
} else {
    var ratingDelta = getEloRatingDelta(playerRatingElo, opponentRatingElo, s);
    challenge.setScriptData("challengedRatingDelta", ratingDelta);
}

var request3 = new SparkRequests.LogEventRequest();
request3.eventKey = "submitPlayerRatingElo";
request3.playerRatingElo = newEloRating;
var response3 = request3.Send();


function getEloRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }
    
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.floor(60 * (myGameResult - myChanceToWin));
}

function getNewEloRating(myRating, opponentRating, myGameResult) {
    var newRating = myRating + getEloRatingDelta(myRating, opponentRating, myGameResult);
    if (newRating < 0) {
        newRating = 0;
    }
    return newRating;
}

function calculateGlickoRating(player, opponents, system_constant, factor) {
    var pow = Math.pow;
    var pi = Math.PI;

	//set defaults
	var min = 60; var hour = 60*min; var day = 24*hour;
	//if(!rating_period)
	//    rating_period = day*30;
	var t = system_constant;
	if(!factor)
	    factor = 1;

	//step 1
	//initialize
	if(!t)
	    t = 0.5;

	//p will be the returned object with the updated values for the player
	var p = {};
	p.rating = player.rating;
	p.rd = player.rd;
	p.vol = player.vol;

	//initialize all players
	var initialize_set = [];
	opponents.forEach(function(opp){
	    initialize_set.push(opp);
	});

	initialize_set.push(p);
	initialize_set.forEach(function(pl){
	    //step 2 - set glicko-2 values (and initial values).
	    playerInit(pl);
	});

	var out = {update:{}, change:{}, init:{rating:p.rating, rd:p.rd, vol:p.vol}};

	//step 3
	var g = function(rd){
	    return 1/(
		Math.sqrt(
		    1 + (
			(3*pow(rd, 2))/
			    (pow(pi,2))
		    )
		)
	    );
	};

	//the paper has three values comming in for the two players, this just takes the player objects
	var E = function(p1, p2){
	    if(!p1.rd2)
		throw "Missing player 1";
	    if(!p2.rd2)
		throw "Missing player 2"+p2.rd2;
	    
	    return 1 / (1 + Math.exp((-g(p2.rd2)*(p1.rating2-p2.rating2))));
	}

	//iterate over all opponents he played against to calculate variance
    	var v_sum = 0;
	opponents.forEach(function(opp){
	    var this_v = (pow(g(opp.rd2),2)) * E(p, opp) * (1 - E(p, opp) );
	    v_sum += this_v;	    
	});
	var v = pow(v_sum, -1);

	//step 4
	var part_delta_sum = 0;
	opponents.forEach(function(opp){
	    var this_delta_part = g(opp.rd2) * (opp.s - E(p, opp) )
	    part_delta_sum += this_delta_part;
	});

	//delta is the change in rating
	var delta = v * part_delta_sum;

	//step 5
	//5.1
	var a = ln(pow(p.vol,2));
	var f = function(x){
	    return (
		(Math.exp(x)*(pow(delta,2)-pow(p.rd2,2)-v-Math.exp(x))) / 
		    (
			2* pow( 
			    (pow(p.rd2,2) + v + Math.exp(x) ),
			    2)
		    )
	    ) - (
		(x - a)/(pow(t,2))
	    )
	}
	var e = 0.000001;//convergence tolerance

	//5.2
	var A = a;
	if( pow(delta,2) > (pow(p.rd2,2) + v) ){
	    var B = ln(pow(delta,2) - pow(p.rd2,2) - v);
	}else{
	    var k = 1;
	    while(f(a - (k*Math.abs(t))) < 0){
		k = k+1;
	    }
	    var B = a - k * Math.abs(t);
	}

	//5.3
	fa = f(A);
	fb = f(B);

	//5.4
	while((Math.abs(B-A) > e)){
	    var C = A+(A-B)*fa/(fb-fa);
	    fc = f(C);
	    if((fc*fb)<0){
		A = B;
		fa = fb;
	    }else{
		fa = fa/2;
	    }
	    B = C;
	    fb = fc;
	}
	var vol_prime = Math.exp(A/2);

	//Step 6
	var rd2_star = Math.sqrt(Math.pow(p.rd2,2) + Math.pow(vol_prime,2));
	//Step 7
	var rd2_prime = 1/(
	    Math.sqrt( 
		( (1/(Math.pow(rd2_star, 2))) + 1/v )
	    ));

	var rating2_prime_sum = 0;
	opponents.forEach(function(opp){
	    var sum_el = g(opp.rd2)*(opp.s - E(p, opp));
	    rating2_prime_sum += sum_el;
	});
	var rating2_prime = p.rating2 + pow(rd2_prime,2) * rating2_prime_sum;

	//lets track changes to player
	p.rating2 = rating2_prime;
	p.rd2 = rd2_prime;
	p.vol = vol_prime;

	//step 8 convert back to original scale
	p.rating = p.rating2 * 173.7178 + 1500;
	p.rd = p.rd2 * 173.7178;

	out.change.rating = (p.rating - out.init.rating)*factor;
	out.change.rd = (p.rd - out.init.rd)*factor;
	out.change.vol = (p.vol - out.init.vol)*factor;

	out.update.rating = out.change.rating + out.init.rating;
	out.update.rd = out.change.rd + out.init.rd;
	out.update.vol = out.change.vol + out.init.vol;	
	out.timestamp = (new Date()).getTime() / 1000;//in seconds from unix epoch
	return out;
}

function ln(val){
	return Math.log(val) / Math.LOG10E;
}
    
function playerInit(player) {
	if(!player.rating)
	    player.rating = 0;
	if(!player.rd) //rating deviation
	    player.rd= 350;
	if(!player.vol)//volitility
	    player.vol = 0.06;
	player.rating2 = (player.rating - 0)/173.7178
	player.rd2 = player.rd/173.7178
	return player;
}