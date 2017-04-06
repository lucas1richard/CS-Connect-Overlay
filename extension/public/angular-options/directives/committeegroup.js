(function() {
  angular
    .module('app')
    .directive('committeegroup', ($rootScope) => {
      return {
        scope: {
          comdata: '=',
          ind: '=',
          rmv: '=',
          allCommittees: '='
        },
        templateUrl: 'templates/directives/committeegroup.html',
        link: function(scope) {
          console.log(scope);
        }
      };
    });
})();
