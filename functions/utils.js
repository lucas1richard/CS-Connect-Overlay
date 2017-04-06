import $ from 'jquery';

export function insertScript(actualCode) {
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}

export function makePageSmall() {
  document.body.style.backgroundColor = '#f2f2f2';
  addCSS(document.querySelector('body > table'), {
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 8px',
    maxWidth: '1200px',
  });
}

export function addCSS(element, cssObj) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (Array.isArray(element) && cssObj) {
    element.forEach(el => {
      Object.keys(cssObj).forEach(key => {
        el.style[key] = cssObj[key];
      });
    });
    return;
  }
  if (cssObj) {
    Object.keys(cssObj).forEach(key => {
      element.style[key] = cssObj[key];
    });
  }
}

export function doToAll(selector, obj) {
  var tmp = (selector instanceof HTMLElement) ? selector : document.querySelectorAll(selector);
  Object.keys(obj).forEach(key => {
    for (var i = tmp.length - 1; i >= 0; i--){
      tmp[i].setAttribute(key, obj[key]);
      if (obj[key] === 'remove') tmp[i].removeAttribute(key);
      if (key === 'parent' && obj[key] === 'removeFrom') tmp[i].parentElement.removeChild(tmp[i]);
    }
  });
}

export function changeCSSofAll(selector, obj) {
  var tmp = document.querySelectorAll(selector);
  Object.keys(obj).forEach(key => {
    for (var i = tmp.length - 1; i >= 0; i--){
      tmp[i].style[key] = obj[key];
    }
  });
}

export function quickViewTool() {
  var div = document.createElement('div');
  div.setAttribute('class', 'form-inline');
  addCSS(div, { height: '34px', paddingTop: '7px' });

  var inp = document.createElement('input');
    inp.id = 'quickView';
    inp.placeholder = 'Quick View';
    inp.setAttribute('class', 'form-control input-sm flat-right');
    addCSS(inp, {
      height:     '22px',
      margin:     '0px',
      maxWidth:   '90px',
      padding:    '1px',
      textAlign:  'center',
    });
    inp.addEventListener('keypress', ev => {
      if (ev.keycode === 13 || ev.which === 13) {
        if (document.querySelector('.pagehdg')) {
            if (document.querySelector('.pagehdg').innerText.search('View') > -1) {
              openRecord(inp.value, true);
            }
          } else {
          openRecord(inp.value);
        }
      }
    });
    inp.addEventListener('click', function() { this.value = ''; });

  var recordBtn = document.createElement('button');
    recordBtn.setAttribute('class', 'btn btn-xs btn-default flat-left flat-right');
    recordBtn.addEventListener('click', function(){ openRecord(inp.value); });
    recordBtn.innerText = 'Record';

  var ballotBtn = document.createElement('button');
    ballotBtn.setAttribute('class', 'btn btn-xs btn-default flat-left');
    ballotBtn.addEventListener('click', function() { openBallot(inp.value); });
    ballotBtn.innerText = 'Ballot';

  div.appendChild(inp);
  div.appendChild(recordBtn);
  div.appendChild(ballotBtn);

  return div;

  // -- Functions for quickViewTool --

  function openBallot(txt) {
    const [ ballotNum, ballotYear ] = txt.split('-');
    if (txt.toLowerCase().search('rc') > -1) {
      window.open('https://cstools.asme.org/csconnect/index.cfm?ViewTabMode=Search&Ballot=' + txt);
      return;
    }
    window.open('https://cstools.asme.org/csconnect/NewBallotForm.cfm?check=no&BallotNumber=' + ballotNum + '&BallotYearOpened=' + ballotYear + '&NoToolbar=yes');
  }

  function openRecord(txt, samepage) {
    if (txt.toLowerCase().search('rc') > -1) {
      if (!samepage) {
        window.open('https://cstools.asme.org/csconnect/index.cfm?ViewTabMode=Search&Ballot=' + txt);
      } else {
        window.location.href = 'https://cstools.asme.org/csconnect/index.cfm?ViewTabMode=Search&Ballot=' + txt;
      }
      return;
    }
    var [ year, record ] = txt.split('-');
    if (!samepage) {
      window.open('https://cstools.asme.org/csconnect/SearchAction.cfm?TrackingNumber=' + record + '&YearOpened=' + year + '&NoToolbar=yes');
    } else {
      window.location.href = 'https://cstools.asme.org/csconnect/SearchAction.cfm?TrackingNumber=' + record + '&YearOpened=' + year + '&NoToolbar=yes';
    }
  }
}

