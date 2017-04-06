(function() {
  angular
    .module("services", []);

  getJSON.$inject = ["$http"];

  function getJSON($http) {
    var service = {
      getdata,
      getCommittees
    };

    return service;

    function getdata(jsonfile) {
      return $http.get(jsonfile).then(function(response){
        return response;
      });
    }

    function getCommittees() {
      return $http.get('../../../assets/json/committees.json').then(({ data }) => data);
    }
  }

  angular
    .module("services")
    .factory("getJSON", getJSON);
})();
