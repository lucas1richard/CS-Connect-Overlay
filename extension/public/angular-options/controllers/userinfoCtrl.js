(function() {
    angular
    .module('app')
    .controller('userinfoCtrl', userinfoCtrl);

    userinfoCtrl.$inject = ['$scope', '$timeout'];

    function userinfoCtrl($scope, $timeout) {

      var vm = $scope;

      Object.assign(vm, {
        email: '',
        firstname: '',
        lastname: '',
        message: '',
        phone: '',
        saveInfo,
      });

      activate();

      function activate() {
        return chrome.storage.sync.get({ userInfo: false }, ({ userInfo }) => {
          if (userInfo) vm = Object.assign({}, vm, userInfo);
        });
      }

      function saveInfo() {
        vm.message = 'Saved';

        // Save everything on the scope except functions
        const userInfo = Object.keys(vm).reduce((save, param) => {
          if (typeof vm[param] !== 'function') save[param] = vm[param];
          return save;
        }, {});

        return chrome.storage.sync.set({ userInfo }, function() {
          return $timeout(function() {
            vm.message = '';
          }, 1000);
        });
      }

    }
})();
