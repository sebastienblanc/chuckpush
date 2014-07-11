'use strict';

var chuckConfig = {
  pushServerURL : "",
  variantID : "",
  variantSecret : ""
};


var chuckPush = angular.module('chuckPush', ['ngRoute']);
chuckPush.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/partials/jokes.html',
    controller: 'JokeController'
  })
  var jokeEndpoint,
  UPClient = AeroGear.UnifiedPushClient(chuckConfig.variantID, chuckConfig.variantSecret, chuckConfig.pushServerURL+ "/rest/registry/device"),
  regs = navigator.push.registrations();

  regs.onsuccess = function(e) {
  //For now let' clean up each time both SPS and UPS
    if (regs.result.length > 0) {
     for (var i = 0, l = regs.result.length; i < l; i++) {
      var pushEndpoint = regs.result[i].pushEndpoint;
      navigator.push.unregister(pushEndpoint);
      UPClient.unregisterWithPushServer(pushEndpoint);
    }
  }


  var req = navigator.push.register();
  req.onsuccess = function() {
    jokeEndpoint = req.result;
    var jokeSettings = {
      metadata: {
        deviceToken: jokeEndpoint
      }
    }

    UPClient.registerWithPushServer(jokeSettings);

  }
} 
}]);