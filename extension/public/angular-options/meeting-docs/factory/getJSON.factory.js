(function() {
  angular
    .module("attendance")
    .factory("getJSON", getJSON);

  getJSON.$inject = ["$http"];

  function getJSON($http) {
    var service = {
      getdata : getdata
    };

    return service;

    function getdata(jsonfile) {
      return $http.get(jsonfile).then(function(response){
        return response;
      });
    }
  }
})();