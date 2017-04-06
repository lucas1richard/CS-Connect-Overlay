(function() {
  angular
    .module('app')
    .controller('modsCtrl', modsCtrl);

    modsCtrl.$inject = ['$scope', 'getJSON'];

    function modsCtrl($scope, getJSON) {
      var vm = $scope;

      vm.isNew = isNew;
      vm.v = parseFloat(chrome.runtime.getManifest().version);

      activate();

      function isNew(m) {
        return m.version === vm.v ? { q: true, style: { color: '#2b73b7' } } : { q: false, style: {} };
      }

      function activate() {
        return getJSON.getdata('json/modifications.json').then(({ data }) => {
          vm.mods = data;
          return vm.mods;
        });
      }

    }
})();
