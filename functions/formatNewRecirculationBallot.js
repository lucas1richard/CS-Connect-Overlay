import angular from 'angular';
import { addAngular, addCSS, makePageSmall, dateInput } from './utils';

export default function formatNewRecirculationBallot() {
  makePageSmall();

  // Cache DOM
  var dateclosed        = document.getElementById('DateClosed');
  var descriptionArea   = document.querySelector('[name=Description]');
  var explanationArea   = document.querySelector('[name=Explanation]');
  var fakeExplanation   = document.createElement('textarea');
  var remarksArea       = document.querySelector('[name=Remarks]');

  // Two week ballot
  dateclosed.value = dateInput(14);

  if (document.querySelector('.pagehdg').innerText.search('Recirculate Component Ballot Form') > -1) {

    // Modify ballot description and opening remarks
    var desc = descriptionArea.value;
        desc = desc.replace('first consideration', 'recirculation');
        desc = desc.replace('Four week', 'Two week');
    descriptionArea.value = desc;
    remarksArea.value = desc;

    // Setup the explanation field to work with Angular
    explanationArea.innerText = '{{staffComment}}\n\n{{recircStatement}}';
    explanationArea.style.display = 'none';

    // Create a dummy explanation field to pose as the real one
    fakeExplanation.className = 'form-control';
    fakeExplanation.rows = 3;
    fakeExplanation.setAttribute('ng-model','staffComment');

    explanationArea.parentNode.appendChild(fakeExplanation);

    // This is the full statement provided by Bill Berger
    var recircStatement = 'Votes on this recirculation ballot shall be based upon review of unresolved disapproved votes, public review objections, and/or substantive supervisory board comments and the related responses, as well as any revisions to the proposal. Disapproved votes shall be limited to:\n\n1) support of unresolved first consideration disapproved votes, unresolved Public Review objections and/or substantive supervisory board comments\n2) disagreement with any changes introduced to the proposal from the previously balloted proposal.\n\nIn those cases in which a disapproved vote on a recirculation ballot is not based on this criteria, the vote will be recorded as "disapproved without comment", and will be considered for a future proposal.\n\nIf you voted on the first consideration ballot, and do not wish to change your vote for this recirculation ballot, no response is necessary. Your vote will remain the same.\nIf you voted on the first consideration ballot and wish to change your vote based on the criteria above, you may do so by recording your new vote.\nIf you did not cast a vote in the previous ballot, you may take this opportunity to register your vote. All disapproved votes and comments shall fulfill the same criteria as stated above.';

    var statementdivheader = (function() {
      var h4 = document.createElement('b');
          addCSS(h4, {display: 'block', marginLeft: '20px', marginTop: '20px'});
      var u = document.createElement('u');
          u.innerText = 'Do not copy this to the explanation area. It will be added later.';
          h4.appendChild(u);
      return h4;
    })();
    explanationArea.parentNode.appendChild(statementdivheader);

    var statementdiv = (function() {
      var div = document.createElement('div');
          div.setAttribute('id', 'recircStatement');
          div.style.margin = '20px';
          div.innerText = recircStatement;
      return div;
    })();
    explanationArea.parentNode.appendChild(statementdiv);

    // Handle adding the recirculation statement when the ballot is created
    // Add angular to the document
    angular
      .module('recirc',[])
      .controller('recircController', function($scope) {
        $scope.recircStatement = recircStatement;
        $scope.staffComment = '';
      });
    addAngular(document.body, 'recirc', 'recircController');
    angular.bootstrap(document.body, ['recirc']);


  }
  dateclosed.parentElement.setAttribute('class','form form-inline');
  dateclosed.setAttribute('class','form-control');
}
