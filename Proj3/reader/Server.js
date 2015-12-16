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

Server.prototype.makeRequest = function(requestString)
{
    // Make Request
    this.getPrologRequest(requestString, this.handleReply);
}

//Handle the Reply
Server.prototype.handleReply = function(data){
    console.log(data.target.response);
}


//Handle the Reply
Server.prototype.quit = function(){
    this.makeRequest("quit");
}
