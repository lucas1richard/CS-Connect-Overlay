import { dateInput, makePageSmall } from './utils';


export default function formatNewMemberBallot() {

  makePageSmall(); // makePageSmall() is located in script.js

  document.querySelector('#ProspectMemberID').parentElement.setAttribute('class', 'form form-inline');

  // Cache DOM
  var addbtns = document.querySelectorAll('[name=Add], [name=Remove]');
  var boardCommittee = document.querySelector('#BoardCommittee');
  var dateClosed = document.querySelector('#DateClosed');
  var description = document.querySelector('[name=Description]');
  var deleteProspectMemberID = document.querySelector('#DeleteProspectMemberID');
  var prospectMemberID = document.querySelector('#ProspectMemberID');
  var remarks = document.querySelector('[name=Remarks]');
  var standardsCommittee = document.querySelector('#StandardsCommittee');
  var subcommittee = document.querySelector('#SubCommittee');

  prospectMemberID.addEventListener('click', newmember);

  // Format date
  dateClosed.value = dateInput(14);
  dateClosed.parentElement.setAttribute('class', 'form form-inline');
  dateClosed.setAttribute('class', 'form-control');

  // Listen for click on add/remove committee buttons
  addbtns.forEach(addbtn => {
    addbtn.addEventListener('click', newmember);
  });

  function checkComplete() {
    if (!deleteProspectMemberID.children[0]) return false;
    if (!boardCommittee.children[0] && !standardsCommittee.children[0] && !subcommittee.children[0]) return false;
    return true;
  }

  function newmember() {
    if (checkComplete()) {
      var committeeBalloted = { board: [], standards: [], sub: [], committees: 0 };
      for (let i = 0; i < boardCommittee.children.length; i++) {
        let sub = boardCommittee.children[i].innerHTML.replace(/&nbsp;/g, '').replace(/[ ][ ]- /g, '').replace(/amp;/g, '');
        committeeBalloted.board.push(sub);
        committeeBalloted.committees++;
      }
      for (let i = 0; i < standardsCommittee.children.length; i++) {
        let sub = standardsCommittee.children[i].innerHTML.replace(/&nbsp;/g, '').replace(/[ ][ ]- /g, '').replace(/amp;/g, '');
        committeeBalloted.standards.push(sub + ' Standards Committee');
        committeeBalloted.committees++;
      }
      for (let i = 0; i < subcommittee.children.length; i++) {
        let sub = subcommittee.children[i].innerHTML.replace(/&nbsp;/g, '').replace(/[ ][ ]- /g, '').replace(/amp;/g, '');
        committeeBalloted.sub.push(sub);
        committeeBalloted.committees++;
      }

      description.value = 'Two week ' + writeCommittees() + ' membership ballot for the following:\n';
      remarks.value = 'Two week ' + writeCommittees() + ' membership ballot for the following:\n';

      for (let i = 0; i < deleteProspectMemberID.children.length; i++) {
        let sub = deleteProspectMemberID.children[i].innerHTML.replace(/&nbsp;/g, '').replace(/[ ][ ]- /g, '').replace(/amp;/g, '');

        description.value += ' - ' + sub + '\n';
        remarks.value += ' - ' + sub + '\n';
      }
    }

    function writeCommittees() {
      var out = '';
      Object.keys(committeeBalloted).forEach(committee => {
        if (committeeBalloted[committee].length > 0 && committee !== 'committees') {
          out += committeeBalloted[committee].join(' and ');
          if (committeeBalloted.committees > 1 && committee !== 'sub') out += ', ';
        }
      });
      return out;
    }

  }
}
