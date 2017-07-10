export default function formatSearchBallots() {
  if (window.location.href.search('Ballot=') === -1) return;
  if (document.querySelector('[type=Button]')) {
    doTheRest();
  } else {
    setTimeout(doTheRest, 500);
  }

  function doTheRest() {
    var str = document.querySelector('[type=Button]').getAttribute('onclick');
    var ballotnum = str.substring(str.lastIndexOf('BallotNumber') + 13, str.lastIndexOf('&BallotYearOpened'));
    var yearnum = str.substring(str.lastIndexOf('YearOpened=') + 11, str.lastIndexOf('&NoToolbar'));

    window.open('https://cstools.asme.org/csconnect/NewBallotForm.cfm?check=no&BallotNumber=' + ballotnum + '&BallotYearOpened=' + yearnum + '&NoToolbar=yes');
    setTimeout(function() {
      window.close();
    }, 10);
  }
}
