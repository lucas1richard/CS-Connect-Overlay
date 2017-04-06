import angular from 'angular';
import { navBar } from './utils';

  // Performs the actual navbar replacement referencing the constructors above
export default function replaceNavBar() {
  angular
    .module('navCommitteePage', [])
    .controller('navCommitteePageCtrl', navCommitteePageCtrl);

    navCommitteePageCtrl.$inject = ['$scope', '$http'];
    function navCommitteePageCtrl($scope, $http) {
      var vm = $scope;

      vm.searchCommittee = '';
      vm.committees = [];
      vm.openPage = openPage;

      activate();

      function activate() {
        var committees = chrome.extension.getURL('assets/json/committees.json');
        return $http.get(committees).then(function (res) {
          vm.committees = res.data;
          return vm.committees;
        });
      }

      function openPage(c) {
        vm.searchCommittee = '';
        window.open('https://cstools.asme.org/csconnect/CommitteePages.cfm?Committee=' + c.num);
      }
    } // end navCommitteePageCtrl
  // var tbl = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(1)');
  //     tbl.parentNode.parentNode.removeChild(tbl.parentNode);

  var tr = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(2)');

  var replacementTr = document.createElement('tr');
  var replacementTd = document.createElement('td');

  replacementTd.appendChild(navBar());
  replacementTr.appendChild(replacementTd);

  tr.parentNode.replaceChild(replacementTr, tr);
}
