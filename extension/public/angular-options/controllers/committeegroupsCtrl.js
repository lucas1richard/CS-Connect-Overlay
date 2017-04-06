(function() {
  angular
    .module('app')
    .controller('committeegroupsCtrl', committeegroupsCtrl);

  committeegroupsCtrl.$inject = ['$scope', 'getJSON'];

  function committeegroupsCtrl($scope, getJSON) {

    var vm = $scope;

    Object.assign(vm, {
      allCommittees: [],
      addGroup,
      checkTitle,
      complete,
      removeCommittee,
      removeGroup,
      retrieveGroups,
      saveGroups,
    });

    activate();

    //////////////////////////////////////

    function activate() {
      return getJSON.getCommittees().then(committees => {
        vm.allCommittees = committees;
        return vm.allCommittees;
      });
    }

    function addGroup() {
      vm.committeegroups.push({title: '', committees: []});
      vm.updated = false;
    }

    function checkTitle(title) {
      var count = vm.committeegroups.filter(grp => grp.title === title).length;
      return count > 1 ? { css: { border: '1px solid red'}, error: true } : { css: {}, error: false };
    }

    function removeGroup(index) {
      vm.committeegroups.splice(index, 1);
      vm.updated = false;
    }

    function removeCommittee(committees, com) {
      var ind = committees.indexOf(com);
      committees.splice(ind, 1);
      vm.updated = false;
    }

    function saveGroups() {
      var toSave = vm.committeegroups.reduce((save, group) => {
        toSave[group.title] = group.committees;
        return save;
      }, {});
      console.log(toSave);
      chrome.storage.local.set({ committeeGroups: toSave }, function() {});
      vm.updated = true;
    }

    function retrieveGroups() {
      vm.committeegroups = [];
      chrome.storage.local.get('committeeGroups', ({ committeeGroups }) => {
        Object.keys(committeeGroups).forEach(group => {
          vm.committeegroups.push({ title: group, committees: committeeGroups[group] });
        });
        vm.updated = true;
      });
    }

    function complete(group, newCommittee) {
      group.committees.push(newCommittee);
      vm.updated = false;
    }

    vm.retrieveGroups();

  }
})();