export function committeePageNav() {

  var div = document.createElement('div');

  var anchor = document.createElement('a');
  var inp = document.createElement('input');
  var li = document.createElement('li');
  var searchList = document.createElement('ul');

  div.setAttribute('class', 'form-inline');
  addCSS(div, {height: '34px', paddingTop: '7px'});
  div.setAttribute('ng-controller', 'navCommitteePageCtrl');

  inp.id = 'committeePage';
  inp.placeholder = 'Committee Page';
  inp.setAttribute('class', 'form-control input-sm');
  inp.setAttribute('style', 'height:22px; padding:1px; margin:0px; max-width:120px;');
  inp.setAttribute('ng-model', 'searchCommittee');
  inp.setAttribute('ng-click', 'searchCommittee = ""');

  searchList.setAttribute('ng-if', 'searchCommittee');
  searchList.className = 'drop-options';

  li.setAttribute('ng-repeat', 'c in committees | filter:searchCommittee | orderBy:"committee"');
  li.setAttribute('ng-click', 'openPage(c)');

  anchor.innerHTML = '{{ c.committee }}';
  anchor.target = '_blank';

  li.appendChild(anchor);
  searchList.appendChild(li);

  div.appendChild(inp);
  div.appendChild(searchList);

  angular.bootstrap(div, ['navCommitteePage']); // navCommitteePage is defined in this file

  return div;

}

export function navBar() {

  var navbardiv = document.createElement('div');

  var append = false;
  var bottomrow = document.createElement('div');
  var optsURL = chrome.extension.getURL('public/options.html');
  var optionslink = menuItem({txt: 'Extension Options ', href: optsURL, width: 2});
  var prerow = document.createElement('div');
  var smll = document.createElement('small');
  var trainingUrl = chrome.extension.getURL('reference/StandardsActions_and_ANSISubmittals.pdf');
  var toprow = document.createElement('div');

  // For the links which appear above the main navbar
  // This must be a global because it is used in formatCommitteePage
  // Do not change the variable name of ul
  let ul = document.createElement('ul');

  // All links in the main navbar with large buttons
  var links = {
    // Top Row
    myCommitteePage: menuItem({txt: 'Committee Page', href: 'CommitteePages.cfm?ChooseCommittee=yes'}),
    search: menuItem({txt: 'Search', href: 'index.cfm?ViewTabMode=Search', width: 1}),
    ansi: menuItem({txt: 'ANSI', href: 'index.cfm?ViewTabMode=ANSISubmittals', width: 1}),
    staff: menuItem({txt: 'Staff', href: 'index.cfm?ViewTabMode=Staff'}),
    vcc: menuItem({txt: 'VCC', href: 'vcc.cfm', width: 1}),
    as11: menuItem({txt: 'AS-11', href: 'CommitteePages.cfm?View=AS11', width: 1}),
    reports: menuItem({txt: 'Reports', href: 'reports.cfm', width: 1}),
    news: menuItem({txt: 'News', href: 'News.cfm?AnnouncementFormID=1', width: 1}),

    // Bottom Row
    myProfile: menuItem({txt: 'My Profile', href: 'index.cfm?ViewTabMode=ContactInformation'}),
    ballots: menuItem({txt: 'Ballots', href: 'index.cfm?ViewTabMode=OpenBallots'}),
    negativesResponses: menuItem({txt: 'Negatives & Responses', href: 'index.cfm?ViewTabMode=SummaryofNegatives'}),
    myItems: menuItem({txt: 'My Items', href: 'index.cfm?ViewTabMode=ProjectManagerRecords'}),
    customTracking: menuItem({txt: 'Custom Tracking', href: 'index.cfm?ViewTabMode=CustomTracking'}),
    help: menuItem({txt: 'Help', href: 'News.cfm?AnnouncementFormID=2'})
  };

  // Links which appear above the main navbar
  var prelinks = { // Don't re-order this object
    ASME:               'http://www.asme.org/',
    Logout:             'index.cfm?DelCookie=True&amp;Action=CommitteePage&amp;NoToolbar=yes',
    Publications:       'https://www.asme.org/shop/standards',
    'C&S Connect':        '/csconnect/index.cfm',
    'Committee Central':  committeePageNav(),
    Meetings:           'http://calendar.asme.org/home.cfm?EventTypeID=4',
    Staff:              '/csconnect/CommitteePages.cfm?view=CFStaffSearch',
    'ASME Directory':     'http://intranet.asmestaff.org/forms/files/ASME_Staff_Directory.pdf',
    ADP:                'https://workforcenow.adp.com/public/index.htm',
    Reference:         trainingUrl
  };

  ul.className = 'nav nav-pills';
  navbardiv.id = 'navbardiv';

  var referenceDateFri = new Date('09/16/2016');
  var referenceDateThurs = new Date('09/15/2016');

  Object.keys(prelinks).forEach(lnk => {
    var li = document.createElement('li');
    if (lnk === 'Committee Central') {
      li.appendChild(prelinks[lnk]);
      ul.appendChild(li);
    } else {
      var anchor = document.createElement('a');
          anchor.href = prelinks[lnk];
          anchor.innerText = lnk;
          anchor.style.color = '#337ab7';
          anchor.setAttribute('target', '_blank');

      li.appendChild(anchor);
      ul.appendChild(li);

      if (lnk === 'ADP') {
        if ((new Date(dateInput(0)) - referenceDateFri) / 86400000 % 14 === 0) { // Every other Friday
          addCSS(anchor, {
            background: '#f7a5a5',
            boxShadow: 'inset 0px 0px 4px #ca5858',
            color: '#000',
            fontWeight: 'bold',
          });
          li.title = 'Approve your timecard by COB today';
        }
        if ((new Date(dateInput(0)) - referenceDateThurs) / 86400000 % 14 === 0) { // Every other Thursday
          addCSS(anchor, {background: '#ffffcc', boxShadow: 'inset 0px 0px 4px #b1b17b'});
          li.title = 'Approve your timecard by COB tomorrow';
        }
      }
    }
  });

  bottomrow.className = 'row';
  toprow.className = 'row';
  optionslink.href = optsURL;
  smll.innerText = '(v ' + chrome.runtime.getManifest().version + ')';
  optionslink.setAttribute('target', '_blank');
  optionslink.setAttribute('style', 'background-color:#ffffcc; box-shadow:#666600 0px 0px 8px inset;');

  var li = document.createElement('li');
  li.appendChild(quickViewTool());
  ul.appendChild(li);
  prerow.appendChild(ul);
  optionslink.appendChild(smll);
  toprow.appendChild(optionslink);

  for (let key in links) {
    if (key === 'myProfile') break;
    toprow.appendChild(links[key]);
  }

  for (let key in links) {
    if (key === 'myProfile') append = true;
    if (append) bottomrow.appendChild(links[key]);
  }

  navbardiv.appendChild(prerow);
  navbardiv.appendChild(toprow);
  navbardiv.appendChild(bottomrow);

  return navbardiv;

  function menuItem(obj) {
    var divObj = document.createElement('a');
      divObj.setAttribute('href', 'https://cstools.asme.org/csconnect/' + obj.href);
      divObj.appendChild(document.createTextNode(obj.txt));

    if (!obj.width) obj.width = 2;
    if (window.location.href === 'https://cstools.asme.org/csconnect/' + obj.href) {
      divObj.setAttribute('class', 'text-center btn btn-primary col-xs-' + obj.width + ' btn-sm');
      divObj.setAttribute('style', 'box-shadow:#000066 0px 0px 8px inset;');
    } else {
      divObj.setAttribute('class', 'text-center btn btn-default col-xs-' + obj.width + ' active btn-sm');
      divObj.setAttribute('style', 'box-shadow:#999999 0px 0px 8px inset;');
    }
    return divObj;
  }
}

