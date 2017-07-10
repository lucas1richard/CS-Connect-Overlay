import { addCSS, appendShortList } from './utils';

const formatAdvancedRecordSearch = () => {

  var mainbody = document.querySelector('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > form > table.SearchPage');
  addCSS(document.getElementById('CommitteeList'), { height: '300px', width: '100%' });

  for (var i = 0; i < mainbody.rows.length; i++) {
    if (mainbody.rows[i].children[2]) mainbody.rows[i].removeChild(mainbody.rows[i].children[2]);
    if (mainbody.rows[i].children[0]) mainbody.rows[i].children[0].style.textAlign = 'right';
  }

  mainbody.parentNode.className = 'table';
  addCSS(mainbody.parentNode, { margin: 'auto', maxWidth: '1200px' });
  appendShortList('#CommitteeList');

};

export default formatAdvancedRecordSearch;