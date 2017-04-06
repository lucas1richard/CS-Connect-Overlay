(function() {
	overlay
		.set('formatUpdateInterpretationBallot', formatUpdateInterpretationBallot);

  function formatUpdateInterpretationBallot() {
    if (document.querySelector('[name=BallotRecordStatus1]')) {
      return;
    } else {
      makePageSmall();
      
      // Cache DOM
      var ClosingRemarksArea    = document.querySelector('[name=ClosingRemarks]');
      var VotingResultsArea     = document.querySelector('[name=VotingResults]');
      
      // Get records included on the ballot
      var records = createRecordsObject();

      // Get voting results and closing remarks as arrays
      var resultsArrays = buildResultsArrays();

      // This should only separate committees
      var delimiter = '\n--------------------\n';

      // Display the array
      VotingResultsArea.value = resultsArrays.votingResults.join(delimiter);
      ClosingRemarksArea.value = resultsArrays.closingRemarks.join(delimiter);

      resizeResultsTxtArea();

      saveBallotClosure();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    function buildResultsArrays() {
      var committee = document.querySelector('#CommitteeResponsibleField').firstElementChild.text + ' Interpretations Committee';
      var votingResults = [];
      var closingRemarks = [];

      // records comes from createRecordsObject()
      for (record in records) {
        var temp = [
          committee + ':',
          'Record(s): ' + record,
          comp_showStat('objection',      'Objection'),
          comp_showStat('no_objection',   'No Objection'),
          comp_showStat('not_voting',     'Not Voting'),
          comp_showStat('not_returned',   'Not Returned')
        ].join('\n');

        votingResults.push(temp);
  
        if (isapproved(record).status) {
          closingRemarks.push('Record ' + record + ' was approved by the ' + committee);
        } else {
          closingRemarks.push('Record ' + record + ' was disapproved by the ' + committee + ' because of ' + isapproved(record).reason);
        }
      }
      return {
        votingResults: votingResults,
        closingRemarks: closingRemarks
      }
    }

    function comp_showStat(stat, txt) {
      var out = records[record][stat][0] + ' ' + txt + ' ';
      if (parseInt(records[record][stat][0]) > 0) out += '(' + records[record][stat][1] + ')';
      return out;
    }

    function createRecordsObject() {
      var records = {};

      var membersBallotedTable  = document.querySelector('#MembersBalloted');
      for (var i=1; i<membersBallotedTable.rows.length; i+=2) {
        var row = membersBallotedTable.rows[i];

        var nextRow = membersBallotedTable.rows[i+1];
        var proposedrecord = row.children[0].innerText.replace(/\n/g,'');

        records[proposedrecord] = {
          objection:      [textOf(nextRow.children[1]), textOf(row.children[1])],
          no_objection:   [textOf(nextRow.children[2]), textOf(row.children[2])],
          not_voting:     [textOf(nextRow.children[3]), textOf(row.children[3])],
          not_returned:   [textOf(nextRow.children[4]), textOf(row.children[4])],
          votingmembers:  parseInt(nextRow.children[1].innerText) + parseInt(nextRow.children[2].innerText)
        }
      }
      return records;
    }

    function isapproved(name) {
      var obj = {status: true, reason: null};
      if (parseInt(records[name].not_returned[0]) > 0) {
        obj = {status:false, reason: 'insufficient participation'};
      }
      if (parseFloat(records[name].objection[0]) > 0) {
        obj = {status:false, reason: 'an objection'};
      }
      return obj;
    }

    function resizeResultsTxtArea() {
      var numRows = VotingResultsArea.value.split('\n').length;
      VotingResultsArea.setAttribute('rows', numRows);
      var numRows = ClosingRemarksArea.value.split('\n').length;
      ClosingRemarksArea.setAttribute('rows', numRows);
    }

    function textOf(elem) {
      var out = elem.innerText.replace(/\n/g,' ').replace(/\t/g, ' ').replace(/ \,/g, ',');
      while(out.charAt(out.length-1) == ' ') {
        out = out.split('');
        out.pop();
        out = out.join('');
      }

      return out;
    }

    function saveBallotClosure() {
      var ballotNum = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText;
      var committeeResponsible = document.querySelector('#CommitteeResponsibleField').firstElementChild.text;

      var votingrecords = createRecordsObject();;

      // Get recent ballots
      chrome.storage.local.get({'recentBallots': []}, function(res) {
        res.recentBallots = res.recentBallots.filter(ballot => ballot.ballotNum !== ballotNum);

        res.recentBallots.push({
          ballotNum:              ballotNum,
          ballotType:             'interpretation',
          closingRemarks:         ClosingRemarksArea.value,
          committeeResponsible:   committeeResponsible,
          date:                   new Date().toLocaleDateString(),
          href:                   window.location.href,
          votingrecords:          votingrecords,
        });
        chrome.storage.local.set({'recentBallots':res.recentBallots}, function() {
          console.log('Recent Ballot Saved')
        });
      });
    }
  }
})();