
// Randomly choose player to go first
var firstPlayer = randomIntFromInterval(1,2);
var seed = randomIntFromInterval(1,9999999);
var intervalId;
var playersJoined = []; // this is only used at the start to make sure each player is connected
var testPieceId;

RTSession.onPlayerConnect(function(player){
    
    var request = RTSession.newRequest()
        .createLogEventRequest()
        .setEventKey("getOpponentGamePiece");
    request.setuserId(player.getPlayerId());
    request.setPlayerId(player.getPlayerId())
        .send(function(response){
            if (playersJoined[0].peerId == player.getPeerId()) {
                playersJoined[0].gamePieceId = response.scriptData("gamePieceId");
            } else {
                playersJoined[1].gamePieceId = response.scriptData("gamePieceId");
            }
            // testPieceId = response.scriptData("gamePieceId");
            RTSession.getLogger().debug(response);
        });
        
    // first we check to see if the player has already joined the match
    if(!contains(player.getPeerId(), playersJoined)){
        // playersJoined.push(player.getPeerId()); // and add them if not
        playersJoined.push({peerId: player.getPeerId(),  gamePieceId: 0});
    }
    // next we check to see the max (or min) number of players has joined that match
    if(playersJoined.length === 2){
        
        var rtData = RTSession.newData().setNumber(1, firstPlayer)
                                        .setNumber(2, seed);
        
        RTSession.newPacket().setData(rtData).setOpCode(100).setTargetPeers().send(); // send an empty pack back to all players

        intervalId = RTSession.setInterval(function(){ // send current server time to all players every 1 second
            RTSession.getLogger().debug(new Date().getTime());
            RTSession.newPacket().setOpCode(102).setTargetPeers().setData(RTSession.newData().setNumber(1, new Date().getTime() )).send();
        }, 1000);
        
    }
});



RTSession.onPlayerDisconnect(function(player){
    var index = playersJoined.indexOf(player.getPeerId());
    if (index > -1) {
        playersJoined.splice(index, 1);
    }
    // if (playersJoined.length == 0) {
        RTSession.clearInterval(intervalId);
    // }
});

// packet 101 is a timestamp from the client for clock-syncing
RTSession.onPacket(101, function(packet){
    var rtData = RTSession.newData().setNumber(1, packet.getData().getNumber(1)) // return the timestamp the server just got
                                    .setNumber(2, new Date().getTime()) // return the current time on the server
    // players.push(packet.getSender().getPeerId());
    RTSession.newPacket().setData(rtData).setOpCode(101).setTargetPeers(packet.getSender().getPeerId()).send(); // send the packet back to the peer that sent it
    // we've also set this packet to be op-code 101.
    // we used 101 to send the packet, but we only ever send the packet from client-to-server
    // which means we can re-use the op-code to receive packets with the same op-code
});


RTSession.onPacket(80, function(packet){
    var opponentGamePieceId = 0;
        if (playersJoined[0].peerId != packet.getSender().getPeerId()) {
            opponentGamePieceId = playersJoined[0].gamePieceId;
        } else {
            opponentGamePieceId = playersJoined[1].gamePieceId;
        }
    var rtData = RTSession.newData().setNumber(1, opponentGamePieceId);

    RTSession.newPacket().setData(rtData).setOpCode(80).setTargetPeers(packet.getSender().getPeerId()).send(); 
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function contains(a, obj) { // this is a simple method that just checks if an element is in an array or not
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}