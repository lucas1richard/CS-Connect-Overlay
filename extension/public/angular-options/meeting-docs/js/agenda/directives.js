(function() {

  angular
    .module('agenda')
    .directive('revision', revision)
    .directive('interpretation', interpretation)
    .directive('entiredocument', entiredocument)
    .directive('recordlink', recordlink)
    .directive('recentballots', recentballots);

  function revision() {
    return {
      scope:  {r: '=', t: '=', d: '@', typ: '@'},
      templateUrl:  'js/agenda/revision.directive.tpl.html',
      restrict:  'E'
    };
  }
  function interpretation() {
    return {
      scope:  {r: '=', t: '=', d: '@'},
      templateUrl:  'js/agenda/interpretation.directive.tpl.html',
      restrict:  'E'
    };
  }
  function entiredocument() {
    return {
      scope:  {r: '=', t: '=', d: '@'},
      templateUrl:  'js/agenda/entiredocument.directive.tpl.html',
      restrict:  'E'
    };
  }
  function recordlink() {
    return {
      scope: {record: '='},
      template: '<a target="_blank" ng-href="https: //cstools.asme.org/csconnect/SearchAction.cfm?TrackingNumber={{record.split(\'-\')[1]}}&YearOpened={{record.split(\'-\')[0]}}&NoToolbar=yes">{{ record }}</a>'
    };
  }
  function recentballots() {
    return {
      scope: {includedRecords: '=', getRecentBallots: '='},
      templateUrl:  'js/agenda/recentballots.directive.tpl.html'
    };
  }
})();
