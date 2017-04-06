(function() {

  angular
    .module('agenda', ['services']);

  angular
    .module('agenda')
    .controller('agendaCtrl', agendaCtrl)
    .config(function($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    });

  agendaCtrl.$inject = ['$scope', '$http', 'getJSON', '$timeout'];
  function agendaCtrl($scope, $http, getJSON, $timeout) {

    var vm = $scope;
    window.sc = $scope;
    var tmp = document.getElementById('tmp');

    Object.assign(vm, {
      allCommittees: [],
      complete,
      createEmail,
      committee: '',
      disabled: false,
      fetchRecord,
      getRecentBallots,
      includedRecords: { component: [], codecase: [], entiredoc: [], interpretation: [] },
      projectManagers: [],
      remove,
      searchRecord: '',
      meetingDate: '',
      monthYear,
      saveForParsing,
      selectedcommittee: {num: '', committee: ''},
      userEmail: '',
      userName: '',
      userPhone: '',
    });

    vm.recdirectivetools =  { meetingDate: vm.meetingDate, remove, monthYear };

    activate();

    ///////////////////////////////////////////////////////////////////////////////////////////////

    function activate() {
      chrome.storage.sync.get({ userInfo: false}, ({ userInfo }) => {
        if (userInfo) {
          vm.userName = userInfo.firstName + ' ' + userInfo.lastName;
          vm.userEmail = userInfo.email;
          vm.userPhone = userInfo.phone;
        }
      });
      return getJSON.getCommittees()
        .then(committees => {
          vm.allCommittees = committees;
          return vm.allCommittees;
        });
    }

    function checkForIssues(str) {
      // This returns true is there is an issue
      str = textOf(str, true);
      str = str.toLowerCase();

      ['tbd', 'to be decided', 'to be entered', 'none', 'to be added', 'nothing']
        .forEach(term => {
          if (str.search(term) > -1) return true;
        });

      return !str.length;
    }

    function complete(com) {
      vm.selectedcommittee = com;
      vm.committee = '';
    }

    function convertToEmail(msg) {
      var out = msg.replace(/\n/g, '%0D');
          out = out.replace(/\?/g, '%3F');
          out = out.replace(/\(/g, '%28');
          out = out.replace(/\)/g, '%29');
          out = out.replace(/\*/g, '%2A');
          out = out.replace(/\+/g, '%2B');
          out = out.replace(/,/g, '%2C');
          out = out.replace(/-/g, '%2D');
          out = out.replace(/\./g, '%2E');
          out = out.replace(/:/g, '%3A');
          out = out.replace(/;/g, '%3B');
          out = out.replace(/ /g,  '%20');

      [
        ['!', '%21'], ['\'', '%22'], ['#', '%23'], ['&', '%26'], ['\'', '%27']
      ].forEach(code => {
        var regex = new RegExp(code[0], 'g');
        out = out.replace(regex, code[1]);
      });
      return out;
    }

    function createEmail({ tpmemail }) {
      var out = 'mailto:' + tpmemail;
          // out += '?subject=' + convertToEmail('ASME record ' + r.record + ' - ' + r.subject);
          // out += '&body=' + convertToEmail('Dear Project Manager,\n\n' + 'Record ' + r.record + ' was discussed at the most recent meeting of the ' + vm.selectedcommittee.committee + '. ' + r.notes + '\n\n' + vm.userName + '\n' + vm.userEmail + '\n' + vm.userPhone);
      return out;
    }

    function displayError(error) {
      vm.error = error;
      $timeout(function() {
        vm.error = '';
      }, 40 * error.length);
    }

    function displaySuccess(success) {
      vm.success = success;
      $timeout(function() {
        vm.success = '';
      }, 1000);
    }

    function fetchRecord(ev, record) {
      if (ev.keyCode === 13) {
        // Make sure the record is not already included
        for (var i = 0; i < vm.includedRecords.component.length; i++) {
          if (vm.includedRecords.component[i].record === vm.searchRecord) {
            displayError('This record has already been included');
            return;
          }
        }

        vm.disabled = true;

        var csconnect = (function() {
          const [ year, num ] = record.split('-');
          return `https://cstools.asme.org/csconnect/SearchAction.cfm?TrackingNumber=${num}&YearOpened=${year}&NoToolbar=yes`;
        })();
        $http.get(csconnect).then(({ data }) => {
          tmp.innerHTML = data;

          var styles = document.querySelectorAll('style');
          while (styles[0]) {
            styles[0].parentNode.removeChild(styles[0]);
            delete styles[0];
            styles = document.querySelectorAll('style');
          }

          if (!document.querySelector('.pagehdg')) {
            vm.disabled = false;
            displayError('No such record');
            return;
          }
          var pagehdg = textOf('.pagehdg');
          if (pagehdg.search('Error') > -1) {
            vm.disabled = false;
            displayError('No such record');
            return;
          }

          if (pagehdg.search('Component') > -1) {
                handleComponent();
                vm.searchRecord = '';
                vm.disabled = false;
          } else if (pagehdg.search('Interpretation') > -1) {
                handleInterp();
                vm.searchRecord = '';
                vm.disabled = false;
          } else if (pagehdg.search('Code Case') > -1) {
                handleCodeCase();
                vm.searchRecord = '';
                vm.disabled = false;
          } else if (pagehdg.search('Entire Document') > -1) {
                handleEntireDocument();
                vm.searchRecord = '';
                vm.disabled = false;
          } else {
                displayError('The record type is not supported. Please email lucasr@asme.org to request an update in regards to this record type.');
                vm.disabled = false;
          }
        });
      }
    }

    function getRecentBallots(x) {
      if (x.ballot) {
        if (typeof x.ballot.dateclosed === 'string') x.ballot.dateclosed = new Date(x.ballot.dateclosed);
        if (x.ballot.dateclosed > vm.prevMeetingDate || x.ballot.status.search('Pending') > -1) {
          return true;
        }
      }
      return false;
    }

    function getBallotInfo() {
      if (document.querySelector('#LatestBallot > tbody > tr > td > div:nth-child(1) > input')) {
        var ballotlevel =   textOf('#LatestBallot > tbody > tr > td > div:nth-child(2)').split(': ')[1];
        var ballotstatus =  textOf('#LatestBallot > tbody > tr > td > div:nth-child(3)').split(': ')[1];
        var ballotclosed =  textOf('#LatestBallot > tbody > tr > td > div:nth-child(5)').split(':')[1];
        var ballotNum =     document.querySelector('#LatestBallot > tbody > tr > td > div:nth-child(1) > input').value;
        return {
          level:        `${ballotNum} - ${ballotlevel}`,
          status:       ballotstatus,
          dateclosed:   ballotclosed
        };
      } else {
        return false;
      }
    }

    function getBallotResponses() {
      var commentsTable =   document.querySelector('#LatestBallot > tbody > tr > td');
      var commentsLength =  commentsTable.children.length;
      var numComments =     0;
      var responses =       [];

      for (var i = 8; i < commentsLength; i++) {
        var row = commentsTable.children[i].tBodies[0].firstElementChild;
        if (row.children[0]) {
          numComments++;
        }
        if (row.children[1].children[1]) {
          responses.push(row.children[1].children[1].innerText.split('\n')[2]);
        }
      }
      return [numComments, responses];
    }

    function handleCodeCase() {
      var ballot =          getBallotInfo();
      var ballotResponses = getBallotResponses();
      var explanation =     textOf('#ItemDescription > tbody > tr:nth-child(6) > td');
      var fieldsToUpdate =  [];
      var level =           textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(3)')
        .replace('SC', 'Subcommittee')
        .replace('Stds', 'Standards')
        .replace(' Comm ', ' Committee ');
      var notes =           '';
      var numComments =     ballotResponses[0];
      var proposal =        textOf('#ItemDescription > tbody > tr:nth-child(4) > td');
      var responses =       ballotResponses[1];
      var subject =         textOf('#ItemDescription > tbody > tr:nth-child(2) > td');
      var tpm =             textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(2)');
      var tpmemail =        textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(3)');
      var updated =         textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(3)');
      var projectTeam =     textOf('#SubcommitteeLevel > tbody > tr:nth-child(4) > td:nth-child(2)');

      if (checkForIssues(projectTeam)) projectTeam = false;

      if (updated.length < 5) {
        updated = textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(1)');
      }

      if (level === 'Board Approved') {
        vm.disabled = false;
        displayError('This item is Board approved, it will not be included');
        return;
      }

      // Check if there is a proposal file
      if (document.querySelector('#FileAttachmentsLevel > tbody > tr:nth-child(2) > td > a')) {
        var proposalFile = 'https://cstools.asme.org/csconnect/' + document.querySelector('#FileAttachmentsLevel > tbody > tr:nth-child(2) > td > a').getAttribute('href');
      } else {
        proposalFile = false;
      }

      // Get all responses, and count up the number of comments
      if (numComments > responses.length) {
        notes += 'Comments on the latest ballot need responses. ';
      }

      if (checkForIssues(explanation)) fieldsToUpdate.push('Explanation');
      if (checkForIssues(proposal))    fieldsToUpdate.push('Proposal');

      if (fieldsToUpdate.length > 0) {
        notes += 'The ' + joinWithCommas(fieldsToUpdate) + ' field should be updated.';
      }

      var dataObj = {
        record: vm.searchRecord,
        subject,
        proposal,
        explanation,
        tpm,
        projectTeam,
        tpmemail,
        level,
        updated,
        ballot,
        proposalFile,
        type: 'codecase'
      };

      displaySuccess('Code Case Record added');

      vm.includedRecords.codecase.push(dataObj);

      var makeNew = true;
      for (var i = 0; i < vm.projectManagers.length; i++) {
        if (vm.projectManagers[i].name === tpm) {
          vm.projectManagers[i].numRecords++;
          makeNew = false;
        }
      }
      if (makeNew) {
        vm.projectManagers.push({ name: tpm, numRecords: 1 });
      }
    }

    function handleComponent() {
      var ballot =            getBallotInfo();
      var ballotResponses =   getBallotResponses();
      var explanation =       textOf('#ItemDescription > tbody > tr:nth-child(6) > td');
      var level =             textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(3)')
        .replace('SC', 'Subcommittee')
        .replace('Stds', 'Standards')
        .replace(' Comm ', ' Committee ')
        .replace('Blt', 'Ballot');
      var notes =             '';
      var numComments =       ballotResponses[0];
      var makeNew =           true;
      var proposal =          textOf('#ItemDescription > tbody > tr:nth-child(4) > td');
      var responses =         ballotResponses[1];
      var subject =           textOf('#ItemDescription > tbody > tr:nth-child(2) > td');
      var summaryofchanges =  textOf('#ItemDescription > tbody > tr:nth-child(8) > td');
      var tpm =               textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(2)');
      var tpmemail =          textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(3)');
      var history =           document.querySelector('#SubcommitteeLevel > tbody > tr:nth-child(6) > td').innerText.split('\n').filter(onlyUnique);
      var updated =           textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(3)');
      var projectTeam =       textOf('#SubcommitteeLevel > tbody > tr:nth-child(4) > td:nth-child(2)');

      if (checkForIssues(projectTeam)) projectTeam = false;

      if (updated.length < 5) {
        updated = textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(1)');
      }

      if (level === 'Board Approved') {
        vm.disabled = false;
        displayError('This item is Board approved, it will not be included');
        return;
      }

      // Get all responses, and count up the number of comments
      if (numComments > responses.length) {
        notes += 'Comments on the latest ballot need responses. ';
      }
      var fieldsToUpdate = [];

      if (checkForIssues(explanation)) {
        fieldsToUpdate.push('Explanation');
        explanation = '';
      }
      if (checkForIssues(summaryofchanges))  fieldsToUpdate.push('Summary of Changes');
      if (checkForIssues(proposal))          fieldsToUpdate.push('Proposal');

      if (fieldsToUpdate.length > 0) {
        notes += 'The ' + joinWithCommas(fieldsToUpdate) + ' field should be updated.';
      }

      // Check if there is a proposal file
      if (document.querySelector('#FileAttachmentsLevel > tbody > tr:nth-child(2) > td > a')) {
        var proposalFile = 'https://cstools.asme.org/csconnect/' + document.querySelector('#FileAttachmentsLevel > tbody > tr:nth-child(2) > td > a').getAttribute('href');
      } else {
        proposalFile = false;
      }

      displaySuccess('Revision Record added');

      vm.includedRecords.component.push({
        ballot,
        explanation,
        history,
        level,
        notes,
        projectTeam,
        proposalFile,
        record: vm.searchRecord,
        subject,
        tpm,
        tpmemail,
        updated,
        type: 'component'
      });

      for (var i = 0; i < vm.projectManagers.length; i++) {
        if (vm.projectManagers[i].name === tpm) {
          vm.projectManagers[i].numRecords++;
          makeNew = false;
          break;
        }
      }
      if (makeNew) {
        vm.projectManagers.push({ name: tpm, numRecords: 1 });
      }
    }

    function handleEntireDocument() {
      var ballot =          getBallotInfo();
      var ballotResponses = getBallotResponses();
      var level =           textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(3)')
        .replace('SC', 'Subcommittee')
        .replace('Stds', 'Standards')
        .replace(' Comm ', ' Committee ');
      var projectIntent =   textOf('#ItemDescription > tbody > tr:nth-child(2) > td');
      var supercedes =      textOf('#ItemDescription > tbody > tr:nth-child(4) > td');
      var standardTitle =   textOf('#ItemDescription > tbody > tr:nth-child(6) > td:nth-child(2)');
      var numComments =     ballotResponses[0];
      var responses =       ballotResponses[1];
      var tpm =             textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(2)');
      var updated =         textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(3)');

      if (updated.length < 5) {
        updated = textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(1)');
      }
      var notes = '';

      if (numComments > responses.length) {
        notes += 'Comments on the latest ballot need responses. ';
      }

      vm.includedRecords.entiredoc.push({
        ballot,
        intent: projectIntent,
        level,
        notes,
        record: vm.searchRecord,
        supercedes,
        title: standardTitle,
        tpm,
        updated,
        type: 'entiredoc'
      });

      displaySuccess('Entire Document Record added');

      var makeNew = true;

      for (var i = 0; i < vm.projectManagers.length; i++) {
        if (vm.projectManagers[i].name === tpm) {
          vm.projectManagers[i].numRecords++;
          makeNew = false;
        }
      }
      if (makeNew) {
        vm.projectManagers.push({name: tpm, numRecords: 1});
      }
    } // end handleEntireDocument()

    function handleInterp() {
      var level = textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(3)')
        .replace('SC', 'Subcommittee')
        .replace('Stds', 'Standards')
        .replace(' Comm ', ' Committee ');
      if (level === 'Item Closed') {
        displayError('Item level is closed. This record will not be included');
        return;
      }
      if (level === 'Issued') {
        displayError('This interpretation has been issued. This record will not be included');
        return;
      }

      // var committee = textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(2)');

      var itemRows = document.getElementById('ItemDescription').rows;
      var standardInfo = itemRows[1].firstElementChild.firstElementChild.rows;
      var edition = standardInfo[1].children[1].innerText;
      // var established = textOf('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(1)');
      var makeNew = true;
      var standard = standardInfo[1].children[0].innerText;
      // var originalInquiry = textOf('#InquirerInformation > tbody > tr:nth-child(20) > td');
      var para = textOf('#ItemDescription > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(3)');
      // var paragraph = standardInfo[1].children[2].innerText;
      var propQA = textOf('#InquirerInformation > tbody > tr:nth-child(20) > td') + '\n' + textOf('#InquirerInformation > tbody > tr:nth-child(22) > td');
      var QA = itemRows[3].children[0].innerText;
      // var record = textOf('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)');
      var subject = standardInfo[3].children[0].innerText;
      var tpm = textOf('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(2)');

      var dataObj = {
        level:        level,
        paragraph:    para,
        record:       vm.searchRecord,
        standard:     `${standard}-${edition}`,
        subject:      subject,
        tpm:          tpm,
        type:         'interpretation'
      };

      if (checkForIssues(QA)) {
        dataObj.question = propQA;
        dataObj.originalQ = true;
      } else {
        dataObj.question = QA;
      }

      displaySuccess('Interpretation Record added');

      vm.includedRecords.interpretation.push(dataObj);

      for (var i = 0; i < vm.projectManagers.length; i++) {
        if (vm.projectManagers[i].name === tpm) {
          vm.projectManagers[i].numRecords++;
          makeNew = false;
        }
      }
      if (makeNew) {
        vm.projectManagers.push({name: tpm, numRecords: 1});
      }
    } // end handleInterp()

    function joinWithCommas(arr) {
      if (arr.length === 0) return '';
      if (arr.length === 1) return arr[0];
      return arr.slice(0, arr.length - 1).join(', ') + ' and ' + arr.slice(-1);
    }

    function monthYear(dateObj, day) {
      if (!dateObj) return false;
      if (typeof dateObj == 'string') {
        dateObj = dateObj.replace('T', ' ').replace('Z', '');
        dateObj = new Date(dateObj);
      }

      if (dateObj === 'Invalid Date') return 'Invalid Date';

      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      if (day === true) {
        return dateObj.getDate() + ' ' + months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
      }

      return months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function remove(data, type) {
      for (var i = 0; i < vm.projectManagers.length; i++) {
        if (vm.projectManagers[i].name === data.tpm) {
          vm.projectManagers[i].numRecords--;
          if (vm.projectManagers[i].numRecords === 0) {
            vm.projectManagers.splice(i, 1);
          }
          break;
        }
      }
      var ind = vm.includedRecords[type].indexOf(data);
      vm.includedRecords[type].splice(ind, 1);
    }

    function textOf(selector, str) {
      if (typeof selector !== 'string') {
        console.error('Selector must be a string; ' + typeof selector + ' received');
        return;
      }

      var out;

      if (!str) {
        if (!document.querySelector(selector)) {
          console.error('Could not find the element corresponding to ' + selector);
          return;
        }
        out = document.querySelector(selector).innerText;
      } else {
        out = selector;
      }

      return out
        .replace(/\t/g, '')
        .replace(/\n/g, ' ')
        .replace(/[ ][ ]/g, ' ')
        .trim();
    } // end textOf()

    function saveForParsing() {
      if (!vm.selectedcommittee.num.length) {
        displayError('Committee must be selected');
        return;
      }
      if (isNaN(new Date(vm.meetingDate).getTime())) {
        displayError('Meeting date must be set');
        return;
      }
      let numRecords = 0;
      Object.keys(vm.includedRecords).forEach(key => {
        numRecords += vm.includedRecords[key].length;
      });
      if (!numRecords) {
        displayError('There are no records on this Agenda');
        return;
      }
      var toSave = {
        committee: vm.selectedcommittee,
        meetingDate: monthYear(vm.meetingDate),
        includedRecords: vm.includedRecords
      };

      chrome.storage.local.get({ agendas: [] }, ({ agendas }) => {
        // Don't allow duplicate data
        agendas = agendas.filter(agenda => agenda.committee.num === toSave.committee.num && monthYear(agenda.meetingDate) === monthYear(toSave.meetingDate));
        agendas.push(toSave);
        chrome.storage.local.set({ agendas }, function() { displaySuccess('Data saved'); });
      });
    }
  }
  angular
    .module('agenda')
    .directive('focusMe', function($timeout, $parse) {
      return {
        link: function(scope, element, attrs) {
          var model = $parse(attrs.focusMe);
          scope.$watch(model, function(value) {
            if (value === true) {
              $timeout(function() {
                element[0].focus();
              });
            }
          });
        }
      };
    });
})();
