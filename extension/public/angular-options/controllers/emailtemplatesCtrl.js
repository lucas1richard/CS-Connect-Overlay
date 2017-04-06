(function() {
  angular
    .module('app')
    .controller('emailtemplatesCtrl',  emailtemplatesCtrl);

  emailtemplatesCtrl.$inject = ['$scope'];

  function emailtemplatesCtrl($scope) {
    $scope.message = '';
    $scope.convertHref = convertHref;

    function convertHref(msg) {
      var codes = [
        [' ', '%20'], ['!', '%21'], ['\'', '%22'], ['#', '%23'], ['&', '%26'], ['\'', '%27']
      ];
      var out = msg.replace(/\n/g, '%0D');
      out = out.replace(/\?/g, '%3F');
      out = out.replace(/\(/g, '%28');
      out = out.replace(/\)/g, '%29');
      out = out.replace(/\*/g, '%2A');
      out = out.replace(/\+/g, '%2B');
      out = out.replace(/, /g, '%2C');
      out = out.replace(/-/g, '%2D');
      out = out.replace(/\./g, '%2E');
      out = out.replace(/:/g, '%3A');
      out = out.replace(/;/g, '%3B');

      codes.forEach(code => {
        var regex = new RegExp(code[0],  'g');
        out = out.replace(regex, code[1]);
      });
      var front = 'mailto:vvvvvvvvvvvvv@yyyyy.com?';
      if ($scope.subject) {
        front += 'subject=' + $scope.subject + '&';
      }
      out = 'body=' + out;
      return front + out;
    }
  }
})();
