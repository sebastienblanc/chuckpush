'use strict';

var chuckConfig = {
  pushServerURL : "https://sblancpush-sblanc.rhcloud.com",
  variantID : "12551cad-a40d-417f-aa25-473c3aa7eb6d",
  variantSecret : "54dd1b3f-5d37-4372-898f-6ef325fd4e38"
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
      UPClient.unregisterWithPushServer(pushEndpoint.substr(pushEndpoint.lastIndexOf('/') + 1));
    }
  }


  var req = navigator.push.register();
  req.onsuccess = function() {
    jokeEndpoint = req.result;
    var jokeSettings = {
      metadata: {
        deviceToken: jokeEndpoint.substr(jokeEndpoint.lastIndexOf('/') + 1),
        simplePushEndpoint: jokeEndpoint
      }
    }

    UPClient.registerWithPushServer(jokeSettings);

  }
} 
}]);