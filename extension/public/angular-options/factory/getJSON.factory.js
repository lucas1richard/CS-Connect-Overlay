(function() {
  angular
    .module('app')
    .factory('getJSON', getJSON);

  getJSON.$inject = ['$http'];

  function getJSON($http) {
    var service = {
      getdata,
      getCommittees
    };

    return service;

    function getdata(jsonfile) {
      return $http.get(jsonfile).then(response => response);
    }

    function getCommittees() {
      return $http.get('../../assets/json/committees.json').then(({ data }) => data);
    }
  }
})();
