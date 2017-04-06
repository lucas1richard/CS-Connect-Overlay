(function() {
  angular
    .module('app')
    .controller('recordlinksCtrl', recordlinksCtrl);

  recordlinksCtrl.$inject = ['$scope'];

  function recordlinksCtrl($scope) {
    var vm = $scope;

    vm.records = '';
    vm.showLink = showLink;

    function showLink(records) {
      return records.split('\n').filter(record => record.search('-') > -1);
    }
  }
})();
