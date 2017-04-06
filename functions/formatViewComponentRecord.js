import $ from 'jquery';
import { addCSS, doToAll, joinWithCommas, makePageSmall, onlyUnique, quickViewTool } from './utils';

/*

This function does the following:

0. Check if the record is published (only if href includes 'CheckPublished')
1. Reformat the Page
2. Save the record Subject
3. Alert Staff to Duplicate Responses
4. Add Options for Staff Use
  a. Contact the Project Manager
  b. Reformat for inclusion in the Agenda
  c. Move to a new page for updating the record

*/


export default function formatViewComponentRecord() {

// Check if the record is published (only if href includes 'CheckPublished')
  window.onload = function() {
    if (window.location.href.indexOf('CheckPublished') > -1) {
      if (document.querySelector('#PublicationsLevel > tbody > tr:nth-child(4) > td:nth-child(2)') || document.querySelector('#ANSILevel > tbody > tr:nth-child(2) > td:nth-child(2)')) {
        var recordNum = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
        var [ year, num ] = recordNum.split('-');
        window.open(`UpdateRecordForm.cfm?Action=Update&TrackingNumber=${num}&YearOpened=${year}&NoToolbar=yes&CheckPublished=yes`);
        window.close();
      } else {
        window.close();
      }
    }
  };

  // Reformat the Page
  makePageSmall();

  chrome.storage.sync.get({ userInfo: false }, function(item) {
    var record = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
    var subject = document.querySelector('#ItemDescription > tbody > tr:nth-child(2) > td').innerText;
    var proposal = document.querySelector('#ItemDescription > tbody > tr:nth-child(4) > td').innerText;
    var explanation = document.querySelector('#ItemDescription > tbody > tr:nth-child(6) > td').innerText;
    var changes = document.querySelector('#ItemDescription > tbody > tr:nth-child(8) > td').innerText;


    var numComments = 0;

    // Save the record subject
    chrome.storage.local.get({allrecords: {}}, function(ar) {
      ar.allrecords[record] = {subject: subject, date: new Date().toLocaleDateString()};
      chrome.storage.local.set({allrecords: ar.allrecords}, function() {});
    });

    // Create the selection bar for staff options
    var staffSelect = (function() {
      var select = document.createElement('select');
          select.className = 'form-control';
          select.style.lineHeight = '1.5em';
      var defaultOpt = document.createElement('option');
          defaultOpt.innerText = 'Staff Select:';

      select.appendChild(defaultOpt);

      var options = [
        {txt: '----------------------', val: '', disabled: true},
        {txt: 'Contact Project Manager', val: 'ContactTPM'},
        {txt: 'Format for Agenda', val: 'Format for Agenda'},
        {txt: 'Update Record', val: 'UpdateRecord'},
      ];

      for (var i = 0; i < options.length; i++) {
        var opt = document.createElement('option');
            opt.innerText = options[i].txt;
            opt.value = options[i].val;

        if (options[i].disabled) opt.setAttribute('disabled', true);
        select.appendChild(opt);
      }

      select.addEventListener('change', function() {
        if (select.value === 'Format for Agenda') reformatForAgenda();
        if (select.value === 'ContactTPM') window.location.href = generateEmailHref();
        if (select.value === 'UpdateRecord') {
          var currentHref = window.location.href;
              currentHref = currentHref.replace('SearchAction', 'UpdateRecordForm');
              currentHref += '&Action=Update';
          window.location.href = currentHref;
        }
      });

      return select;
    })();


    var reformatDiv = document.createElement('div');
        reformatDiv.className = 'form-inline';
        reformatDiv.appendChild(staffSelect);
    document.querySelector('.pagehdg').appendChild(reformatDiv);
    $(document.getElementsByTagName('table')[0]).prepend(quickViewTool());


    // Replace the TPM email address with a link
    var emailDiv = document.querySelector('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(3)');
    var email = emailDiv.innerText;
        emailDiv.innerText = '';
    var replacementEmailLink = (function() {
      var lnk = document.createElement('a');
        lnk.target = '_top';
        lnk.innerText = email;
        lnk.href = generateEmailHref();

        return lnk;
    })();
    emailDiv.appendChild(replacementEmailLink);


    // Get all responses, and count up the number of comments
    var responses = (function() {
      var res = [];
      var commentsTable = document.querySelector('#LatestBallot > tbody > tr > td');
      var commentsLength = commentsTable.children.length;

      for (var i = 8; i < commentsLength; i++) {
        var row = commentsTable.children[i].tBodies[0].firstElementChild;
        if (row.children[0]) {
          numComments++;
        }
        if (row.children[1].children[1]) {
          res.push(row.children[1].children[1].innerText.split('\n')[2]);
        }
      }
      return res;
    })();
    var uniqueComments = responses.filter(onlyUnique);

    // This is the notification message for duplicate comment responses
    var duplicateResponseMessage = (function() {
      var msg = document.createElement('div');
          addCSS(msg, {color: 'red', fontWeight: 'bold'});
          msg.innerText = 'There are duplicate comment responses';
      return msg;
    })();
    // Display notification to staff if there are duplicate comment responses
    if (uniqueComments.length < responses.length) {
      document.querySelector('.pagehdg').appendChild(duplicateResponseMessage);
    }

    function generateEmailHref() {

      subject = subject.replace(/\n/g, '').replace(/&/g, '%26');
      record = record.replace(/\n/g, '');
      proposal = proposal.replace(/\n/g, '');
      explanation = explanation.replace(/\n/g, '');
      changes = changes.replace(/\n/g, '');
      var tpm = document.querySelector('#ProjectManagerLevel > tbody > tr:nth-child(2) > td > div:nth-child(2)').innerText.split(', ')[0];
      var toWrite = '';
      if (responses) {
        if (numComments > responses.length) {
          const [ year, num ] = record.split('-');
          toWrite += `Please respond to comments on record ${record}. You can respond to comments at the following link%3A%0D%0A
          https://cstools.asme.org/csconnect/PostResponse.cfm?Action=Update&TrackingNumber=${num}&YearOpened=${year}&NoToolbar=yes`;
          var addLine = true;
        }
      }

      if (addLine) toWrite += '%0D%0A%0D%0A';

      const allIssues = getIssues();
      if (allIssues.length) {
        toWrite += `Please add a ${joinWithCommas(allIssues)}`;

        const [ year, num ] = record.split('-');
        toWrite += ` to record ${record}%2E You can update the record at the following link%3A%0D%0Ahttps://cstools.asme.org/csconnect/UpdateRecordForm.cfm?Action=Update&TrackingNumber=${num}&YearOpened=${year}&NoToolbar=yes`;
      }

      toWrite = toWrite.replace(/'?'/g, '%3F').replace(/&/g, '%26');

      if (item.userInfo) {
        return `mailto:${email}?Subject=ASME%20Record%20${record}:%20${subject}&body=Dear%20Mr.%20${tpm},%0D%0A%0D%0A${toWrite}%0D%0A%0D%0AThank you,%0D%0A${item.userInfo.firstName} ${item.userInfo.lastName}`;
      } else {
        return `mailto:${email}?Subject=ASME%20Record%20${record}:%20${subject}&body=Dear%20Mr.%20${tpm},%0D%0A%0D%0A%${toWrite}0D%0A%0D%0AThank you,`;
      }

      function getIssues() {
        var issues = [];

        if (checkForIssues(subject)) issues.push('Subject');
        if (checkForIssues(proposal)) issues.push('Proposal');
        if (checkForIssues(explanation)) issues.push('Explanation');
        if (checkForIssues(changes)) issues.push('Summary of Changes');

        return issues;
      }

      function checkForIssues(str) {
        // This returns true is there is an issue
        str = str.replace(/\n/g, '').replace(/\t/g, ' ').toLowerCase();
        var searchTerms = ['tbd', 'to be decided', 'to be entered', 'none', 'to be added', 'to be provided'];

        for (var i = 0; i < searchTerms.length; i++) {
          if (str.search(searchTerms[i]) > -1) return true;
        }

        if (str.length < 1) {
          return true;
        }
        return false;

      }
    }


    function reformatForAgenda() {
      var publishTable = document.getElementById('PublicationsLevel');
      var ansiLevel = document.getElementsByName('ANSILevel')[document.getElementsByName('ANSILevel').length - 1];
      var staffAccess = document.querySelector('#StaffAccessrmation');

      if (publishTable.tBodies[0].firstElementChild.firstElementChild.innerText.indexOf('available at this time') > -1) {
        publishTable.parentElement.removeChild(publishTable);
      }
      if (ansiLevel.tBodies[0]) {
        if (ansiLevel.tBodies[0].firstElementChild.firstElementChild.innerText.indexOf('available at this time') > -1) {
          ansiLevel.parentElement.removeChild(ansiLevel);
        }
      }

      // Get rid of a lot of fluff
      (function() {
        doToAll('.Description, #EditorLevel, [name=AdditionalBPVInformation], [name=AdditionalBPVSubcommitteeInformation]', {class: 'hidden'});
        ['#SubcommitteeLevel', '#ProjectManagerLevel', '#FileAttachmentsLevel', staffAccess, '#ItemDescription'].forEach(removeNones);
        doToAll('input, button, p', {class: 'hidden'});
        doToAll('[style]', {style: 'remove'});
        doToAll('[bordercolor]', {bordercolor: 'remove'});
        doToAll('th', {style: 'background-color:white; color:black; border:1px solid white;'});
        doToAll('#BallotHistory', {parent: 'removeFrom'});
        doToAll('body > table > tbody > tr:nth-child(2) > td > table:nth-child(8)', {parent: 'removeFrom'});

        var tmp = 'body > table > tbody > ';
        document.querySelector(tmp + 'tr:nth-child(1) > td > table:nth-child(8)').setAttribute('class', 'hidden');
        document.querySelector(tmp + 'tr:nth-child(1) > td > table:nth-child(11)').setAttribute('class', 'hidden');
        document.querySelector(tmp + 'tr:nth-child(2) > td > div').setAttribute('class', 'hidden');
        document.querySelector(tmp + 'tr:nth-child(2) > td > table:nth-child(4)').setAttribute('class', 'hidden');
        document.querySelector(tmp + 'tr:nth-child(2) > td > table.DetailPage > tbody > tr > td > table:nth-child(15)').setAttribute('class', 'hidden');

        for (var i = 2; i < 10; i++) {
          staffAccess.rows[i].setAttribute('class', 'hidden');
        }
        var staffNotes = document.querySelector('body > table > tbody > tr:nth-child(2) > td > table.DetailPage > tbody > tr > td > table:nth-child(13) > tbody > tr:nth-child(4) > td');
        if (staffNotes.innerText.indexOf('None') !== -1) {
          staffNotes.parentElement.previousElementSibling.setAttribute('class', 'hidden');
          staffNotes.parentElement.setAttribute('class', 'hidden');
        }
        doToAll('br', {parent: 'removeFrom'});
        doToAll('body > table > tbody > tr:nth-child(2) > td > table:nth-child(7)', {parent: 'removeFrom'});
      })();

      // Replace the record plain text with a link
      var theRecord = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)');
      var recordLink = document.createElement('a');
      recordLink.href = window.location.href;
      recordLink.innerText = theRecord.innerText;

      while (theRecord.firstChild) {
        theRecord.removeChild(theRecord.firstChild);
      }

      theRecord.appendChild(recordLink);

      document.querySelectorAll('th').forEach(th => {
        th.innerText = th.innerText.split('. ')[1];
      });

      addCSS(document.body, {margin: 'auto', width: '850px'});
    }

  });
}

function removeNones(TableSelector) {
  var Table;

  if (TableSelector instanceof HTMLElement) {
    Table = TableSelector;
  } else {
    Table = document.querySelector(TableSelector);
  }
  for (var i = 1; i < Table.rows.length; i += 2){
    if (Table.rows[i].firstElementChild.innerText.toLowerCase().indexOf('none') > -1) {
      Table.rows[i].setAttribute('class', 'hidden');
      Table.rows[i - 1].setAttribute('class', 'hidden');
    }
  }
}
