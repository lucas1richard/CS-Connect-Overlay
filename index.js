import viewInterp from './functions/viewInterp';
import generalCSSChanges from './functions/generalCSSChanges';
import formatCommitteePage from './functions/formatCommitteePage';
import formatOpenBallots from './functions/formatOpenBallots';
import replaceNavBar from './functions/replaceNavBar';
import formatSearch from './functions/formatSearch';
import formatHomePage from './functions/formatHomePage';
import formatVCC from './functions/formatVCC';
import formatStaff from './functions/formatStaff';
import formatAS11 from './functions/formatAS11';
import formatViewComponentRecord from './functions/formatViewComponentRecord';
import formatUpdateInterpretationRecord from './functions/formatUpdateInterpretationRecord';
import formatAdvancedRecordSearch from './functions/formatAdvancedRecordSearch';
import formatRecordSearchResults from './functions/formatRecordSearchResults';
import formatBSR9 from './functions/formatBSR9';
import formatMemberBallotClosure from './functions/formatMemberBallotClosure';
import formatNewRecirculationBallot from './functions/formatNewRecirculationBallot';
import formatNewEntireDocumentBallot from './functions/formatNewEntireDocumentBallot';
import formatNewMemberBallot from './functions/formatNewMemberBallot';
import formatUpdateComponentRecord from './functions/formatUpdateComponentRecord';
import formatUpdateInterpretationBallot from './functions/formatUpdateInterpretationBallot';
import formatNewComponentBallot from './functions/formatNewComponentBallot';
import formatComponentBallotClosure from './functions/formatComponentBallotClosure';
import formatViewComponentBallot from './functions/formatViewComponentBallot';
import formatSearchBallots from './functions/formatSearchBallots';

chrome.storage.sync.get({
  backgroundColor:  'rgb(235, 243, 249)',
  borderColor:      '#d8e7f3',
  inpBorderColor:   'gray',
  inpColor:         'white',
  inptxtColor:      'black',
  threed:           false,
  changeStyles:     true
}, function(item) {
  generalCSSChanges(item);

  var pagehdg = document.querySelector('.pagehdg');
  let checkHref = true;

  [
    { term: 'Advanced Record Search',        fn: formatAdvancedRecordSearch },
    { term: 'Ballots',                       fn: formatSearchBallots },
    { term: 'New Membership Ballot',         fn: formatNewMemberBallot },
    { term: 'New Component Ballot',          fn: formatNewComponentBallot },
    { term: 'New Board Procedural Ballot',   fn: formatNewComponentBallot },
    { term: 'New Entire Document Ballot',    fn: formatNewEntireDocumentBallot },
    // { term: 'New Component Record',          fn: formatNewComponentRecord },
    // { term: 'New BSR-8',                     fn: formatNewBSR8 },
    { term: 'BSR-9',                         fn: formatBSR9 },
    // { term: 'New Entire Document Record',    fn: formatNewEntireDocumentRecord },
    { term: 'Recirculate Component',         fn: formatNewRecirculationBallot },
    { term: 'Record Search Results',         fn: formatRecordSearchResults },
    // // { term: 'Set Membership Options',        fn: function() { appendShortList(document.querySelector('#Committee1')); } },
    { term: 'Update Component Ballot',       fn: formatComponentBallotClosure },
    { term: 'Update Component Record',       fn: formatUpdateComponentRecord },
    { term: 'Update Code Case Record',       fn: formatUpdateComponentRecord },
    { term: 'Update Interpretations Record', fn: formatUpdateInterpretationRecord },
    { term: 'Update Interpretations Ballot', fn: formatUpdateInterpretationBallot },
    { term: 'Update Membership Ballot',      fn: formatMemberBallotClosure },
    // { term: 'View Entire Document Record',   fn: formatViewEntireDocumentRecord },
    { term: 'View Component Ballot',         fn: formatViewComponentBallot },
    { term: 'View Component Record',         fn: formatViewComponentRecord },
    // { term: 'View Code Case Record',         fn: formatViewCodeCaseRecord },
    // { term: 'View Entire Document Ballot',   fn: formatViewEntireDocBallot },
    { term: 'View Interpretations',          fn: viewInterp },
    // { term: 'View Membership Ballot',        fn: formatViewMemberBallot },
  ].forEach(conf => {
    if (pagehdg && pagehdg.innerText.search(conf.term) > -1) {
      checkHref = false;
      conf.fn();
    }
  });

  if (checkHref) {
    [
      { term: 'OpenBallots',         fn: formatOpenBallots },
      { term: 'ContactInformation',  fn: formatHomePage },
      { term: 'Committee=',          fn: formatCommitteePage },
      { term: 'vcc.cfm',             fn: formatVCC },
      { term: 'Staff',               fn: formatStaff },
      { term: 'AS11',                fn: formatAS11 },
      { term: 'Search',              fn: formatSearch }
    ].forEach(conf => {
      if (window.location.href.search(conf.term) > -1) conf.fn();
    });
  }

  if (window.location.href.search('index.cfm') > -1 ||
    document.querySelectorAll('[name=SearchCommitteePages]')[1] ||
    window.location.href.search('vcc.cfm') > -1 ||
    window.location.href.search('reports.cfm') > -1 ||
    window.location.href.search('News.cfm') > -1) {
    replaceNavBar();
  }
});