export function dateInput(numDays) {
  if (!numDays) numDays = 0;
  var day = new Date();
  var dat = new Date(day.valueOf());
  var addedDays = new Date(dat.setDate(dat.getDate() + numDays));

  var dd = '' + addedDays.getDate();
  var mm = addedDays.getMonth() + 1;

  if (dd < 10) dd = '0' + addedDays.getDate();
  if (mm < 10) mm = '0' + (addedDays.getMonth() + 1);

  return (mm + '/' + dd + '/' + addedDays.getFullYear());
}

export function appendShortList(target) {
  if (!target) return;
  if (typeof target === 'string') target = document.querySelector(target);
  chrome.storage.sync.get({ committees: [] }, function(item) {

    var thisCommittee = document.getElementById('thisCommitteeResponsible');
    target.firstElementChild.innerText = '----------------------------------';
    target.firstElementChild.setAttribute('disabled', true);

    for (var j = item.committees.length - 1; j >= 0; j--) {
      var option = document.createElement('option');
      var indent = '';
      if (item.committees[j].indent) indent = '&nbsp; &nbsp; - ';
      option.value = item.committees[j].num;
      option.innerHTML = indent + item.committees[j].committee;
      $(target).prepend(option);
      if (thisCommittee) thisCommittee.value = item.committees[j].num;
    }

    target.firstElementChild.selected = true;
    var option = document.createElement('option');
      option.innerText = 'Select Committee:';
    $(target).prepend(option);

  });
}

export function addAngular(target, appName, appController) {
  if (typeof target === 'string') {
    target = document.querySelector(target);
  }
  if (target instanceof HTMLElement) {
    target.setAttribute('ng-app', appName);
    if (appController) {
      target.setAttribute('ng-controller', appController);
    }
  }
  angular.bootstrap(target, [appName]);
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function joinWithCommas(arr) {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  var tmp = arr.slice(0, arr.length - 1);
  return tmp.join(', ') + ' and ' + arr.slice(-1);
}
