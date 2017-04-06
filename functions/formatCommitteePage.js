import { addCSS, doToAll } from './utils';
import replaceNavBar from './replaceNavBar';
import $ from 'jquery';

export default function formatCommitteePage() {
  document.body.style.backgroundColor = '#f2f2f2';
  var committeename = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(2) > td > table:nth-child(8) > tbody > tr > td:nth-child(2) > div').innerText;

  // ul comes from replaceNavBar.js in overlay.navbar as a local variable
  // $(ul).before(`<h4>${committeename}</h4>`);


  doToAll('a', { style: 'font-size:13px' });
  doToAll("[alt='Click to Update']", {style: 'height:20px; width:25px;'});
  doToAll("[alt='Click to Delete']", {style: 'height:20px; width:25px;'});
  if (document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(4)')) {
    addCSS('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(4)', { minWidth: '40px' });
  }

  // Brighten up the left menu and add a border to the right side
  modifyLeftMenu();

  // Make the button group for staff edits
  makeStaffEditsButtons();

  // Take away the images and use glyphicons instead
  modifyEditButtons();

  // Replace the navbar
  replaceNavBar();

  // Make the committee page more readable
  var mainTable = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > table');
  addCSS(mainTable, {
    maxWidth: '1200px',
    boxShadow: '0px 0px 8px',
    backgroundColor: '#ffffff'
  });

  function makeStaffEditsButtons() {
    var staffEdits = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td');

    [ 'Home', 'Modify', 'File Maintenance' ].forEach((btnTxt, i) => {
      if (staffEdits.children[i]) {
        staffEdits.children[i].removeChild(staffEdits.children[i].children[0]);
        staffEdits.children[i].innerText = btnTxt;
        staffEdits.children[i].className = 'btn btn-default btn-xs';
        if (i === 0) staffEdits.children[i].className += ' flat-right';
        if (i === 1) staffEdits.children[i].className += ' flat-left flat-right';
        if (i === 2) staffEdits.children[i].className += ' flat-left';
      }
    });

    staffEdits.innerHTML = staffEdits.innerHTML.replace(/\n/g, '').replace(/\t/g, '');
    staffEdits.className = 'text-center';
  }

  function modifyEditButtons() {
    var upNAdd = [
      { sel:"[alt='Click to Delete']", clss: 'glyphicon glyphicon-remove', color: 'red', title:'Click to Delete' },
      { sel:"[alt='Click to Update']", clss: 'glyphicon glyphicon-cog', color: 'blue', title: 'Click to Update' },
      { sel:"[alt='Click to Add to this menu']", clss: 'glyphicon glyphicon-plus-sign', color: 'green', title: 'Click to Add to this menu' },
      { sel:"[alt='Click to Move Down']", clss: 'glyphicon glyphicon-arrow-down', color: 'blue', title: 'Click to Move Down' },
      { sel:"[alt='Click to Move Up']", clss: 'glyphicon glyphicon-arrow-up', color: 'blue', title: 'Click to Move Up' },
    ];

    upNAdd.forEach(config => {
      var upbtns = document.querySelectorAll(config.sel);
      upbtns.forEach(btn => {
        var span = document.createElement('span');
        span.className = config.clss;
        addCSS(span, { color: config.color, fontSize: '15px' });
        btn.parentNode.appendChild(span);
        span.setAttribute('title', config.title);
        btn.parentNode.removeChild(btn);
      });
    });
  }

  function modifyLeftMenu() {
    var headers = document.querySelectorAll('.LeftMenu .Header');
    var LeftMenu = document.querySelector('.LeftMenu');
    var Links = document.querySelectorAll('.Link a');
    var links = document.querySelectorAll('.Detail');

    LeftMenu.setAttribute('class', 'LeftMenu table table-condensed');

    headers.forEach(header => {
      if (header.children[1]) {
        for (var j = 0; j < 2; j++) {
          addCSS(header.children[j], {
            padding: '0.5em',
            // background: `linear-gradient(${borderColor}, ${thColor}, ${borderColor})`,
            color: '#000000'
          });
        }
      }
    });

    addCSS(LeftMenu, { borderRight: '1px solid #dedede' });

    links.forEach(link => {
      for (var j = 0; j < 3; j++) {
        addCSS(link.children[j], {
          padding: '0.2em',
          backgroundColor: '#ffffff',
          border: '0px solid white'
        });
      }
    });
  }
}
