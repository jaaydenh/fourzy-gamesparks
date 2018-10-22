var msg = Spark.message(null);
msg.setPlayerIds([Spark.getPlayer().getPlayerId()]);
msg.setMessageData({"title":"test title","body":"test body"});
msg.send();