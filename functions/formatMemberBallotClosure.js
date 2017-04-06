import { makePageSmall } from './utils';

/*

  This function counts/summarizes the voting tally for each member and committee on the ballot.

*/

export default function formatMemberBallotClosure() {

  makePageSmall(); // makePageSmall() is located in script.js

  // Do nothing if the ballot page is at the final stage
  if (document.querySelector('#FinalStatus > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="Radio"]:nth-child(1)')) {
    return;
  }

  var closingRemarksArea = document.querySelector('[name=ClosingRemarks]');
  var closingTxt = [];
  var committee, currentlyVoting, currentRow;
  var members;
  var nextRow;
  var proposedMembership;
  var votesTables = document.querySelectorAll('.DetailPage');
  var votingResultsArea = document.querySelector('[name=VotingResults]');
  var txtToDisplay = [];

  // Loop through each table which displays the vote tally
  for (var j = 5; j < votesTables.length; j++) {
    members = {};
    currentlyVoting = votesTables[j];
    committee = votesTables[j].previousSibling.textContent.replace(/\t/g, '').replace(/\n/g, '');
    if (committee.charAt(0) === '-') committee = committee.replace('-', '');

    for (var i = 1; i < currentlyVoting.rows.length; i += 2) {
      proposedMembership = currentlyVoting.rows[i].children[0].innerText;
      currentRow = currentlyVoting.rows[i];
      nextRow = currentlyVoting.rows[i + 1];

      members[proposedMembership] = {
        approved:       getStatArr(1),
        disapproved:    getStatArr(2),
        abstain:        getStatArr(3),
        notVoting:      getStatArr(4),
        notReturned:    getStatArr(5),
        votingmembers:  parseInt(currentlyVoting.rows[i + 1].children[1].innerText, 10) + parseInt(currentlyVoting.rows[i + 1].children[3].innerText, 10) + parseInt(currentlyVoting.rows[i + 1].children[5].innerText, 10)
      };
    }

    Object.keys(members).forEach(member => {
      if (members[member].approved) {
        var outArr = [
          member + ':',
          committee,
          members[member].approved[0] + ' Approved',
          showStat('disapproved', 'Disapproved', member),
          showStat('abstain', 'Abstain', member),
          showStat('notVoting', 'Not Voting', member),
          showStat('notReturned', 'Not Returned', member)
        ];

        txtToDisplay.push(outArr.join('\n'));

        if (isapproved(member)) {
          closingTxt.push(member + ' was approved by ' + committee);
        } else {
          closingTxt.push(member + ' was not approved by ' + committee);
        }
      }
    });
  }

  closingRemarksArea.value = closingTxt.join('\n');
  votingResultsArea.value = txtToDisplay.join('\n');

  resizeResultsTxtArea();

  overlay.saveBallotClosure('membership');

///////////////////////////////////////////////////////////////////////////////////////////////

  function getStatArr(idx) { // Closure is dependent on context
    return [
      nextRow.children[idx].innerText,
      currentRow.children[idx].innerText
    ];
  }

  function isapproved(name) {
    return parseFloat(members[name].approved[0]) / parseFloat(members[name].votingmembers) >= 0.5;
  }

  function resizeResultsTxtArea() {
    var numRows = votingResultsArea.value.split('\n').length;
    votingResultsArea.setAttribute('rows', numRows);
    numRows = closingRemarksArea.value.split('\n').length;
    closingRemarksArea.setAttribute('rows', numRows);
  }

  function showStat(stat, txt, member) { // Closure is dependent on context
    var outTxt;
    outTxt = members[member][stat][0] + ' ' + txt + ' ';
    if (parseInt(members[member][stat][0], 10) > 0) {
      outTxt += '(' + members[member][stat][1] + ')';
    }
    return outTxt;
  }
}
