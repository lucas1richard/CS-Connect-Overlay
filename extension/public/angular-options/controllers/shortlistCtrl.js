(function() {
  angular
    .module('app')
    .controller('shortlistCtrl', shortlistCtrl);

  shortlistCtrl.$inject = ['$scope', 'getJSON'];

  function shortlistCtrl($scope, getJSON) {

    var vm = $scope;

    Object.assign(vm, {
      addIndent,
      addStyle,
      allCommittees: [],
      checkMatch,
      checkStyle,
      complete,
      moveDown,
      moveUp,
      removeCommittee,
      save,
      shortlist: [],
    });


    activate();

    function activate() {
      // Load Committees
      getJSON.getCommittees().then(committees => {
        vm.allCommittees = committees;
      });

      // Load Current List
      chrome.storage.sync.get({ committees: [] }, ({ committees }) => {
        vm.shortlist = committees;
      });
    }


    function addStyle(obj) {
      return obj.indent ? { 'text-indent': '0px' } : { 'text-indent': '20px' };
    }

    function addIndent(obj) {
      if (obj.indent) {
        delete obj.indent;
      } else {
        obj.indent = true;
      }
    }

    function checkMatch(obj) {
      if (!obj) return false;
      for (var i = 0; i < vm.shortlist.length; i++) {
        if (vm.shortlist[i].committee === obj) return false;
      }
      return obj.length > 0;
    }

    function checkStyle() {
      let base = {
        'border-radius': '3px',
        cursor: 'pointer',
        padding: '5px',
      };
      if (vm.enableModify) {
        return Object.assign(base, {
          'background-color': '#ffffcc',
          'box-shadow': '#666600 0px 0px 8px inset',
          border: '1px solid #666600',
        });
      } else {
        return Object.assign(base, { border: '1px solid #000' });
      }
    }

    function complete(com) {
      vm.newCommittee = '';
      for (var i = 0; i < vm.shortlist.length; i++) {
        if (vm.shortlist[i].committee === com.committee) return false;
      }
      vm.shortlist.push(com);
    }

    function moveUp(ss) {
      var newS = Object.assign({}, ss);
      var original = vm.shortlist.indexOf(ss);

      vm.shortlist.splice(original, 1);
      vm.shortlist.splice(original - 1, 0, newS);
    }

    function moveDown(ss) {
      var newS = Object.assign({}, ss);
      var original = vm.shortlist.indexOf(ss);

      vm.shortlist.splice(original, 1);
      vm.shortlist.splice(original + 1, 0, newS);
    }

    function removeCommittee(committee) {
      var ind = vm.shortlist.indexOf(committee);
      vm.shortlist.splice(ind, 1);
    }

    function save() {
      chrome.storage.sync.set({ committees: vm.shortlist }, () => alert('Saved'));
    }
  }
})();
