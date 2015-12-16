Server.prototype.constructor=Server;

function Server() {
};

Server.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

Server.prototype.makeRequest = function()
{
    // Get Parameter Values
    var requestString = "[5,playerVSplayer]";
    requestString = "[[[[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[0,-1],[-1,-1],[0,-1],[-1,-1],[-1,-1]],[[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]]],[[14,18],[14,18]],player1,playerVSplayer,5,[]],1,1]";
    //requestString = "quit";

    // Make Request
    this.getPrologRequest(requestString, this.handleReply);
}

//Handle the Reply
Server.prototype.handleReply = function(data){
    console.log(data.target.response);
}
