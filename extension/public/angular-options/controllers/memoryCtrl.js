(function() {
  angular
    .module("app")
    .controller("memoryCtrl", function($scope) {

    chrome.storage.sync.get(null, function(m) {
      $scope.currentSyncMemory = m;
      $scope.syntaxHighlight = function(json) {
          if (typeof json != 'string') {
               json = JSON.stringify(json, undefined, 2);
          }
          return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
              var cls = 'number';
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
              if (/^"/.test(match)) {
                  if (/:$/.test(match)) {
                      cls = 'key';
                  } else {
                      cls = 'string';
                  }
              } else if (/true|false/.test(match)) {
                  cls = 'boolean';
              } else if (/null/.test(match)) {
                  cls = 'null';
              }
              return match;
          });
      };
    });
    chrome.storage.local.get(null, function(m) {
      $scope.currentLocalMemory = m;
    });
  });
})();