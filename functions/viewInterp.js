import { addCSS, makePageSmall, quickViewTool } from './utils';

export default function viewInterp() {

  makePageSmall();

  var backgroundURL = chrome.extension.getURL('interps.footer.png');
  var pagehdg = document.querySelector('.pagehdg');

  chrome.storage.sync.get({userInfo: false}, item => {
    var br = document.createElement('br');
    if (item.userInfo) {
      var btn = document.createElement('button');
      btn.addEventListener('click', generateIssuanceLetter);
      btn.innerText = 'Generate Issuance Letter';
      btn.setAttribute('class', 'btn btn-primary btn-xs');
      pagehdg.appendChild(br);
      pagehdg.appendChild(btn);
      var nameTxt = `${item.userInfo.firstName} ${item.userInfo.lastName}\nSecretary\n${item.userInfo.phone}\n${item.userInfo.email}`;
    } else {
      var txtNode = document.createElement('span');
      txtNode.style.color = 'red';
      txtNode.innerText = 'To enable auto issuance letter, enter your user information into the extension options page';
      pagehdg.appendChild(txtNode);
    }

    var emailSel = (() => {
      var select = document.createElement('select');
      [
        { txt: 'Create Email to Inquirer:', val: '' },
        { txt: 'I\'ll write it myself', val: ' ' },
        { txt: '--------------------', val: '', disabled: true },
        { txt: 'Approval of Specific Design', val: 'specific_design' },
        { txt: 'Basis or Rationale', val: 'basis_or_rational' },
        { txt: 'Consulting', val: 'consulting' },
        { txt: 'Indefinite Question', val: 'indefinite_question' },
        { txt: 'Semi-Commercial Question', val: 'semi_commercial' },
        { txt: 'Suggestion for Revision', val: 'suggestion' }
      ].forEach(type => {
        var opt = document.createElement('option');
          opt.value = type.val;
          opt.innerText = type.txt;
        if (type.disabled) opt.setAttribute('disabled', true);
        select.appendChild(opt);
      });

      select.className = 'form-control input-sm';
      select.addEventListener('change', newMail);
      return select;
    })();

    var div = document.createElement('div');
        div.style.margin = 'auto';
        div.className = 'form-inline';
        div.appendChild(emailSel);
      pagehdg.appendChild(div);

    var updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-default btn-xs';
        updateBtn.innerText = 'Update Record';
        updateBtn.addEventListener('click', openUpdateWindow);
      pagehdg.appendChild(updateBtn);
      $(document.getElementsByTagName('table')[0]).prepend(quickViewTool);

    var inquirerRows = document.getElementById('InquirerInformation').rows;
    var firstName = toTitleCase(inquirerRows[1].innerText.split('\t')[0]);
    var lastName = toTitleCase(inquirerRows[1].innerText.split('\t')[1]);
    var company = toTitleCase(inquirerRows[3].firstElementChild.innerText);
    var email = document.querySelector('#InquirerInformation > tbody > tr:nth-child(16) > td').innerText;

    var street1 = toTitleCase(inquirerRows[3].children[1].innerText);
    var street2 = toTitleCase(inquirerRows[5].children[0].innerText);
    var street3 = toTitleCase(inquirerRows[5].children[1].innerText);

    var country = toTitleCase(inquirerRows[7].children[0].innerText);
    var state = toTitleCase(inquirerRows[7].children[1].innerText);
    var town = toTitleCase(inquirerRows[9].children[0].innerText);
    var zip = inquirerRows[9].children[1].innerText;

    var itemRows = document.getElementById('ItemDescription').rows;
    var QA = itemRows[3].children[0].innerText;
    var standardInfo = itemRows[1].firstElementChild.firstElementChild.rows;
    var standard = standardInfo[1].children[0].innerText;
    var edition = standardInfo[1].children[1].innerText;

    var paragraph = standardInfo[1].children[2].innerText;
    var subject = standardInfo[3].children[0].innerText;
    var established = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(10) > td:nth-child(1)').innerText;
    var record = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(1)').innerText;
    var committee = document.querySelector('#StaffAccessrmation > tbody > tr:nth-child(2) > td:nth-child(2)').innerText;
    var para = document.querySelector('#ItemDescription > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(3)').innerText;
    var originalInquiry = document.querySelector('#InquirerInformation > tbody > tr:nth-child(20) > td').innerText;

    function generateIssuanceLetter() {
      var inpSrc = backgroundURL;
      document.body.innerHTML = '';
      var background = document.createElement('img');
        addCSS(background, {
          height: '1100px',
          position: 'absolute',
          width: '850px'
        });
        background.src = inpSrc;
        document.body.appendChild(background);

      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      var thisDay = new Date();
      var today = [thisDay.getDate(), months[thisDay.getMonth()], thisDay.getFullYear()].join(' ');

      var main = document.createElement('div');
        addCSS(main, {
          backgroundSize: 'cover',
          fontFamily:     'initial',
          fontSize:       '11pt',
          lineHeight:     'initial',
          paddingBottom:  '150px',
          paddingLeft:    '110px',
          paddingRight:   '100px',
          paddingTop:     '180px',
          position:       'absolute',
          width:          '850px'
        });
      document.body.appendChild(main);

      var dateP = document.createElement('p');
        dateP.innerText = today;
        dateP.style.marginBottom = '20px';

      var addressFull = (function() {
        var addressFull = document.createElement('div');

        var addressCity = document.createElement('div');
        var addressCompany = document.createElement('div');
        var addressCountry = document.createElement('div');
        var addressName = document.createElement('div');
        var addressStreet1 = document.createElement('div');
        var addressStreet2 = document.createElement('div');
        var addressStreet3 = document.createElement('div');

        addressStreet1.innerText = street1;
        addressName.innerText = firstName + ' ' + lastName;

        if (exists(company)) addressCompany.innerText = company;
        if (exists(street2)) addressStreet2.innerText = street2;
        if (exists(street3)) addressStreet3.innerText = street3;
        if (exists(town)) addressCity.innerText = town;
        if (exists(state)) addressCity.innerText += ', ' + state;
        if (exists(zip)) addressCity.innerText += ' ' + zip;
        if (exists(country) && country != 'United States') addressCountry.innerText = country;

        addressFull.appendChild(addressName);
        addressFull.appendChild(addressCompany);
        addressFull.appendChild(addressStreet1);
        addressFull.appendChild(addressStreet2);
        addressFull.appendChild(addressStreet3);
        addressFull.appendChild(addressCity);
        addressFull.appendChild(addressCountry);

        return addressFull;

        function exists(str) {
          return str.length > 0 && str.toLowerCase() !== 'none';
        }

      })();
      main.appendChild(dateP);
      main.appendChild(addressFull);

      var br = document.createElement('br');
        main.appendChild(br);

      var subjP = document.createElement('p');
          subjP.innerHTML = 'Standard Designation: ASME ' + standard + '<br/>Edition/Addenda: ' + edition + '<br/>Paragraph/Fig./Table No: ' + para;
      var refP = document.createElement('p');
          refP.innerText = 'Reference: Your inquiry dated ' + established;
      var itemP = document.createElement('p');
          itemP.innerText = 'Item: ' + record;
      var introP = document.createElement('p');
          introP.innerText = '\nOur understanding of the question in your inquiry and our reply are as follows:';
      var interpP = document.createElement('p');
          interpP.innerText = QA + '\n\nSincerely,';
      var signatureP = document.createElement('div');
          signatureP.innerText = 'Signature: ';

      main.appendChild(subjP);
      main.appendChild(refP);
      main.appendChild(itemP);
      main.appendChild(introP);
      main.appendChild(interpP);
      main.appendChild(signatureP);

      var img = document.createElement('img');
          img.id = 'signature';
          img.src = '#';
          img.alt = 'Your signature';
          img.height = '50';
          img.width = '150';
        main.appendChild(img);
      var nameP = document.createElement('p');
          nameP.innerText = nameTxt;
        main.appendChild(nameP);


      var fileInp = document.createElement('input');
          fileInp.type = 'file';
          fileInp.accept = '.jpg, .png, .jpeg, .gif, .pcd';
          fileInp.addEventListener('change', appendSignature);

        signatureP.appendChild(fileInp);

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function appendSignature() {
        var input = fileInp;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = ev => $('#signature').attr('src', ev.target.result);
          reader.readAsDataURL(input.files[0]);
        }
        if (img) {
          img.removeAttribute('width');
          signatureP.style.display = 'none';
        }
      }
    }

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    function writeMail(obj) {
      var ref = '';
      if (obj.email) ref += 'mailto:' + obj.email + '?';
      if (obj.cc) ref += 'cc=' + obj.cc + '&';
      if (obj.subject) ref += 'subject=' + obj.subject + '&';
      if (obj.body) ref += 'body=' + obj.body;
      window.location.href = ref;
    }

    function convertToEmail(msg) {
      return msg.replace(/\n/g, '%0D').replace(/ /g, '%20').replace(/\&/g, 'and');
    }

    function newMail(type) {
      var type = emailSel.value;
      if (type !== '') {
        var msg = 'Dear Inquirer:\n\nRecord: ' + record + '\n\n';
          msg += 'Your inquiry of ASME '+standard+'-'+edition+' has been received. ';
          if (originalInquiry.length < 500) { // this has been added due to the length limits of chrome href
            msg += '\n-----------------------------\n'+ originalInquiry.trim() + '\n-----------------------------\n';
          } else {
            msg += '\n';
          }
        if (type === 'indefinite_question') {
          msg += 'In reply, we wish to advise you that your question is not sufficiently explicit to present to the Committee for consideration. The Committee requires all questions concerning applications of the Code rules to be clearly and explicitly outlined and that such question be confined strictly to the requirements of the Code.\n\nWill you therefore, please reframe your question with specific reference to the Code requirement that is applicable?';
        }
        if (type === 'semi_commercial') {
          msg += 'In reply, we wish to advise you that there is a doubt as to whether you desire an interpretation of some particular requirement in the Code or a review (or approval) of the apparatus (or design) which you describe. If it is an interpretation of the Code requirement you seek, your question must be clearly and explicitly outlined and be confined strictly to the applications of the Code requirements.\n\nAs described in the Foreword of the ASME code, the rules established by the Committee are not to be interpreted as approving, recommending or endorsing any proprietary or specific design or as limiting the method of design or form of construction that conforms to Code rules.\n\nWill you, therefore, please reframe the question with particular reference to the Code requirements that seem to apply to your design (or construction)?';
        }
        if (type === 'specific_design') {
          msg += 'This is to acknowledge your inquiry relative to the approval of your specific design. As described in the Foreword of the ASME Code, the rules established by the Committee are not to be interpreted as approving, recommending or endorsing any proprietary or specific design or as limiting the method of design or from of construction that conforms to Code rules.';
        }
        if (type === 'basis_or_rational') {
          msg += 'Please be advised that the ASME committees provide responses to requests for clarification and interpretation of the Code, and considers suggestions for revisions. ASME committees do not respond to questions seeking rationale for Code requirements since these are based upon consideration of technical data and the experience and expertise of the individual committee members.\n\nShould you have suggestions for a revision to the Code, please submit them to this office with supportive technical reasons and/or data.\n\nFor your information, all technical meetings during which Code requirements are considered are open to the public.';
        }
        if (type === 'consulting') {
          msg += 'Your letter has requested a response to a question, which is of a consulting nature. Please be advised that ASME committees provide responses to requests for clarification and interpretation of the Code, and considers suggestions for revisions. The committee does not address consulting questions. The Committee also does not respond to questions seeking rationale for Code requirements, nor whether specific designs or fabrications can meet the requirements of the Code.\n\nIt is suggested that you may also wish to contact the services of a consulting agency that is familiar with ASME standard requirements and applications.';
        }
        if (type === 'suggestion') {
          msg += `Your inquiry appears to be a suggestion for revision. We appreciate your suggestion and the committee will consider it for the next edition of ${standard}.`;
        }
        msg += '\n\nThank you and I look forward to assisting you.\n\nRegards,\n';
        msg += nameTxt;
        standard = convertToEmail(standard);
        edition = convertToEmail(edition);
        var body = convertToEmail(msg);

        // Handle the case when the email is too long
        if (body.length <= 1900) {
          writeMail({email, subject: `Your%20ASME%20${standard}-${edition}%20inquiry`, body});
        } else {
          // This should never really fire, but it's here just in case
          alert('The email is too long to be generated by Chrome.');
        }
      }
    }

    function openUpdateWindow() {
      var currentHref = window.location.href;
        currentHref = currentHref.replace('SearchAction', 'UpdateRecordForm');
        currentHref += '&Action=Update';
        window.location.href = currentHref;
    }

  });
}
