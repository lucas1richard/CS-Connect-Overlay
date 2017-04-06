import { addCSS } from './utils';

export default function formatSearch() {
  var HomePageTables = document.querySelectorAll('.HomePage');

  addCSS(HomePageTables[0], { maxWidth: '8000px', minWidth: '800px', margin: 'auto' });
  addCSS(HomePageTables[1], { maxWidth: '1000px', minWidth: '800px', margin: 'auto' });
  addCSS(HomePageTables[2], { maxWidth: '1000px', minWidth: '800px', margin: 'auto' });

  document.querySelector('[name=QuickSearch]').setAttribute('action', 'SearchAction.cfm?QuickSearch=yes&NoToolbar=yes');
  document.querySelector('[name=AdvancedSearch]').setAttribute('action', 'SearchForm.cfm');
  document.querySelector('[name=SearchType]').children[0].selected = true;
  document.querySelector('[name=AdvancedSearchType]').children[0].selected = true;
  document.querySelector('select[name=Search]').children[2].selected = true;
  document.querySelector('[name=QuickSearchKeyword]').focus();

  if (window.location.href.search('Ballot') !== -1) {
    var str = window.location.href;
    str = str.substring(str.lastIndexOf('&Ballot=') + 8, str.length);
    document.querySelector('[name=QuickSearch]').setAttribute('action', 'NewBallotForm.cfm?Update=no&QuickSearch=yes&NoToolbar=yes&Ballot=' + str);
    document.querySelector('[name=QuickSearchKeyword]').value = str;
    document.querySelector('[name=Search]').click();
    setTimeout(window.close, 10);
  }
}
