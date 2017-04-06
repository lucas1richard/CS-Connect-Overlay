import { addCSS } from './utils';

export default function formatRecordSearchResults() {

  var results = document.querySelector('.ResultsPage').tBodies[0];

  if (!results) return;

  var { links, subjects, openRecords } = getRecords();

  // Handle storing records/subjects
  recordStorage();

  // Put up the 'button' to list open records
  var listOpenRecords = document.createElement('span');
      listOpenRecords.className = 'btn btn-primary btn-xs';
      listOpenRecords.innerText = 'List Open Records';
      listOpenRecords.addEventListener('click', makeList);

  var div = document.createElement('div');
      div.appendChild(listOpenRecords);
  document.querySelector('.pagehdg').appendChild(div);

  ////////////////////////////////////////////////////////////////////////////////////////

  function getRecords() { // Highlight record levels and make lists
    var links = [];
    var subjects = [];
    var openRecords = [];

    for (var i = 1; i < results.children.length; i++) {
      if (results.children[i].children[1]) {
        var level   = results.children[i].children[1];
        var link    = results.children[i].children[0].firstElementChild.firstElementChild;
        var subject = results.children[i].children[2].innerText;
        var [ num, year ] = link.value.split('-');

        // Highlight the record level
        var lvlStyle = {fontWeight: 'bold'};
        if (level.innerText.search('Board') > -1 || level.innerText.search('Issued') > -1) {
          lvlStyle.color = '#1aa3ff';
        } else if (level.innerText.search('Approved') > -1) {
          lvlStyle.color = 'red';
        } else if (level.innerText.search('Closed') > -1) {
          lvlStyle = {};
          lvlStyle.color = 'gray';
        }

        addCSS(level, lvlStyle);

        // Keep a separate list of records/subjects which are at Proposal level
        if (level.innerText.search('Proposal') !== -1) {
          openRecords.push({
            href: `https://cstools.asme.org/csconnect/SearchAction.cfm?TrackingNumber=${num}&YearOpened=${year}&NoToolbar=yes`,
            record: link.value,
            subject,
          });
        }
        links.push(link.value);
        subjects.push(subject);
      }
    }
    return {
      links,
      subjects,
      openRecords
    };
  } // End getRecords()

  function makeList() { // This is called from clicking the 'List Open Records' button
    var res = document.querySelector('.ResultsPage').tBodies[0];
    var parent = res.parentNode;

    parent.removeChild(res);

    if (!res) return;

    openRecords.forEach(openrecord => {
      var anchor = document.createElement('a');
      var recorddiv = document.createElement('div');
      var subjNode = document.createTextNode(openrecord.subject);

      anchor.innerText = openrecord.record;
      anchor.href = openrecord.href;
      anchor.target = '_blank';

      addCSS(anchor, {
        display: 'inline-block',
        fontWeight: 'bold',
        width: '80px',
      });

      recorddiv.style.height = '2em';
      recorddiv.appendChild(anchor);
      recorddiv.appendChild(subjNode);

      parent.appendChild(recorddiv);
    });
  } // End makeList()

  function recordStorage() { // Handle storing records/subjects
    chrome.storage.local.get({ allrecords: {} }, ({ allrecords }) => {
      // Delete record subjects that were added more than 14 days ago
      for (let records in allrecords) {
        if (!allrecords.hasOwnProperty(records)) continue;
        if (Math.floor((new Date(allrecords[records].date) - new Date()) / 86400000) <= -14) {
          delete allrecords[records];
        }
      }
      // Update the record subjects in memory
      links.forEach((link, ind) => {
        allrecords[link] = { subject: subjects[ind], date: new Date().toLocaleDateString()};
      });

      chrome.storage.local.set({ allrecords }, function() {});
    });
  }
} // End formatRecordSearchResults()

