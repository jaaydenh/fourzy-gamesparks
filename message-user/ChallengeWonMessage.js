var shortCode = Spark.getData().challenge.shortCode;
var outcome = "victory";

// Depending on the outcome variable the 'processRank' module will either increase rank 
// or decrease player rank
require("processRating");

if(shortCode === "chalRanked")
{
    require("processStandard");
}
else if (shortCode === "tournamentChallenge")
{
    require("processTournament");
}