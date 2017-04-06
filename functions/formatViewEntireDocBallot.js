(function() {
  overlay
    .set('formatViewEntireDocBallot', formatViewEntireDocBallot);

  function formatViewEntireDocBallot() {
    window.onload = function() {
      var record = document.querySelector('#BallotInfo > tbody > tr:nth-child(3) > td').innerText;
      if (window.location.href.indexOf('CheckPublished') > -1) {
        if (document.querySelector('#PublicationsLevel > tbody > tr:nth-child(4) > td:nth-child(2)') || document.querySelector('#ANSILevel > tbody > tr:nth-child(2) > td:nth-child(2)')) {
          var recordNum = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
          var year = recordNum.split('-')[0];
          var num = recordNum.split('-')[1];
          window.open('UpdateRecordForm.cfm?Action=Update&TrackingNumber='+num+'&YearOpened='+year+'&NoToolbar=yes&CheckPublished=yes');
          window.close();
        } else {
          window.close();
        }
      }
      if (window.location.href.indexOf('SendReminder') > -1) {
        chrome.storage.sync.get({ remindersSent: [] }, r => {
          r.remindersSent.forEach(reminder => {
            if (reminder === record) alert('Reminder was already sent today');
          });
          document.querySelector('input[name=EmailReminder]').click();
          r.remindersSent.push(record);
          chrome.storage.sync.set({remindersSent:r.remindersSent}, function() {
            window.close();
          });
        });
      }
      $(document.getElementsByTagName('table')[0]).prepend(overlay.quickViewTool);
    }
  }
})();