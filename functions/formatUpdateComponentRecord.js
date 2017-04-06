(function() {
  overlay
    .set("formatUpdateComponentRecord", formatUpdateComponentRecord);

  function formatUpdateComponentRecord() {
    
    makePageSmall(); // Improve readability, makePageSmall() is in script.js

    // If record is published, update it's status
    if (window.location.href.indexOf('CheckPublished') > -1) {
      document.getElementById('ItemLevelID').value = 11;
      document.querySelector('body > table > tbody > tr:nth-child(2) > td > form > input.btn.btn-primary.btn-xs').click();
    }

    var date = new Date().toLocaleDateString(); // date is referenced in addToStaffNotes()
    var totalSummary = []; // totalSummary is referenced in addToStaffNotes()

    // Cache DOM
    var explanationTxtArea = document.querySelector('[name=Explanation]');
    var projectManagerSelect = document.querySelector('#ProjectManager');
    var proposalTxtArea = document.querySelector('[name=Proposal]');
    var staffNotesTxtArea = document.querySelector('[name=SCNotes]');
    var subjectTxtArea = document.querySelector('[name=Subject]');
    var summaryTxtArea = document.querySelector('[name=SummaryOfChanges]');
    var updateBtn = document.querySelectorAll('[name=UpdateButton]');

    [ // Properties to add to input fields
      { item: explanationTxtArea,  str: 'The explanation was updated'         },
      { item: proposalTxtArea,     str: 'The proposal was updated'            },
      { item: staffNotesTxtArea,   str: ''                                    },
      { item: subjectTxtArea,      str: 'The subject was updated'             },
      { item: summaryTxtArea,      str: 'The summary of changes was updated'  },
    ].forEach(props => {
      // Add properties, listen for changes, and report changes as appropriate
        props.item.initial = props[i].item.value;
        props.item.str = props[i].str;
        props.item.addEventListener('change', function() {
          addToStaffNotes(this.initial, this.value, this.str);
        });
    });


    addMessageDiv(); // Warn staff that their comments will be overwritten if they're not careful

    /////////////////////////////////////////////////////////////////////////////////////////////////

    function addMessageDiv() {
      var msgDiv = document.createElement("div");
          msgDiv.className = "text-danger";
          msgDiv.style.fontSize = "12px";
          msgDiv.innerHTML = "<span id='rArr' style='font-weight:bold; font-size:16px;'>&rArr;</span> This field updates when you make a change to the Subject, Proposal, Explanation, Summary of Changes, or Project Manager. <b>Any additional comments you add must be added after updating those fields, or your comment will be overwritten</b>";

      staffNotesTxtArea.parentNode.insertBefore(msgDiv, staffNotesTxtArea);
      $("#rArr").hide();

      // Warning response if staff starts typing in notes field
      staffNotesTxtArea.addEventListener("keydown", function() {
        msgDiv.style.fontSize = "14px";
        $("#rArr").show();
        blink("#rArr");
      });
    }

    function addToStaffNotes(initial, newdata, summary) {

      // Don't report same change more than once
      for (var i=0; i<totalSummary.length; i++) {
        if (totalSummary[i].search(summary) != -1) {
          totalSummary.splice(i,1);
          break;
        }
      }

      // Report change only if it is actually a change
      if (initial !== newdata) totalSummary.push(summary);

      // Reset staff notes input
      staffNotesTxtArea.value = staffNotesTxtArea.initial;

      if (totalSummary.length) {
        var beginning = '';
        // Separate old notes from new notes with a line
        if (staffNotesTxtArea.value.length) beginning = '\n-------------------------------\n';
        
        if (totalSummary.length === 1) { // Use a different format if changes > 1
          beginning += date + ': ';
        } else {
          beginning += date + ': The following changes were made on behalf of the TPM:\n   - ';
        }
        staffNotesTxtArea.value += beginning + totalSummary.join('\n   - ');
      }
    }

    function blink(element) {
      $(element).fadeOut(700, function() {
        $(element).fadeIn(400, blink(element));
      });
    }
  }
})();