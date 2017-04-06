import { joinWithCommas, makePageSmall } from './utils';

export default function formatComponentBallotClosure() {

  if (document.querySelector('[type=Radio]')) {
    return;
  }

  makePageSmall(); // makePageSmall() is located in script.js

  var ballotNum           = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText;
  var ClosingRemarksArea  = document.querySelector('[name=ClosingRemarks]');
  var commentsTables      = document.querySelectorAll('[name=CommitteesForReview]');
  var VotingResultsArea   = document.querySelector('[name=VotingResults]');


  // Make two object of committees, the first for voting, and the second for comments
  var commentCommittees = {};
  var closingRemarks = {};

  // Get votingCommittees object and records object
  var votingrecords = getVoting();

  commentsTables.forEach(commentsTable => {

    var committee = commentsTable.firstElementChild.firstElementChild.firstElementChild.childNodes[2].textContent.replace(/\t/g, '').replace(/\n/g, '').replace(' - ', '');
    commentCommittees[committee] = [];

    for (var i = 2; i < commentsTable.rows.length; i += 2) {
      var proposedrecord = commentsTable.rows[i].children[0].innerText.replace(/\n/g, '');
      var currentRow = commentsTable.rows[i];
      var nextRow = commentsTable.rows[i + 1];
      var individualRecords = proposedrecord.replace(/ /g, '').split(', ');

      var tmp = {comment: getStatArr(1, nextRow, currentRow)};
      commentCommittees[committee].push({ record: proposedrecord, votes: [
        comp_showStat('comment', 'Comment', tmp)
      ]});

      // Maintain a list of which records are approved/disapproved by which committees
      individualRecords.forEach(record => {
        if (!votingrecords.records[record]) votingrecords.records[record] = {};
        if (tmp.comment[0] > 0) votingrecords.records[record][committee] = tmp.comment[0] + ' comment';
        if (tmp.comment[0] > 1) votingrecords.records[record][committee] += 's';
      });
    }

  });

  var results = [];
  // Display results
  for (key in votingrecords.votingCommittees) {
    var txt = [key];
    for (var i = 0; i < votingrecords.votingCommittees[key].length; i++) {
      txt.push(votingrecords.votingCommittees[key][i].votes);
    }
    results.push(txt.join('\n\n'));
  }

  var delimiter = '\n-------------------\n';

  VotingResultsArea.value = results.join(delimiter);

  var results = [];
  if (commentsTables.length > 0) {
    VotingResultsArea.value += delimiter;
    Object.keys(commentCommittees).forEach(key => {
      var txt = key;
      for (var i = 0; i < commentCommittees[key].length; i++) {
        var recordsList = joinWithCommas(commentCommittees[key][i].record.split(', ').map(record => record.trim()));
        txt += '\nRecord(s): ' + recordsList + '\n';
        txt += commentCommittees[key][i].votes.join('\n');
      }
      results.push(txt);
    });
    VotingResultsArea.value += results.join(delimiter);
  }

  // Summarize results
  var out = getSummaryArray();

  ClosingRemarksArea.value = out.join(delimiter);

  resizeResultsTxtArea();
  saveBallotClosure();

///////////////////////////////////////////////////////////////////////////////////////////////////////////

  function comp_showStat(stat, txt, t) {
    if (t) tmp = t;
    var outTxt = tmp[stat][0] + ' ' + txt + ' ';
    if (parseInt(tmp[stat][0], 10) > 0) outTxt += '(' + tmp[stat][1] + ')';
    return outTxt;
  }

  // Closure is dependent on context
  function isapproved(tmp) {
    if (parseFloat(tmp.approved[0])/parseFloat(tmp.votingmembers) >= 2 / 3) {
      if (ballotNum.indexOf('RC') === -1) {
        if (parseInt(tmp.disapproved, 10) === 0) return true;
      } else {
        return true;
      }
    }
    return false;
  }

  function getStatArr(n, nextR, currentR) {
    if (nextR) var nextRow = nextR;
    if (currentR) var currentRow = currentR;
    return [
      nextRow.children[n].innerText,
      currentRow.children[n].innerText
    ];
  }

  function resizeResultsTxtArea() {
    var numRows = VotingResultsArea.value.split('\n').length;
    VotingResultsArea.setAttribute('rows', numRows);
    var numRows = ClosingRemarksArea.value.split('\n').length;
    ClosingRemarksArea.setAttribute('rows', numRows);
  }

  function getSummaryArray() {
    var summaryArray = [];
    for (key in votingrecords.records) {
      var voteTxt = [];
      var commentTxt = [];
      var outTxt = 'Record ' + key + ' was ';

      for (c in votingrecords.records[key]) {
        if (typeof votingrecords.records[key][c] === 'string') {
          commentTxt.push(votingrecords.records[key][c] + ' from ' + c);
        } else {
          let stat = (votingrecords.records[key][c]) ? 'approved by the ' + c : 'disapproved by the ' + c;
          voteTxt.push(stat);
        }
      }
      if (commentTxt.length > 0) {
        outTxt += joinWithCommas(voteTxt) + 'and received ' + joinWithCommas(commentTxt);
      } else {
        outTxt += joinWithCommas(voteTxt);
      }
      summaryArray.push(outTxt);
    }
    return summaryArray;
  }

  function getVoting() {
    var votesTables = document.querySelectorAll('[name=CommitteesBalloted]');
    var records = {};
    var votingCommittees = {};
    votesTables.forEach(votesTable => {
      // Get the committee name
      var com = votesTable.parentNode.parentNode.parentNode.parentNode.previousSibling.textContent.replace(/\t/g, '').replace(/\n/g, '').replace('-', '');
      votingCommittees[com] = [];

      for (var i = 1; i < votesTable.rows.length; i += 2) {

        var proposedrecord    = votesTable.rows[i].children[0].innerText.replace(/\n/g, '');
        var recordsList = joinWithCommas(proposedrecord.split(', ').map(record => record.trim()));
        var individualRecords = proposedrecord.replace(/ /g, '').split(', ');
        var currentRow        = votesTable.rows[i];
        var nextRow           = votesTable.rows[i + 1];

        var tmp = { // variable name 'tmp' is needed in comp_showStat()
          approved:             getStatArr(1, nextRow, currentRow),
          disapproved:          getStatArr(2, nextRow, currentRow),
          disapprovednocomment: getStatArr(3, nextRow, currentRow),
          abstain:              getStatArr(4, nextRow, currentRow),
          notVoting:            getStatArr(5, nextRow, currentRow),
          notReturned:          getStatArr(6, nextRow, currentRow),
          votingmembers:        parseInt(nextRow.children[1].innerText, 10) + parseInt(nextRow.children[2].innerText, 10) + parseInt(nextRow.children[6].innerText, 10)
        };

        votingCommittees[com].push({ record: proposedrecord, votes:  [
          'Record(s): ' + recordsList,
          tmp.approved[0] + ' Approved',
          comp_showStat('disapproved', 'Disapproved', tmp),
          comp_showStat('disapprovednocomment', 'Disapproved w/out Comment', tmp),
          comp_showStat('abstain', 'Abstain', tmp),
          comp_showStat('notVoting', 'Not Voting', tmp),
          comp_showStat('notReturned', 'Not Returned', tmp)
        ].join('\n')});

        // Maintain a list of which records are approved/disapproved by which coms
        individualRecords.forEach(rec => {
          if (!records[rec]) records[rec] = {};
          records[rec][com] = isapproved(tmp);
        });
      }
    });

    return {
      records,
      votingCommittees
    };
  }

  function saveBallotClosure() {
    var ballotNum = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText;
    var committeeResponsible = document.querySelector('#CommitteeResponsibleField').firstElementChild.text;

    var votingrecords = getVoting();

    // Get recent ballots
    chrome.storage.local.get({ recentBallots: [] }, res => {
      res.recentBallots = res.recentBallots.filter(ballot => ballot.ballotNum !== ballotNum);
      res.recentBallots.push({
        ballotNum:              ballotNum,
        ballotType:             'component',
        closingRemarks:         ClosingRemarksArea.value,
        committeeResponsible:   committeeResponsible,
        date:                   new Date().toLocaleDateString(),
        href:                   window.location.href,
        votingrecords:          votingrecords,
      });
      chrome.storage.local.set({ recentBallots: res.recentBallots }, () => {
        console.log('Recent Ballot Saved');
      });
    });
  }
}
