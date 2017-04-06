(function() {

  overlay
    .set('formatNewComponentBallot', formatNewComponentBallot);

  function formatNewComponentBallot() {
    makePageSmall();
    var descTextArea = document.querySelector("#BallotInfo > tbody > tr:nth-child(2) > td > textarea");
    var explanationTextArea = document.querySelector("[name=Explanation]");

    chrome.storage.sync.get({
      componentballotdescription: "",
      componentballotexplanation: "",
    }, function(d) {
      descTextArea.value =        d.componentballotdescription;
      explanationTextArea.value = d.componentballotexplanation;
    });

    chrome.storage.local.get({
      committeeGroups:  {},
      allrecords:       {}
    }, function(d) {
      // Handle Committee Groups (add buttons and assign event listeners)
      var subcommitteeTR = document.querySelectorAll("#BallotInfo > tbody > tr:nth-child(1) > th")[4];
      var subcommitteeTD = document.createElement("div");
      var revTR = document.querySelector("#BallotInfo > tbody > tr:nth-child(9) > td > table > tbody > tr:nth-child(2)");
      var revTD = document.createElement("td");

      var componentballot = (function(records) {
        
        var records         = records;
        var AddButton       = document.querySelector("[name=Add]");
        var RemoveButton    = document.querySelector("[name=Remove]");
        var AppliedRecords  = document.getElementById("DeleteTrackingNumber");
        var BallotLevel     = document.getElementById("BallotLevelID");
        var DescriptionArea = document.querySelector("[name=Description]");

        function populateComponentDescription() {
          var boardSelect     = document.getElementById("BoardCommittee");
          var standardsSelect = document.getElementById("StandardsCommittee");
          var subSelect       = document.getElementById("SubCommittee");
          var reviewSelect    = document.getElementById("ReviewSubCommittee");
          var remarks         = document.querySelector("[name=Remarks]");
          var committee       = "";
          
          // Empty the committees included
          while(boardSelect.firstChild) {boardSelect.removeChild(boardSelect.firstChild);}
          while(standardsSelect.firstChild) {standardsSelect.removeChild(standardsSelect.firstChild);}
          while(subSelect.firstChild) {subSelect.removeChild(subSelect.firstChild);}
          while(reviewSelect.firstChild) {reviewSelect.removeChild(reviewSelect.firstChild);}

          if (BallotLevel.value != "") {
            var str = document.querySelector("[name=CommitteeResponsibleField]").value;
            console.log(str);
            var subOption = document.querySelector("option[value=" + str + "]");
            if (BallotLevel.value == "1") {
              var boardOption = document.querySelector("option[value=" + str.slice(0,3).concat("000000") + "]");
                boardOption.style.backgroundColor = "#ffffe5";
                boardOption.setAttribute("selected", "true");
                AddAutoCompleteOption(boardOption.value, boardOption.text, 'BoardCommittee',5, 25);
                committee = boardOption.text;
            }
            if (BallotLevel.value == "2") {
              var standardOption = document.querySelector("option[value=" + str.slice(0,5).concat("0000") + "]");
                standardOption.style.backgroundColor = "#ffffe5";
                AddAutoCompleteOption(
                  standardOption.value,
                  standardOption.text,
                  'StandardsCommittee',5, 25
                );
                committee = standardOption.text + " Standards Committee";
                var boards = {
                  A03000000:"Board on Codes and Standards Operations",
                  A02000000:"Board on Conformity Assessment",
                  O10000000:"Board on Nuclear C&S",
                  N10000000:"Board on Pressure Technology C&S",
                  L01000000:"Board on Safety Codes and Standards",
                  C02000000:"Board on Standardization and Testing",
                };
                // If the committee is a BPTCS committee, include BPTCS for review and comment
                for (num in boards) {
                  // If the committee is a BPTCS committee, include BPTCS for review and comment
                  if (str.slice(0,3).concat("000000") == num) {
                  AddAutoCompleteOption(num, boards[num], 'ReviewSubCommittee',5, 25);
                }
              }
            }
            if (BallotLevel.value == "3") {
              
                subOption.style.backgroundColor = "#ffffe5";
                AddAutoCompleteOption(subOption.value, subOption.text, 'SubCommittee',5, 25);
                committee = subOption.text;
            }
          }
          var subOption = document.querySelector("option[value=" + str + "]");
          DescriptionArea.value = committee + " first consideration ballot for the following " + subOption.text + " record(s):";
          remarks.value = committee + " first consideration ballot for the following " + subOption.text + " record(s):";
          for (var i=0; i<AppliedRecords.children.length; i++) {
            DescriptionArea.value += '\n - '+AppliedRecords.children[i].value + ' - "' + logrecord(AppliedRecords.children[i].text) + '"';
            remarks.value += '\n - '+ AppliedRecords.children[i].value + '  - "' + logrecord(AppliedRecords.children[i].text) + '"';
          }
        } // end populateComponentDescription()

        function logrecord(r) {
          if (records[r]) {
            return records[r].subject;
          } else {
            var temp = {};
            chrome.storage.local.get({
              allrecords:{}
            }, function(o) {
              temp = o.allrecords;
            });
            if (temp[r]) {
              return temp[r].subject;
            } else {
              return "";
            }
          }
        } // end logrecord()
        AddButton.addEventListener("click", populateComponentDescription);
        BallotLevel.addEventListener("change", populateComponentDescription);
      })(d.allrecords);


      for (group in d.committeeGroups) {
        var btn =           document.createElement("span");
        var revbtn =        document.createElement("span");
        btn.className =     "btn btn-xs btn-danger";
        revbtn.className =  "btn btn-xs btn-danger";
        btn.innerText =     group;
        revbtn.innerText =  group;
        btn.committees =    [];
        revbtn.committees = [];
        for (var i=0; i<d.committeeGroups[group].length; i++) {
          btn.committees.push(d.committeeGroups[group][i]);
          revbtn.committees.push(d.committeeGroups[group][i]);
        }
        subcommitteeTD.appendChild(btn);
        revTD.appendChild(revbtn);
        
        function space(appendTo) {
          var textNode = document.createTextNode(' ');
          appendTo.appendChild(textNode);
        }
        space(subcommitteeTD);
        space(revTD);

        btn.addEventListener("click", function() {
          for (var j=0; j<this.committees.length; j++) {
            var option = document.querySelector("option[value='"+this.committees[j].num+"']");
            var pnt = option.parentNode.getAttribute("id").replace("List","");
            pnt = pnt.replace("committee","Committee");
            AddAutoCompleteOption(option.value, option.text, pnt,5, 25);
          }
        });
        
        revbtn.addEventListener("click", function() {
          for (var j=0; j<this.committees.length; j++) {
            var option = document.querySelectorAll("option[value='"+this.committees[j].num+"']")[1];
            var pnt = option.parentNode.getAttribute("id").replace("List","");
            pnt = pnt.replace("committee","Committee");
            AddAutoCompleteOption(option.value, option.text, pnt, 5, 25);
          }
        });
      }
      subcommitteeTR.appendChild(subcommitteeTD);
      revTR.appendChild(revTD);
      
    });

    formatClosingDate();

    formatTextAreas();

  }

  function AddAutoCompleteOption(value, text, TargetObject, maxSize, maximumNumberOfValues) {
    var found=false;
    var ObjectName = document.getElementById(TargetObject);

    if (maximumNumberOfValues == null || ObjectName.length < maximumNumberOfValues) {
      for (var i=0; i < ObjectName.length; i++) {
        if (ObjectName.options[i].value==value) {
          found=true;
          break; 
        } else
          found=false;
      }
      if (!found) {
        ObjectName.options[ObjectName.length]= new Option (text, value);
        ObjectName.options[i].selected =true;
        if (ObjectName.size < maxSize) ObjectName.size++;
      }
    }
  }

  function formatTextAreas() {
    var txtArea = document.getElementsByTagName("textarea");
    for (var i=0; i<txtArea.length; i++) {
      txtArea[i].setAttribute("class","form-control");
      txtArea[i].setAttribute("cols","100");
      txtArea[i].setAttribute("rows","5");
    }
  }

  function formatClosingDate() {
    var DateClosed = document.getElementById("DateClosed");
    DateClosed.parentElement.setAttribute("class","form form-inline");
    DateClosed.setAttribute("class","form-control");
    DateClosed.value = dateInput(28);
  }
})();