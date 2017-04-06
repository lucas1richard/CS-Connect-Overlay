import { addAngular, addCSS, appendShortList, changeCSSofAll } from './utils';

export default function formatVCC() {
  var committeeSel = document.getElementById('Committee');
  changeCSSofAll('select', { width: '100%' });
  if (window.location.href.search('SendEmail') !== -1) {
    addEmailListBtn();
    monitorForAttachments();
    return;
  }
  appendShortList('#Committee');
  if (committeeSel) committeeSel.style.width = '100%';
}

function addEmailListBtn() {
  var committeeName = document.querySelector('#Search > table.DetailPage > tbody > tr:nth-child(1) > th > b') || document.querySelector('#Search > div:nth-child(2)');

  var btn = document.createElement('span');
  btn.innerText = 'Create Email List';
  btn.setAttribute('class', 'btn btn-primary btn-xs');

  btn.addEventListener('click', function() {
    var reloadBTN = (() => {
      var relbtn = document.createElement('button');
        relbtn.innerText = 'Back';
        relbtn.className = 'btn btn-default';
      addCSS(relbtn, { marginTop: '50px', marginLeft: '100px' });
      relbtn.addEventListener('click', () => location.reload());
      return relbtn;
    })();
    var uniqueEmails = {};
    var myList = '';

    document.querySelectorAll("a[href^='mailto']").forEach(email => {
      if (!uniqueEmails[email.innerHTML]) {
        uniqueEmails[email.innerHTML] = 1;
        myList += email.innerHTML + ';<br/>';
      }
    });

    document.body.innerHTML = '';
    document.body.appendChild(reloadBTN);
    var div = document.createElement('div');
    addCSS(div, { paddingLeft: '100px', paddingTop: '100px' });
    div.innerHTML = myList;
    document.body.appendChild(div);

  });
  committeeName.appendChild(btn);
}

function monitorForAttachments() {

var txtArea = document.querySelector('textarea[name="notes"]');
    txtArea.setAttribute('ng-model', 'message');

var inpFile = document.querySelector('input[type="file"]');
    inpFile.setAttribute('fileread', 'fileAttachments');
var warningSpan = document.createElement('div');
    warningSpan.setAttribute('ng-if', 'detectAttachmentInText()');
    addCSS(warningSpan, {fontWeight: 'bold', color: 'red'});
    warningSpan.innerText = ' There is no file attached ';
    document.querySelector('input[name="SubmitButton"]').parentNode.insertBefore(warningSpan, document.querySelector('input[name="SubmitButton"]'));

angular
  .module('attachments', [])
  .controller('attachmentsCtrl', attachmentsCtrl)
  .directive('fileread', [ function () {
    return {
      scope: {
        fileread: '='
      },
      link: function (scope, element) {
        element.bind('change', function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
            });
          };
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    };
  } ]);

attachmentsCtrl.$inject = ['$scope'];

function attachmentsCtrl($scope) {
  var vm = $scope;

  vm.log = log;
  vm.message = document.querySelector('textarea[name="notes"]').value;
  vm.detectAttachmentInText = detectAttachmentInText;

  function log(data) { console.log(data); }
  function detectAttachmentInText() {
    if (vm.message) {
      if (vm.message.toLowerCase().indexOf('attach') > -1 && !vm.fileAttachments) {
        return true;
      }
      return false;
    }
    return false;
  }

} // end attachmentsCtrl

addAngular(txtArea.parentNode.parentNode, 'attachments', 'attachmentsCtrl');
}
