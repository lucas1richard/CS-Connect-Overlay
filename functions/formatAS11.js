import {
  changeCSSofAll,
  doToAll
} from './utils';

export default function formatAS11() {

  changeCSSofAll('.CommitteePage tr td', {
    padding: '0.5em'
  });

  doToAll('.CommitteePage tr td', {
    onmouseover: 'this.style.backgroundColor = "#f2f2f2"'
  });

  doToAll('.CommitteePage tr td', {
    onmouseleave: 'this.style.backgroundColor = "white"'
  });

  doToAll('td div', {
    style: 'remove'
  });

}
