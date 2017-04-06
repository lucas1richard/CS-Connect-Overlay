(function() {
  angular
    .module('app')
    .controller('styleCtrl', styleCtrl);

  styleCtrl.$inject = ['$scope'];

  function styleCtrl($scope) {
    let vm = $scope;

    Object.assign(vm, {
      formatStyle,
      inputbackground: '#ffffff',
      inputborder: '#000000',
      inputtext: '#000000',
      saveStyles,
      tablebackground: '#ebf3f9',
      tableborder: '#d8e7f3',
      threed: false
    });


    activate(); // Get saved values from Chrome storage

    function activate() {
      return chrome.storage.sync.get({
        backgroundColor:  '#ebf3f9',
        borderColor:  '#d8e7f3',
        inpColor:  '#ffffff',
        inpBorderColor:  '#dedede',
        inptxtColor: '#000000',
        threed: false
      }, ({ backgroundColor, borderColor, inpColor, inpBorderColor, inptxtColor, threed }) => {
        vm.tablebackground = backgroundColor;
        vm.tableborder = borderColor;
        vm.inputbackground = inpColor;
        vm.inputborder = inpBorderColor;
        vm.inputtext = inptxtColor;
        vm.threed = threed;
      });
    }

    function formatStyle() {
      if (vm.threed) {
        return {
          'background-color': vm.inputbackground,
          border: '1px solid ' + vm.inputborder,
          color: vm.inputtext,
          'box-shadow': vm.inputborder + ' 0px 2px 5px 0px'
        };
      }
      return {
        'background-color': vm.inputbackground,
        border: '1px solid ' + vm.inputborder,
        color: vm.inputtext
      };
    }

    function saveStyles() {
      chrome.storage.sync.set({
        backgroundColor:  vm.tablebackground,
        borderColor:  vm.tableborder,
        inpColor:  vm.inputbackground,
        inpBorderColor:  vm.inputborder,
        inptxtColor: vm.inputtext,
        threed: vm.threed
      }, function() {
        alert('Saved');
      });
    }

  }
})();
