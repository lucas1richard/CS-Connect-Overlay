import {
  insertScript,
  dateInput,
	space
} from './utils';

export default function formatNewEntireDocumentBallot() {
  var descTextArea = document.querySelector('#BallotInfo > tbody > tr:nth-child(2) > td > textarea');
  chrome
    .storage
    .sync
    .get({
      componentballotdescription: '',
      componentballotexplanation: '',
      committeeGroups: {}
    }, ({
      componentballotdescription,
      componentballotexplanation,
      committeeGroups
    }) => {
      descTextArea.value = componentballotdescription;

      // Handle Committee Groups (add buttons and assign event listeners)
      var subcommitteeTR = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(1) > th')[3];
      var subcommitteeTD = document.createElement('div');
      var revTR = document.querySelector('#BallotInfo > tbody > tr:nth-child(9) > td > table > tbody > tr:nth-child(2)');
      var revTD = document.createElement('td');

      Object
        .keys(committeeGroups)
        .forEach(group => {
          var btn = document.createElement('span');
          var revbtn = document.createElement('span');
          btn.className = 'btn btn-xs btn-danger';
          revbtn.className = 'btn btn-xs btn-danger';
          btn.innerText = group;
          revbtn.innerText = group;
          btn.committees = [];
          revbtn.committees = [];
          for (var i = 0; i < committeeGroups[group].length; i++) {
            btn
              .committees
              .push(committeeGroups[group][i]);
            revbtn
              .committees
              .push(committeeGroups[group][i]);
          }
          subcommitteeTD.appendChild(btn);
          revTD.appendChild(revbtn);

          space(subcommitteeTD);
          space(revTD);

          btn.addEventListener('click', function () {
            for (var j = 0; j < this.committees.length; j++) {
              var option = document.querySelector(`option[value='${this.committees[j].num}']`);
              var pnt = option
                .parentNode
                .getAttribute('id')
                .replace('List', '');
              pnt = pnt.replace('committee', 'Committee');
              AddAutoCompleteOption(option.value, option.text, pnt, 5, 25);

            }
          });

          revbtn.addEventListener('click', function () {
            for (var j = 0; j < this.committees.length; j++) {
              var option = document.querySelectorAll(`option[value='${this.committees[j].num}']`)[1];
              var pnt = option
                .parentNode
                .getAttribute('id')
                .replace('List', '');
              pnt = pnt.replace('committee', 'Committee');
              AddAutoCompleteOption(option.value, option.text, pnt, 5, 25);
            }
          });
        });
      subcommitteeTR.appendChild(subcommitteeTD);
      revTR.appendChild(revTD);

    });

  document
    .getElementById('DateClosed')
    .parentElement
    .setAttribute('class', 'form form-inline');
  document
    .getElementById('DateClosed')
    .setAttribute('class', 'form-control');

  var txtArea = document.getElementsByTagName('textarea');
  for (var i = 0; i < txtArea.length; i++) {
    txtArea[i].setAttribute('class', 'form-control');
    txtArea[i].setAttribute('cols', '100');
    txtArea[i].setAttribute('rows', '5');
  }
  var DATECLOSED = document.getElementById('DateClosed');
  DATECLOSED.value = dateInput(28);

  var actualCode = '(' + function () {
    window.AddButton = document.querySelector('[name=Add]');
    window.RemoveButton = document.querySelector('[name=Remove]');
    window.AppliedRecords = document.getElementById('DeleteTrackingNumber');
    window.BallotLevel = document.getElementById('BallotLevelID');
    window.DescriptionArea = document.querySelector('[name=Description]');
    window
      .AddButton
      .addEventListener('click', function () {
        populateDescription();
      });
    window
      .BallotLevel
      .addEventListener('change', function () {
        populateDescription();
      });
  } + ')();';
  insertScript(actualCode);

  var extScript = document.createElement('script');
  extScript.innerHTML = populateDescription.toString();
  document
    .body
    .appendChild(extScript);
}

function populateDescription() {
  window.AddButton = document.querySelector('[name=Add]');
  window.RemoveButton = document.querySelector('[name=Remove]');
  window.BallotLevel = document.getElementById('BallotLevelID');
  var DescriptionArea = document.querySelector('[name=Description]');
  var boardSelect = document.getElementById('BoardCommittee');
  var standardsSelect = document.getElementById('StandardsCommittee');
  var subSelect = document.getElementById('SubCommittee');
  var reviewSelect = document.getElementById('ReviewSubCommittee');
  var remarks = document.querySelector('[name=Remarks]');
  var committee = '';

  // Empty the committees included
  while (boardSelect.firstChild) {
    boardSelect.removeChild(boardSelect.firstChild);
  }
  while (standardsSelect.firstChild) {
    standardsSelect.removeChild(standardsSelect.firstChild);
  }
  while (subSelect.firstChild) {
    subSelect.removeChild(subSelect.firstChild);
  }
  while (reviewSelect.firstChild) {
    reviewSelect.removeChild(reviewSelect.firstChild);
  }

  if (window.BallotLevel.value !== '') {
    var str = document
      .querySelector('[name=CommitteeResponsibleField]')
      .value;
    let BallotLevel = window.BallotLevel;
    var subOption = document.querySelector('option[value=' + str + ']');
    if (BallotLevel.value === '1') {
      var boardOption = document.querySelector('option[value=' + str.slice(0, 3).concat('000000') + ']');
      boardOption.style.backgroundColor = '#ffffe5';
      boardOption.setAttribute('selected', 'true');
      AddAutoCompleteOption(boardOption.value, boardOption.text, 'BoardCommittee', 5, 25);
      committee = boardOption.text;
    }
    if (BallotLevel.value === '2') {
      var standardOption = document.querySelector('option[value=' + str.slice(0, 5).concat('0000') + ']');
      standardOption.style.backgroundColor = '#ffffe5';
      AddAutoCompleteOption(standardOption.value, standardOption.text, 'StandardsCommittee', 5, 25);
      committee = standardOption.text + ' Standards Committee';
      var boards = {
        A03000000: 'Board on Codes and Standards Operations',
        A02000000: 'Board on Conformity Assessment',
        O10000000: 'Board on Nuclear C&S',
        N10000000: 'Board on Pressure Technology C&S',
        L01000000: 'Board on Safety Codes and Standards',
        C02000000: 'Board on Standardization and Testing'
      };

      Object
        .keys(boards)
        .forEach(num => {
          // If the committee is a BPTCS committee, include BPTCS for review and comment
          if (str.slice(0, 3).concat('000000') === num) {
            AddAutoCompleteOption(num, boards[num], 'ReviewSubCommittee', 5, 25);
          }
        });
    }
    if (BallotLevel.value === '3') {

      subOption.style.backgroundColor = '#ffffe5';
      AddAutoCompleteOption(subOption.value, subOption.text, 'SubCommittee', 5, 25);
      committee = subOption.text;
    }

  }
  subOption = document.querySelector('option[value=' + str + ']');
  DescriptionArea.value = 'Four week ' + committee + ' first consideration ballot for the following ' + subOption.text + ' record:';
  remarks.value = 'Four week ' + committee + ' first consideration Entire Document ballot for the following ' + subOption.text + ' record: ';
  var record = document
    .querySelector('#BallotInfo > tbody > tr:nth-child(1) > td')
    .innerText;
  var title = document
    .querySelector('#BallotInfo > tbody > tr:nth-child(3) > td:nth-child(2)')
    .innerText;

  DescriptionArea.value += '\n' + record + ' - ' + title;
  remarks.value += '\n' + record + ' - ' + title;
}
