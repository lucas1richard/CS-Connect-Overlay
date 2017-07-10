(function () {
  angular
    .module('bsr8', [])
    .controller('bsr8Ctrl', bsr8Ctrl);

  bsr8Ctrl.$inject = ['$scope', '$http'];

  function bsr8Ctrl($scope, $http) {
    var vm = $scope;

    Object.assign(vm, {
      scopesummary: '',
      title: '',
      titles: [],
      addTitle
    });

    activate();

    function activate() {
      var titles = chrome
        .extension
        .getURL('functions/titles.json');
      return $http
        .get(titles)
        .then(function (res) {
          vm.titles = res.data;
          return vm.titles;
        });
    }

    function addTitle(t) {
      vm.searchTitle = t.standard + '-';
      vm.title = t.title;
    }

  }
})();

(function () {

  overlay.set('formatNewBSR8', formatNewBSR8);

  function formatNewBSR8() {

    document
      .body
      .setAttribute('ng-controller', 'bsr8Ctrl');

    makePageSmall();

    var associatedRecords = document.querySelector('#AssociatedRecordNumber');
    var consensusCommittee = document.querySelector('[name=ConsensusCommittee]');
    var designationTitleInput = document.querySelector('[name=DesignationTitle]');
    var projectIntent = document.querySelector('[name=ProjectIntentTypeID]');
    var publicreviewdraftinput = document.querySelector('[name=PublicReviewDraft]');
    var pubRevTable = document.querySelector('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > form > table > tbody ' +
        '> tr > td > table:nth-child(7)');
    var resultForm = document.querySelector('[name=ResultForm]');
    var scopeCountDiv = document.createElement('div');
    var scopeInput = document.querySelector('[name=Contents]');
    var submitButton = document.querySelector('[name=SubmitButton]');
    var supersedesInput = document.querySelector('[name=ANS]');
    var supersedesDes = document.createElement('input');
    var supersedesYear = document.createElement('input');
    var titleInput = document.querySelector('[name=Title]');

    scopeInput.placeholder = 'One paragraph, max 500 characters';

    scopeCountDiv.innerText = 'Characters Remaining: {{ 500-scopesummary.length }}';
    scopeInput
      .parentNode
      .appendChild(scopeCountDiv);
    scopeInput.setAttribute('ng-model', 'scopesummary');

    titleInput.setAttribute('ng-model', 'title');

    //Formatting changes
    addCSS(resultForm, {
      margin: 'auto',
      maxWidth: '1200px'
    });
    designationTitleInput.parentNode.className += ' form-inline text-left';

    supersedesDes.className = 'form-control';
    supersedesDes.type = 'text';
    supersedesDes.placeholder = 'Designation';
    supersedesDes.setAttribute('list', 'standard_titles');

    supersedesYear.className = 'form-control';
    supersedesYear.type = 'text';
    supersedesYear.placeholder = 'Year';

    supersedesInput.parentNode.className = 'form-inline text-left';
    supersedesInput.setAttribute('ng-model', 'searchTitle');

    var ul = document.createElement('ul');
    ul.className = 'drop-options';
    ul.setAttribute('ng-if', 'searchTitle');
    var li = document.createElement('li');
    li.setAttribute('ng-repeat', 't in titles | filter:searchTitle | orderBy:"standard"');
    li.setAttribute('ng-click', 'addTitle(t)');
    li.innerHTML = 'Complete title for <i>{{ t.standard }}</i>';
    li.style.padding = '1em';
    ul.appendChild(li);

    supersedesInput
      .parentNode
      .appendChild(ul);

    projectIntent.value = '7';

    document
      .querySelector('[name=DraftAvailableElectronically]')
      .checked = true;

    pubRevTable.className = 'table table-condensed';

    for (var i = 1; i < pubRevTable.rows.length; i++) {
      pubRevTable.rows[i].firstElementChild.style.width = '450px';
      pubRevTable.rows[i].children[1].className = 'form-inline';
    }

    overlay.changeCSSofAll('th', {'font-size': ''});

    // var checkSpan = document.createElement('span');     checkSpan.className =
    // 'btn btn-primary btn-xs';     checkSpan.innerText = 'Check Inputs';
    // checkSpan.addEventListener('click', checkErrors);
    // submitButton.parentNode.replaceChild(checkSpan, submitButton);

    var titles = chrome
      .extension
      .getURL('functions/titles.json');

    $.ajax({
      url: titles,
      success: function (res) {
        window.results = eval(res);
        var datalist = document.createElement('datalist');
        datalist.id = 'standard_titles';

        for (var i = 0; i < results.length; i++) {
          var option = document.createElement('option');
          option.innerText = results[i].standard;
          datalist.appendChild(option);
        }
        document
          .body
          .appendChild(datalist);

        supersedesDes.addEventListener('change', function () {
          var des = supersedesDes.value;
          if (des.length > 0) {
            for (var i = 0; i < window.results.length; i++) {
              if (results[i].standard == des) {
                titleInput.value = results[i].title;
                break;
              }
            }
          } else {
            titleInput.value = '';
          }
          supersedesInput.value = des;
          if (supersedesYear.value.length > 0) {
            supersedesInput.value += ' - ' + supersedesYear.value;
          }
        });

        supersedesYear.addEventListener('change', function () {
          var des = supersedesDes.value;
          supersedesInput.value = des;
          if (supersedesYear.value.length > 0) {
            supersedesInput.value += ' - ' + supersedesYear.value;
          }
        });
      }
    });

    overlay.changeCSSofAll('select, input[type=text], input[type=number], textarea', {
      'background-color': inpColor,
      'border': '1px solid ' + inpBorderColor,
      'color': inptxtColor
    });
    if (threed) {
      overlay.changeCSSofAll('select, input[type=text], input[type=number], textarea', {
        'boxShadow': '0 2px 5px 0 ' + inpBorderColor
      });
    }

    function checkErrors() {
      var errorMessage = [];
      var errors = 0;

      // Check that there are associated records
      if (associatedRecords.children.length == 0) {
        errors++;
        errorMessage.push('There are no associated records assigned');
      }
      // Check that the consensus committee is set
      if (consensusCommittee.value == '') {
        errors++;
        errorMessage.push('The consensus committee is not set');
      }

      // Check that supercedes is set, if applicable
      if (projectIntent.value == '7' && supersedesInput.value == '') {
        errors++;
        errorMessage.push('Supercedes or Affects is not specified');
      }

      // Check that supercedes has the year, if applicable
      if (projectIntent.value == '7' && supersedesInput.value.search('-') == -1) {
        errors++;
        errorMessage.push('Supercedes or Affects does not include the year');
      }

      // Check that the designation is specified
      if (projectIntent.value == '7' && designationTitleInput.value.length <= 5) {
        errors++;
        errorMessage.push('The designation of the proposed standard is not set');
      }

      // Check that the title is specified
      if (titleInput.value.length <= 5) {
        errors++;
        errorMessage.push('The title of the proposed standard is not set');
      }

      // Check that the scope is specified
      if (scopeInput.value.length == 0) {
        errors++;
        errorMessage.push('The scope summary of the proposed standard is not set');
      }

      if (document.getElementById('errorMsg')) {
        var errorMsg = document.getElementById('errorMsg');
        while (errorMsg.firstElementChild) {
          errorMsg.removeChild(errorMsg.firstElementChild);
        }
      } else {
        var errorMsg = document.createElement('div');
        errorMsg.id = 'errorMsg';
        checkSpan
          .parentNode
          .appendChild(errorMsg);
      }

      if (errors > 0) {
        var h3 = document.createElement('h3');
        h3.innerText = 'There is/are ' + errors + ' error(s) on the page:';
        h3.className = 'text-danger';
        var ul = document.createElement('ol');
        for (var i = 0; i < errors; i++) {
          var li = document.createElement('li');
          li.innerText = errorMessage[i];
          ul.appendChild(li);
        }
      }
      if (errors == 0) {
        var h3 = document.createElement('h3');
        h3.innerText = 'There are no errors, the button above will submit on click';
        h3.className = 'text-success';
        errorMsg.appendChild(h3);

        checkSpan
          .parentNode
          .replaceChild(submitButton, checkSpan);
      }

      errorMsg.appendChild(h3);
      errorMsg.appendChild(ul);

    }

    angular.bootstrap(document.body, ['bsr8']);
  }
})();
