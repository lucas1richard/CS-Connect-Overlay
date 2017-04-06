import { appendShortList, changeCSSofAll } from './utils';

export default function formatStaff() {
    ['#ItemTypeID', '#AnsiBallotType', '[name=BallotType]'].forEach(function(selector) {
      document.querySelector(selector).firstElementChild.selected = true;
    });

    changeCSSofAll('.Homepage th', { textAlign: 'center' });
    appendShortList('#SelectedCommitteeResponsible');
  }
