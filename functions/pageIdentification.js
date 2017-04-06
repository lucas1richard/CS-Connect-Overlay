(function() {
  overlay
    .set('pageIdentification', pageIdentification);

  function pageIdentification() {
    if(document.querySelector('.pagehdg')) {
      var pagehdg = document.querySelector('.pagehdg');

      var pgToFunction = [
        { term: 'Advanced Record Search',        fn: overlay.formatAdvancedRecordSearch },
        { term: 'Ballots',                       fn: overlay.formatSearchBallots },
        { term: 'New Membership Ballot',         fn: overlay.formatNewMemberBallot },
        { term: 'New Component Ballot',          fn: overlay.formatNewComponentBallot },
        { term: 'New Board Procedural Ballot',   fn: overlay.formatNewComponentBallot },
        { term: 'New Entire Document Ballot',    fn: overlay.formatNewEntireDocumentBallot },
        { term: 'New Component Record',          fn: overlay.formatNewComponentRecord },
        { term: 'New BSR-8',                     fn: overlay.formatNewBSR8 },
        { term: 'BSR-9',                         fn: overlay.formatBSR9 },
        { term: 'New Entire Document Record',    fn: overlay.formatNewEntireDocumentRecord },
        { term: 'Recirculate Component',         fn: overlay.formatNewRecirculationBallot },
        { term: 'Record Search Results',         fn: overlay.formatRecordSearchResults },
        // { term: 'Set Membership Options',        fn: function() { appendShortList(document.querySelector('#Committee1')); } },
        { term: 'Update Component Ballot',       fn: overlay.formatComponentBallotClosure },
        // { term: 'Update Component Record',       fn: overlay.formatUpdateComponentRecord },
        { term: 'Update Code Case Record',       fn: overlay.formatUpdateComponentRecord },
        { term: 'Update Interpretations Record', fn: overlay.formatUpdateInterpretationRecord },
        { term: 'Update Interpretations Ballot', fn: overlay.formatUpdateInterpretationBallot },
        { term: 'Update Membership Ballot',      fn: overlay.formatMemberBallotClosure },
        { term: 'View Entire Document Record',   fn: overlay.formatViewEntireDocumentRecord },
        { term: 'View Component Ballot',         fn: overlay.formatViewComponentBallot },
        { term: 'View Component Record',         fn: overlay.formatViewComponentRecord },
        { term: 'View Code Case Record',         fn: overlay.formatViewCodeCaseRecord },
        { term: 'View Entire Document Ballot',   fn: overlay.formatViewEntireDocBallot },
        { term: 'View Interpretations',          fn: overlay.viewInterp },
        { term: 'View Membership Ballot',        fn: overlay.formatViewMemberBallot },
      ];

      pgToFunction.forEach(conf => {
        if(pagehdg.innerText.search(conf.term) > -1) conf.fn();
      });
      
    } else {

      var pgToFunction = [
        { term: 'OpenBallots',         fn: overlay.formatOpenBallots },
        { term: 'ContactInformation',  fn: overlay.formatHomePage },
        { term: 'Committee=',          fn: overlay.formatCommitteePage },
        { term: 'vcc.cfm',             fn: overlay.formatVCC },
        { term: 'Staff',               fn: overlay.formatStaff },
        { term: 'AS11',                fn: overlay.formatAS11 },
        { term: 'Search',              fn: overlay.formatSearch }
      ];

      pgToFunction.forEach(conf => {
        if(window.location.href.search(conf.term) > -1) conf.fn();
      });

      if(window.location.href.search('ANSISubmittals') != -1) console.log('ANSI');
      if(window.location.href.search('reports.cfm') != -1) console.log('Reports');
      if(window.location.href.search('SummaryofNegatives') != -1) console.log('Negatives & Responses');
      if(window.location.href.search('ProjectManagerRecords') != -1) console.log('My Items');
      if(window.location.href.search('CustomTracking') != -1) console.log('Custom Tracking');
      if(window.location.href.search('AnnouncementFormID=1') != -1) console.log('News');
      if(window.location.href.search('AnnouncementFormID=2') != -1) console.log('Help page');
    }
  }
})();