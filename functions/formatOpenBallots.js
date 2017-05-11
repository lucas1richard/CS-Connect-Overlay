import { addCSS, doToAll } from './utils';

export default function formatOpenBallots() {

  var ballotsTable = document.querySelector('.HomePage');
  var labelType = {
    Membership: 'label label-danger',
    Component: 'label label-primary',
    Interpretation: 'label label-default',
    'Board Procedural': 'label label-success'
  };

  for (var i = 4; i < ballotsTable.rows.length; i++) {
    if (ballotsTable.rows[i].children[1]) {
      var actionsTD = ballotsTable.rows[i].children[1];

      if (actionsTD.children[0]) actionsTD.children[0].firstElementChild.style.fontWeight = 'bold';
      if (actionsTD.children[1]) actionsTD.children[1].firstElementChild.style.fontSize = '8px';
      if (actionsTD.children[2]) actionsTD.children[2].firstElementChild.style.fontSize = '8px';

      var ballotType = ballotsTable.rows[i].children[4].innerText;
      ballotType = ballotType.replace(/\n/g, '');

      ballotsTable.rows[i].children[4].style.fontSize = '10pt';

      if (labelType[ballotType] && ballotsTable.rows[i].children[4].firstElementChild) {
        ballotsTable.rows[i].children[4].firstElementChild.className = labelType[ballotType];
      }
      if (ballotsTable.rows[i].querySelectorAll('td')[6]) {
        ballotsTable.rows[i].removeChild(ballotsTable.rows[i].querySelectorAll('td')[6]);
      }
      if (ballotsTable.rows[i].querySelectorAll('th')[6]) {
        ballotsTable.rows[i].removeChild(ballotsTable.rows[i].querySelectorAll('th')[6]);
      }

      var tableMods = {};

      // Check closing date and highlight if ballot should close
      if (checkClosure(ballotsTable.rows[i].children[5].innerText)) {
        tableMods = {
          title:  'Due to Close',
          css:    'color:#cd4c4c; font-weight:bold;',
          class:  'btn btn-xs btn-danger'
        };
        addCSS(actionsTD.children[0].firstElementChild, {
          backgroundColor: '#ffffcc',
          color:           '#1c4263'
        });
      }

      // Check if a voting reminder should be sent
      if (checkReminder(ballotsTable.rows[i].children[5].innerText)) {
        tableMods = {
          title:  'Send reminder',
          css:    'color:blue; font-weight:bold;',
          class:  'btn btn-xs btn-primary'
        };

        ballotsTable.rows[i].children[0].children[0].setAttribute('class', tableMods.class);

        // Create the reminder button and append under date
        var str         = ballotsTable.rows[i].children[0].firstElementChild.getAttribute('onclick').toString();
        var ballotnum   = str.substring(str.lastIndexOf('BallotNumber') + 13, str.lastIndexOf('&BallotYearOpened'));
        var reminderBtn = document.createElement('span');
        var yearnum     = str.substring(str.lastIndexOf('YearOpened=') + 11, str.lastIndexOf('&NoToolbar'));

        reminderBtn.innerText = 'Send reminder';
        reminderBtn.setAttribute('class', 'btn btn-xs btn-default');
        reminderBtn.style.fontSize = '7pt';

        reminderBtn.setAttribute('onclick', `window.open("https://cstools.asme.org/csconnect/NewBallotForm.cfm?check=no&BallotNumber=${ballotnum}&BallotYearOpened=${yearnum}&NoToolbar=yes&votesubmitted=0&SendReminder=yes");`);
        ballotsTable.rows[i].children[5].innerHTML += '<br/>';
        ballotsTable.rows[i].children[5].appendChild(reminderBtn);
      }
      if (tableMods.css) {
        addTitleCSS(i, 2);
        addTitleCSS(i, 3);
        addTitleCSS(i, 5);
      }
    }
  } // End ballotsTable.rows.length loop

  if (ballotsTable.rows[2].querySelectorAll('th')[6]) {
    ballotsTable.rows[2].removeChild(ballotsTable.rows[2].querySelectorAll('th')[6]);
  }
  if (ballotsTable.rows[ballotsTable.rows.length - 3].querySelectorAll('th')[6]) {
    ballotsTable.rows[ballotsTable.rows.length - 3].removeChild(ballotsTable.rows[ballotsTable.rows.length - 3].querySelectorAll('th')[6]);
  }

  addCSS(ballotsTable, {margin: 'auto', maxWidth: '1200px'});

  checkDisplayRecentBallots();

  //////////////////////////////////////////////////////////////////////////////////////////////////

  function addTitleCSS(j, k) {
    ballotsTable.rows[j].children[k].setAttribute('style', tableMods.css);
    ballotsTable.rows[j].children[k].setAttribute('title', tableMods.title);
  }

  function checkClosure(dat) {
    var future = new Date(dat);
    var today = new Date();
    return (Math.floor((future - today) / 60 / 60 / 24 / 1000) <= -2);
  }

  function checkDisplayRecentBallots() {
    chrome.storage.local.get({recentBallots: []}, function(res) {
      if (res.recentBallots.length > 0) {
        var recentBallots = [];
        var today = new Date();
        for (i = 0; i < res.recentBallots.length; i++) {
          var future = new Date(res.recentBallots[i].date);
          if (Math.floor((future - today) / 60 / 60 / 24 / 1000) >= -14 && !document.querySelector('[value="' + res.recentBallots[i].ballotNum + '"]')) {
            recentBallots.push(res.recentBallots[i]);
          }
        }
        chrome.storage.local.set({recentBallots: recentBallots}, function() {
          createRecentlyClosedPage(recentBallots);
        });
      }
    });
  }

  function checkReminder(fut) {
    var future = new Date(fut);
    var today = new Date();
    return (Math.floor((future - today) / 60 / 60 / 24 / 1000) === 6);
  }

  function createRecentlyClosedPage(rec) {
    rec = rec.map(function(ballot) {
      if (!ballot.ballotType) { ballot.ballotType = 'component'; }
      return ballot;
    });

    var allBallots = [];

    allBallots.push(rec.filter(function(ballot) {
      return ballot.ballotType === 'component';
    }));
    allBallots.push(rec.filter(function(ballot) {
      return ballot.ballotType === 'interpretation';
    }));
    allBallots.push(rec.filter(function(ballot) {
      return ballot.ballotType === 'entire document';
    }));
    allBallots.push(rec.filter(function(ballot) {
      return ballot.ballotType === 'code case';
    }));
    allBallots.push(rec.filter(function(ballot) {
      return ballot.ballotType === 'membership';
    }));

    var div   = document.createElement('div');
    var head     = document.createElement('h4');
    var note  = document.createElement('small');
    var br    = document.createElement('br');


    head.innerText = 'Recently Closed Ballots';
    note.innerText = 'Ballots remain on this list for two weeks';
    head.className = 'text-center';

    addCSS(head, {
      borderBottom: '1px solid gray',
      borderTop: '2px solid gray',
      paddingTop: '100px'
    });
    addCSS(div, {
      margin: 'auto',
      maxWidth: '1200px'
    });

    rec = rec.sort(function(aa, bb) {
        if (aa.committeeResponsible < bb.committeeResponsible) return -1;
        if (aa.committeeResponsible > bb.committeeResponsible) return 1;
        return 0;
    });

    div.appendChild(head);
    div.appendChild(note);
    div.appendChild(br);

    for (var j = 0; j < allBallots.length; j++) {
      var ul = document.createElement('ul');
      ul.style.listStyle = 'none';
      if (allBallots[j].length > 0) {
        var listHeader = document.createElement('h4');
        listHeader.innerText = allBallots[j][0].ballotType;
        addCSS(listHeader, {
          textDecoration: 'underline',
          textTransform: 'capitalize'
        });
        div.appendChild(listHeader);
      }
      for (i = 0; i < allBallots[j].length; i++) {
        var anchor = document.createElement('a');
        var bold = document.createElement('b');
        var li = document.createElement('li');
        var para = document.createElement('p');
        var small = document.createElement('small');

        li.style.marginTop = '25px';
        para.style.marginLeft = '2em';

        addCSS(anchor, {display: 'inline-block', fontWeight: 'bold', width: '150px'});

        // Pretty-up closing remarks and add links to records
        var closingRemarks = allBallots[j][i].closingRemarks;
        closingRemarks = closingRemarks.replace(/--/g, '').replace(/\n-\n/g, '\n\n').replace(/\n\n/g, '\n');
        closingRemarks = closingRemarks.split(' ');
        closingRemarks = closingRemarks.map(word => {
          word = word.split(',');
          if (word[0].search('-') > -1) {
            const record = word[0].split('-');
            if (typeof parseInt(record[0], 10) === 'number' && typeof parseInt(record[1], 10) === 'number') {
              word[0] = `<a href="https://cstools.asme.org/csconnect/SearchAction.cfm?check=no&TrackingNumber=${record[1]}&YearOpened=${record[0]}&NoToolbar=yes" target="_blank">${word[0]}</a>`;
              word = word.join(',');
            }
          }
          return word;
        }).join(' ');

        closingRemarks = closingRemarks.replace(/\n/g, '<br/>');
        para.innerHTML = closingRemarks;
        bold.innerText = ' ' + allBallots[j][i].committeeResponsible;
        small.innerText = ' (closed ' + allBallots[j][i].date + ')';

        if (allBallots[j][i].href) {
          anchor.href = allBallots[j][i].href;
          anchor.target = '_blank';
        } else {
          anchor.href = '#';
        }

        anchor.innerText = allBallots[j][i].ballotNum;

        li.appendChild(anchor);
        li.appendChild(bold);
        li.appendChild(small);
        li.appendChild(para);
        ul.appendChild(li);
      }
      div.appendChild(ul);
    }


    if (rec.length > 0) document.body.appendChild(div);

    doToAll('center', { parent: 'removeFrom' });
  } // End createRecentlyClosedPage()

  // function createReminderForm(Ballot) {
  //   var year = Ballot.split('-')[0];
  //   var num = Ballot.split('-')[1];
  //   window.open('https://cstools.asme.org/csconnect/NewBallotForm.cfm?check=no&BallotNumber='+num+'&BallotYearOpened='+year+'&NoToolbar=yes&votesubmitted=0&SendReminder=yes');
  // }

} // End formatOpenBallots()
