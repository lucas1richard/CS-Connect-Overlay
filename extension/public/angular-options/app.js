(function() {
  angular
    .module('app', ['ngRoute']);

  angular
    .module('app')
    .controller('optionsCtrl', function($scope) {
      $scope.links = [
        { title: 'Committee Short List', href: '#/shortlist', width: 2, clss: '' },
        { title: 'Committee Groups', href: '#/committeegroups', width: 2, clss: '' },
        { title: 'Style Options', href: '#/styleoptions', width: 2, clss: '' },
        { title: 'User Info', href: '#/userinfo', width: 2, clss: '' },
        { title: 'Summary of Modifications', href: '#/summaryofmodifications', width: 2, clss: '' },
        { title: 'Parse Minutes for Actions & Motions', href: '#/parseminutes', width: 4, clss: '' },
        { title: 'Meeting Documents', href: '#/meetingdocs' }
      ];

      $scope.setActive = function(lnk) {
        $scope.links = $scope.links.map(link => {
          link.class = link.title ===  lnk.title ? 'active' : '';
          return link;
        });
      };
    });

  angular
    .module('app')
    .config(function($routeProvider, $compileProvider) {
      $routeProvider.when('/shortlist', {
        controller: 'shortlistCtrl',
        templateUrl: 'templates/shortlist.html'
      });
      $routeProvider.when('/committeegroups', {
        controller: 'committeegroupsCtrl',
        templateUrl: 'templates/committeegroups.html'
      });
      $routeProvider.when('/recordlinks', {
        controller: 'recordlinksCtrl',
        templateUrl: 'templates/recordlinks.html'
      });
      $routeProvider.when('/userinfo', {
        controller: 'userinfoCtrl',
        templateUrl: 'templates/userinfo.html'
      });
      $routeProvider.when('/summaryofmodifications', {
        controller: 'modsCtrl',
        templateUrl: 'templates/modifications.html'
      });
      $routeProvider.when('/styleoptions', {
        controller: 'styleCtrl',
        templateUrl: 'templates/styleoptions.html'
      });
      $routeProvider.when('/parseminutes', {
        controller: 'parseminutesCtrl',
        templateUrl: 'templates/parseminutes.html'
      });
      $routeProvider.when('/emailtemplates', {
        controller: 'emailtemplatesCtrl',
        templateUrl: 'templates/emailtemplates.html'
      });
      $routeProvider.when('/memory', {
        controller: 'memoryCtrl',
        templateUrl: 'templates/memory.html'
      });
      $routeProvider.when('/meetingdocs', {
        templateUrl: 'templates/meetingdocs.html'
      });
      $routeProvider.otherwise({ redirectTo: '/shortlist' });
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    });

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  document.getElementById('extensionsLink').addEventListener('click', function(){
    chrome.tabs.create({url: 'chrome: //extensions'});
  });
})();
