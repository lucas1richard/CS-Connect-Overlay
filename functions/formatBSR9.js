import { addCSS } from './utils';

export default function formatBSR9() {

  // Add a button to move excluded records back to associated records
  $('[name=Select]').before('<input type="Button" value="<<" onclick="AddOption(\'ResultForm\',\'ExcludedRecord\',\'AssociatedRecordNumber\',1);" class="btn btn-default btn-xs">');

  // Balance
  addMessages(['The committee was <u><b>not balanced</b></u>, but approval was granted to vote while the committee was unbalanced', 'This should never be selected', 'The committee was balanced'], cell(2));

  // PINS
  addMessages(['There was a PINS, and a <u><b>deliberation took place</b></u>', 'There was a PINS, but <u><b>no deliberation</b></u>', 'There was no PINS'], cell(3));

  // Unresolved Public Review Objections
  (function(cll) {
    var noUnresolved = 'If there were no unresolved public review objections, enter <b>0</b>';

    var errorDiv = document.createElement('div');
      errorDiv.className = 'text-danger';
      addCSS(errorDiv, { maxWidth: '400px'});
      cll.appendChild(errorDiv);
      errorDiv.innerHTML = noUnresolved;

    var input = cll.querySelector('input');
    input.addEventListener('change', function() {
      if (this.value !== '0' && this.value) {
        errorDiv.innerHTML = 'There <u><b>were</b></u> unresolved public review objections.<br/><br/>Format the emails in chronological order, remove unnecessary emails (such as asking for a response), and include in the report.';
      } else if (!this.value) {
        errorDiv.innerHTML = noUnresolved;
      } else {
        errorDiv.innerHTML = '';
      }
    });
  })(cell(4));

  // Attempts to Resolve Objections
  (function(cll) {
    var messageSpan = document.createElement('span');
      messageSpan.className = 'text-info';
      addCSS(messageSpan, { display: 'inline-block', maxWidth: '400px'});
      cll.appendChild(messageSpan);

    var inputs = cll.querySelectorAll('input');
    inputs[0].addEventListener('click', function() {
      if (this.checked) {
        messageSpan.innerHTML = 'There were no unresolved objections';
      } else {
        messageSpan.innerHTML = '';
      }
    });

    inputs[1].addEventListener('change', function() {
      if (this.value.length) {
        messageSpan.innerHTML = 'There were unresolved objections. These are the dates of recirculation ballots to the consensus committee.';
      } else {
        messageSpan.innerHTML = '';
      }
    });
  })(cell(5));

  // Unresolved Consensus Objections
  addMessages(['There <u><b>were unresolved objections</b></u> (attach ballot closure email to the report)', 'This should never be selected', 'There were no unresolved objections'], cell(6));

  // Appeals Process
  addMessages(['There were unresolved objections, and <u><b>there was an appeal</b></u>', 'There were unresolved objections, but no appeal was submitted', 'There were no unresolved objections'], cell(7));

  // Numerical Requirements
  addMessages(['At least 2/3 voting members approved all included records', 'This should never be selected'], cell(9));

  // Patent Holder Statements
  addMessages(['There <u><b>were</b></u> statements from patent holders', 'There were no statements from patent holders'], cell(10));

  $('[name=StaffComments]').before('<div class="text-info">State any reasons why the tally report does not match the tally on C&S Connect (usually due to the committee having delegates)</div>');


  function cell(row) {
    var elem = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(2) > td > table:nth-child(5) > tbody > tr > td > form > p > table:nth-child(4) > tbody > tr:nth-child(' + row + ') > td:nth-child(2)');

    return elem;
  }

  function addMessages(messages, cll) {

    var errorDiv = document.createElement('div');
      errorDiv.className = 'text-danger';
      addCSS(errorDiv, { maxWidth: '400px'});
      cll.appendChild(errorDiv);

    cll.errorDiv = errorDiv;

    var messageSpan = document.createElement('span');
      messageSpan.className = 'text-info';
      addCSS(messageSpan, { display: 'inline-block', maxWidth: '400px'});
      cll.appendChild(messageSpan);
    var inputs = cll.querySelectorAll('input[type=Radio]');

    inputs.forEach((input, index) => {
      input.addEventListener('click', () => {
        messageSpan.innerHTML = messages[index] || '';
      });
    });
  }
}
