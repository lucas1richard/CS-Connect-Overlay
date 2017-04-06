// This should be the only global variable
var thColor = 'rgb(235, 243, 249)';
var borderColor = '#d8e7f3';
var inptxtColor = '#000000';
inpBorderColor: '#f2f2f2';
var threed = false;

(function() {
  window.overlay = {
    changeCSSofAll,
    doToAll,
    formatAdvancedRecordSearch,
    formatAS11,
    formatNewComponentRecord,
    formatNewEntireDocumentRecord,
    formatSearch,
    formatSearchBallots,
    formatStaff,
    formatVCC,
    formatViewComponentBallot,
    formatViewMemberBallot,
    formatViewEntireDocumentRecord,
    saveBallotClosure,
  };
  overlay.set = function(attrName, attrVal) {
    overlay[attrName] = attrVal;
  };
  chrome.storage.sync.get({
    accessEnabled: false
  }, (/*access*/) => {
    // if (access.accessEnabled === false) {
    //   console.log('Access Not Enabled');
    // } else
    // {
      chrome.storage.sync.get({
        backgroundColor:  'rgb(235, 243, 249)',
        borderColor:      '#d8e7f3',
        inpBorderColor:   'gray',
        inpColor:         'white',
        inptxtColor:      'black',
        threed:           false,
        changeStyles:     true
      }, function(item) {
        overlay.generalCSSChanges(item);
      });

      if (window.location.href.search('index.cfm') > -1 ||
        document.querySelectorAll('[name=SearchCommitteePages]')[1] ||
        window.location.href.search('vcc.cfm') > -1 ||
        window.location.href.search('reports.cfm') > -1 ||
        window.location.href.search('News.cfm') > -1) {
        overlay.replaceNavBar();
      }
    // }
  });

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

  // Changes attributes of all elements with a specified attribute
  function doToAll(selector, obj) {
    var tmp = (selector instanceof HTMLElement) ? selector : document.querySelectorAll(selector);
    Object.keys(obj).forEach(key => {
      for (var i = tmp.length - 1; i >= 0; i--){
        tmp[i].setAttribute(key, obj[key]);
        if (obj[key] === 'remove') tmp[i].removeAttribute(key);
        if (key === 'parent' && obj[key] === 'removeFrom') tmp[i].parentElement.removeChild(tmp[i]);
      }
    });
  }

  function saveBallotClosure(type) {
      var ballotNum = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText || document.querySelector('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
      var committeeResponsible = document.querySelector('#CommitteeResponsibleField').firstElementChild.text;
      var closingRemarks = document.querySelector('textarea[name=ClosingRemarks]').value;
      if (!type) type = 'component';

      // Get recent ballots
      chrome.storage.local.get({ recentBallots: [] }, function(res) {
        for (var i = res.recentBallots.length - 1; i >= 0; i--) {
          if (res.recentBallots[i].ballotNum === ballotNum) {
            res.recentBallots.splice(i, 1);
          }
        }
        res.recentBallots.push({
          ballotNum:              ballotNum,
          ballotType:             type,
          closingRemarks:         closingRemarks,
          committeeResponsible:   committeeResponsible,
          date:                   new Date().toLocaleDateString(),
          href:                   window.location.href,
        });
        chrome.storage.local.set({ recentBallots: res.recentBallots }, function() {
          console.log('Recent Ballot Saved');
        });
      });
    }

  function changeCSSofAll(selector, obj) {
    var tmp = document.querySelectorAll(selector);
    Object.keys(obj).forEach(key => {
      for (var i = tmp.length - 1; i >= 0; i--){
        tmp[i].style[key] = obj[key];
      }
    });
  }

  function formatViewComponentBallot() {
    makePageSmall();
    $(document.getElementsByTagName('table')[0]).prepend(overlay.quickViewTool);

    var record = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText;
    setTimeout(function() {
      if (window.location.href.indexOf('SendReminder') !== -1) {
        chrome.storage.sync.get({remindersSent: []}, reminder => {
          for (var i = 0; i < reminder.remindersSent.length; i++) {
            console.log(reminder.remindersSent[i]);
            if (reminder.remindersSent[i] === record) {
              alert('Reminder was already sent today');
              return;
            }
          }
          document.querySelector('input[name=EmailReminder]').click();
          reminder.remindersSent.push(record);
          chrome.storage.sync.set({remindersSent: reminder.remindersSent}, function() {
            window.close();
          });
        });
      }
    }, 500);
  }

  function formatViewMemberBallot() {
    makePageSmall();
    $(document.getElementsByTagName('table')[0]).prepend(overlay.quickViewTool);

    var record = document.querySelector('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
    document.body.onload = function() {
      if (window.location.href.indexOf('SendReminder') !== -1) {
        chrome.storage.sync.get({remindersSent: []}, reminder => {
          for (var i = 0; i < reminder.remindersSent.length; i++) {
            if (reminder.remindersSent[i] === record) {
              alert('Reminder was already sent today');
              return;
            }
          }
          document.querySelector('input[name=EmailReminder]').click();
          reminder.remindersSent.push(record);
          chrome.storage.sync.set({remindersSent: reminder.remindersSent}, function() {
            window.close();
          });
        });
      }
    };
  }

  function AddAutoCompleteOption(value, text, TargetObject, maxSize, maximumNumberOfValues) {
    var found = false;
    var ObjectName = document.getElementById(TargetObject);

    if (maximumNumberOfValues === null || ObjectName.length < maximumNumberOfValues) {
      for (var i = 0; i < ObjectName.length; i++) {
        if (ObjectName.options[i].value === value) {
          found = true;
          break;
        } else {
          found = false;
        }
      }
      if (!found) {
        ObjectName.options[ObjectName.length] = new Option(text, value);
        ObjectName.options[i].selected = true;
        if (ObjectName.size < maxSize) ObjectName.size++;
      }
    }
  }

  function formatNewComponentRecord() {
    makePageSmall();

    var subType = document.querySelector('select');
    var str = document.getElementById('CommitteeResponsibleField').value;
    var boardOption = document.querySelector('option[value=' + str.slice(0, 3).concat('000000') + ']');

    subType.value = '2';
    document.querySelectorAll('select[name=Committee]')[1].style.backgroundColor = '#ffffe5';
    document.querySelectorAll('select[name=Committee]')[1].value = str.slice(0, 5).concat('0000');

    if (boardOption.text.search('Board') === -1) {

      ['100182214', 'N20090000', 'N20060000', 'N20100000', 'N20050000', 'N20110000', 'N20150000', 'N20120000'].forEach(ptcs => {
        if (str === ptcs) boardOption = document.querySelector('option[value=N10000000]');
      });

      ['N20070000', 'N20140000'].forEach(nuclear => {
        if (str === nuclear) boardOption = document.querySelector('option[value=O10000000]');
      });

    }

    boardOption.style.backgroundColor = '#ffffe5';
    AddAutoCompleteOption( boardOption.value, boardOption.text, 'txtCommittee', 10, null );
  }

  function countComments(unique, commentArray) {
    return commentArray.filter(comment => comment === unique).length;
  }

  function formatSearch() {
    var HomePageTables = document.querySelectorAll('.HomePage');

    addCSS(HomePageTables[0], { maxWidth: '8000px', minWidth: '800px', margin: 'auto' });
    addCSS(HomePageTables[1], { maxWidth: '1000px', minWidth: '800px', margin: 'auto' });
    addCSS(HomePageTables[2], { maxWidth: '1000px', minWidth: '800px', margin: 'auto' });

    document.querySelector('[name=QuickSearch]').setAttribute('action', 'SearchAction.cfm?QuickSearch=yes&NoToolbar=yes');
    document.querySelector('[name=AdvancedSearch]').setAttribute('action', 'SearchForm.cfm');
    document.querySelector('[name=SearchType]').children[0].selected = true;
    document.querySelector('[name=AdvancedSearchType]').children[0].selected = true;
    document.querySelector('select[name=Search]').children[2].selected = true;
    document.querySelector('[name=QuickSearchKeyword]').focus();

    if (window.location.href.search('Ballot') !== -1) {
      var str = window.location.href;
      str = str.substring(str.lastIndexOf('&Ballot=') + 8, str.length);
      document.querySelector('[name=QuickSearch]').setAttribute('action', 'NewBallotForm.cfm?Update=no&QuickSearch=yes&NoToolbar=yes&Ballot=' + str);
      document.querySelector('[name=QuickSearchKeyword]').value = str;
      document.querySelector('[name=Search]').click();
      setTimeout(window.close, 10);
    }
  }

  function formatVCC() {
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

  function formatAS11() {
    changeCSSofAll('.CommitteePage tr td', {padding: '0.5em' });
    doToAll('.CommitteePage tr td', {onmouseover: 'this.style.backgroundColor = "#f2f2f2"' });
    doToAll('.CommitteePage tr td', {onmouseleave: 'this.style.backgroundColor = "white"' });
    doToAll('td div', {style: 'remove' });
  }

  function formatStaff() {
    ['#ItemTypeID', '#AnsiBallotType', '[name=BallotType]'].forEach(function(selector) {
      document.querySelector(selector).firstElementChild.selected = true;
    });

    changeCSSofAll('.Homepage th', { textAlign: 'center' });
    appendShortList('#SelectedCommitteeResponsible');
  }

  function formatAdvancedRecordSearch() {
    var mainbody = document.querySelector('body > table:nth-child(2) > tbody > tr:nth-child(3) > td > form > table.SearchPage > tbody');
    addCSS(document.getElementById('CommitteeList'), { height: '300px', width: '100%' });
    for (var i = 0; i < mainbody.rows.length; i++) {
      if (mainbody.rows[i].children[2]) mainbody.rows[i].removeChild(mainbody.rows[i].children[2]);
      if (mainbody.rows[i].children[0]) mainbody.rows[i].children[0].style.textAlign = 'right';
    }
    mainbody.parentNode.className = 'table';
    addCSS(mainbody.parentNode, { margin: 'auto', maxWidth: '1200px' });
    appendShortList('#CommitteeList');
  }

  function formatSearchBallots() {
    if (window.location.href.search('Ballot=') === -1) return;
    if (document.querySelector('[type=Button]')) {
      doTheRest();
    } else {
      setTimeout(doTheRest, 500);
    }

    function doTheRest() {
      var str = document.querySelector('[type=Button]').getAttribute('onclick');
      var ballotnum = str.substring(str.lastIndexOf('BallotNumber') + 13, str.lastIndexOf('&BallotYearOpened'));
      var yearnum = str.substring(str.lastIndexOf('YearOpened=') + 11, str.lastIndexOf('&NoToolbar'));

      window.open('https://cstools.asme.org/csconnect/NewBallotForm.cfm?check=no&BallotNumber=' + ballotnum + '&BallotYearOpened=' + yearnum + '&NoToolbar=yes');
      setTimeout(function() {
        window.close();
      }, 10);
    }
  }

  function formatNewEntireDocumentRecord() {
    document.querySelector('#ItemDescription > tbody > tr:nth-child(6) > td:nth-child(1)').className = 'form form-inline';
  }

  function formatViewEntireDocumentRecord() {
    var reformatDiv = document.createElement('div');
    var updateBtn = document.createElement('button');
      updateBtn.className = 'btn btn-default btn-xs';
      updateBtn.innerText = 'Update Record';
      updateBtn.addEventListener('click',function() {
        var currentHref = window.location.href;
        currentHref = currentHref.replace('SearchAction', 'UpdateRecordForm');
        currentHref += '&Action=Update';
        window.location.href = currentHref;
      });
    reformatDiv.appendChild(updateBtn);
    document.querySelector('.pagehdg').appendChild(reformatDiv);
    $(document.getElementsByTagName('table')[0]).prepend(overlay.quickViewTool);
  }

  function showStat(stat, txt) {
    votingResultsArea.value += members[member][stat][0] + ' ' + txt + ' ';
    if (parseInt(members[member][stat][0]) > 0) votingResultsArea.value += '(' + members[member][stat][1] + ')';
    votingResultsArea.value += '\n';
  }
})();

function dateInput(numDays) {
  if (!numDays) numDays = 0;
  var day = new Date();
  var dat = new Date(day.valueOf());
  var addedDays = new Date(dat.setDate(dat.getDate() + numDays));

  var dd = '' + addedDays.getDate();
  var mm = addedDays.getMonth() + 1;

  if (dd < 10) dd = '0' + addedDays.getDate();
  if (mm < 10) mm = '0' + (addedDays.getMonth() + 1);

  return (mm + '/' + dd + '/' + addedDays.getFullYear());
}

function makePageSmall() {
  document.body.style.backgroundColor = '#f2f2f2';
  addCSS(document.querySelector('body > table'), {
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 8px',
    maxWidth: '1200px',
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function addCSS(element, cssObj) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (Array.isArray(element) && cssObj) {
    element.forEach(el => {
      Object.keys(cssObj).forEach(key => {
        el.style[key] = cssObj[key];
      });
    });
    return;
  }
  if (cssObj) {
    Object.keys(cssObj).forEach(key => {
      element.style[key] = cssObj[key];
    });
  }
}

function appendShortList(target) {
  if (!target) return;
  if (typeof target === 'string') target = document.querySelector(target);
  chrome.storage.sync.get({ committees: [] }, function(item) {

    var thisCommittee = document.getElementById('thisCommitteeResponsible');
    target.firstElementChild.innerText = '----------------------------------';
    target.firstElementChild.setAttribute('disabled', true);

    for (var j = item.committees.length - 1; j >= 0; j--) {
      var option = document.createElement('option');
      var indent = '';
      if (item.committees[j].indent) indent = '&nbsp; &nbsp; - ';
      option.value = item.committees[j].num;
      option.innerHTML = indent + item.committees[j].committee;
      $(target).prepend(option);
      if (thisCommittee) thisCommittee.value = item.committees[j].num;
    }

    target.firstElementChild.selected = true;
    var option = document.createElement('option');
      option.innerText = 'Select Committee:';
    $(target).prepend(option);

  });
}

function insertScript(actualCode) {
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}

function joinWithCommas(arr) {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  var tmp = arr.slice(0, arr.length - 1);
  return tmp.join(', ') + ' and ' + arr.slice(-1);
}

function addAngular(target, appName, appController) {
  if (typeof target === 'string') {
    target = document.querySelector(target);
  }
  if (target instanceof HTMLElement) {
    target.setAttribute('ng-app', appName);
    if (appController) {
      target.setAttribute('ng-controller', appController);
    }
  }
  angular.bootstrap(target, [appName]);
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
