import { makePageSmall } from './utils';

export default function formatViewComponentBallot() {
    makePageSmall();
    $(document.getElementsByTagName('table')[0]).prepend(overlay.quickViewTool);

    var record = document.querySelectorAll('#BallotInfo > tbody > tr:nth-child(2) > td:nth-child(1)')[1].innerText;
    setTimeout(function() {
      if (window.location.href.indexOf('SendReminder') !== -1) {
        chrome.storage.sync.get({remindersSent: []}, reminder => {
          for (var i = 0; i < reminder.remindersSent.length; i++) {
            console.log(reminder.remindersSent[i]);
            if (reminder.remindersSent[i] === record) {
              alert('Reminder was already sent today');
              return;
            }
          }
          document.querySelector('input[name=EmailReminder]').click();
          reminder.remindersSent.push(record);
          chrome.storage.sync.set({remindersSent: reminder.remindersSent}, function() {
            window.close();
          });
        });
      }
    }, 500);
  }