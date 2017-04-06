(function() {


  angular.module("attendance", []);
  angular
    .module("attendance")
    .controller("attendanceCtrl", attendanceCtrl);

  attendanceCtrl.$inject = ["$scope", "getJSON"];
  function attendanceCtrl($scope, getJSON) {
    var vm = $scope;

    vm.allCommittees = [];
    vm.complete = complete;
    vm.selectedcommittee = "";
    vm.numRows = [];

    activate();

    function activate() {
      for(var i=0; i<26; i++) {
        vm.numRows.push(i);
      }

      return getJSON.getdata("../../json/committees.json").then(function(r) {
        vm.allCommittees = r.data;
        return vm.allCommittees;
      });
    }

    function complete(c) {
      vm.selectedcommittee = c;
      vm.committee = "";
    }
  }

  document.getElementById("printBtn").addEventListener("click", function() { window.print(); });
  
}


)();