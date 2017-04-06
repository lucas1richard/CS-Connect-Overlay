$(document).ready(function() {
  $(".headStyleOption").click(function() {
    save_options(this);
  }); 
  $(".inpStyleOption").click(function() {
    save_InpOptions(this);
  });
  // Change CSS of collapse togglers onclick
  $("[data-target]").click(function() {
  	var target = this.getAttribute("data-target");
  		this.setAttribute("data-active", "true");
  		
  		for(var i=0; i<document.querySelectorAll("[data-target]").length; i++) {
  			$(document.querySelectorAll("[data-target]")[i]).removeClass("btn-primary");
	  		$(document.querySelectorAll("[data-target]")[i]).addClass("active");
	  		$(document.querySelectorAll("[data-target]")[i]).addClass("btn-default");
	  		$(document.querySelectorAll("[data-target]")[i]).removeClass("fadeIn");

  			$(document.querySelectorAll("[data-target]")[i].getAttribute("data-target")).removeClass("in");
  		}

  		$(this).removeClass("btn-default");
  		$(this).removeClass("active");
  		$(this).addClass("btn-primary");
  		$(target).addClass("in");
  		$(target).addClass("fadeIn");
  });

  init();
  
});






// Saves options to chrome.storage
function save_options(target) {
  var backgroundColor = target.getAttribute("data-bgColor");
  var borderColor = target.getAttribute("data-brColor");
  document.getElementById("testTH").style.backgroundColor = backgroundColor;
  document.getElementById("testTH").style.border = "1px solid " + borderColor;
  chrome.storage.sync.set({
    backgroundColor: backgroundColor,
    borderColor: borderColor
  }, function() {
    // Update status to let user know options were saved.
    alert("Table header style saved");
    var status = document.getElementById('testTH');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = 'This is a table header';
    }, 750);
  });
}





// Saves options to chrome.storage
function save_InpOptions(target) {
  var backgroundColor = target.getAttribute("data-bgColor");
  var borderColor = target.getAttribute("data-brColor");
  chrome.storage.sync.set({
    inpColor: backgroundColor,
    inpBorderColor: borderColor
  }, function() {
  	document.getElementById("inpStyle").style.backgroundColor = backgroundColor;
  	document.getElementById("inpStyle").style.borderColor = borderColor;
  	document.getElementById("selStyle").style.backgroundColor = backgroundColor;
  	document.getElementById("selStyle").style.borderColor = borderColor;
  	alert("Input style saved");
  	var status = document.getElementById('inpStyle');
    status.value = 'Options saved.';
    setTimeout(function() {
      status.value = '';
    }, 750);
  });
}





function clearStyleChanges() {
  chrome.storage.sync.remove([
      "backgroundColor",
      "borderColor",
      "inpColor",
      "inpBorderColor"
    ], function() {
    	pulse("")
    });
}



function savecomponentballotdescription() {
	var componentballotdescription = document.getElementById("componentballotdescription").value;
	chrome.storage.sync.set({componentballotdescription:componentballotdescription}, function() {
		pulse("#componentballotdescription");
	});
}



function savecomponentballotexplanation() {
	var componentballotexplanation = document.getElementById("componentballotexplanation").value;
	chrome.storage.sync.set({componentballotexplanation:componentballotexplanation}, function() {
		pulse("#componentballotexplanation");
	});
}



function addCommittee(committee) {
	var rowDIV = document.createElement("div");
		rowDIV.setAttribute("class","input-group");

	var inp = document.createElement("input");
		inp.setAttribute("type","text");
		inp.setAttribute("list","allCommittees");
		inp.setAttribute("class","committee form-control");
	if(committee && typeof(committee) == "string") {
		inp.value = committee;
	}
	var closeButton = document.createElement("span");
		closeButton.setAttribute("class","closeR input-group-addon");
	var X = document.createElement("span");
	X.className = "glyphicon glyphicon-remove";
	closeButton.appendChild(X);

	closeButton.addEventListener("click", function() {
		$(closeButton.parentNode).remove();
	});

	rowDIV.appendChild(inp);
	rowDIV.appendChild(closeButton);

	shortList.appendChild(rowDIV);
}



// Referenced in saveCommittees()
function getCommitteeNum(committee) {
	if(!committee) return false;

	for(var i=0; i<allCommittees.length; i++) {
		if(allCommittees[i].committee == committee) return allCommittees[i];
	}
	alert("There is no match for " + committee);
	return false;
}




function getCommitteeName(num) {
	if(!num) return false;

	for(var i=0; i<allCommittees.length; i++) {
		if(allCommittees[i].num == num) return allCommittees[i].committee;
	}
}




function getCommittee(committee) {}




function saveCommittees() {
	var committeesInp = document.getElementsByClassName("committee");
	var nums = [];
	for(var j=0; j<committeesInp.length; j++) {
		if(committeesInp[j].value != "") {
			if(getCommitteeNum(committeesInp[j].value)) {
				nums.push(getCommitteeNum(committeesInp[j].value));
			}
		}
	}
	chrome.storage.sync.set({
  	committees: nums,
  }, function() {
  	pulse(".committee");
  });
}







function parseMinutes() {
	var ActsandMots = document.getElementById("ActsandMots");
	ActsandMots.innerHTML = "";

	var Minutes = document.getElementById("Minutes").value;
	var lines = Minutes.split("\n");

	var motionkey = document.getElementById("motionkey").value;

	var numLines = lines.length;
	var mul = document.createElement("ul");
	var actions = {};
	var motions = {};

	var maindelimiter = document.getElementById("delimiter").value;
	var actiondelimiter = document.getElementById("actiondelimiter").value;

	if(maindelimiter == "") {
		alert("The main delimiter is not defined");
		document.getElementById("delimiter").style.border = "2px solid red";
		return;
	}
	document.getElementById("delimiter").style.border = "";

	if(actiondelimiter == "") {
		alert("The action delimiter is not defined");
		document.getElementById("actiondelimiter").style.border = "2px solid red";
		return;
	}
	document.getElementById("actiondelimiter").style.border = "";

	// Create objects with arrays for actions by member name and for motion
	for(var i=0; i<numLines; i++) {
		if(lines[i].indexOf("Action" + maindelimiter) != -1) {
			var member = lines[i].split(maindelimiter)[1];
			var themember = member.split(actiondelimiter)[0];
			var theaction = member.split(actiondelimiter)[1];
			if(!actions[themember]) {
				actions[themember] = [];
			}
			actions[themember].push(theaction)
		}
		if(lines[i].indexOf(motionkey) != -1) {
			var li = document.createElement("li");
			li.innerText = lines[i];
			mul.appendChild(li);
		}
	}

	var ActionsHeader = document.createElement("h3");
	ActionsHeader.innerText = "Actions:";
	var MotionsHeader = document.createElement("h3");
	ActionsHeader.innerText = "Actions:";
	MotionsHeader.innerText = "Motions:";
	ActsandMots.appendChild(ActionsHeader);
	console.log(actions);
	var actionsTable = convertToTable(actions);
	ActsandMots.appendChild(actionsTable);
	ActsandMots.appendChild(MotionsHeader);
	ActsandMots.appendChild(mul);
}





function convertToTable(obj) {
	var table = document.createElement("table");
	table.id = "ActionsTable";
	for(key in obj) {
		var tr = document.createElement("tr");
		var tdKey = document.createElement("td");
			tdKey.setAttribute("rowspan",obj[key].length);
			tdKey.innerText = key;
		tr.appendChild(tdKey);
		tdNote = document.createElement("td");
		if(obj[key][0]) {
			tdNote.innerText = obj[key][0].capitalizeFirstLetter();
			tr.appendChild(tdNote);
			table.appendChild(tr);
			for(var i=1; i<obj[key].length; i++) {
				var tr = document.createElement("tr");
				var tdNote = document.createElement("td");
				tdNote.innerText = obj[key][i].capitalizeFirstLetter();
				tr.appendChild(tdNote);
				table.appendChild(tr);
			}
		}
	}
	table.setAttribute("border","1");
	table.setAttribute("class","table table-condensed");
	table.setAttribute("style","width:600px");
	return table;
}








// Customize the Committee Name
function modifyName(num, name) {
	chrome.storage.sync.get({"committees":[]}, function(com) { 
		var selStyle = document.getElementById("selStyle");
		for(var i=0; i < com.committees.length; i++) {
			if(com.committees[i].num == num) {
				com.committees[i].committee = name;
			}
		}
		window.comList = com;
		chrome.storage.sync.set({committees:com.committees}, function() {
			alert("Committee name modified");
		});
	});
}




function saveUserInfo() {
	var userInfo = {
		firstName : document.getElementById("firstName").value,
		lastName : document.getElementById("lastName").value,
		phone : document.getElementById("workPhone").value,
		email : document.getElementById("workEmail").value
	}
	chrome.storage.sync.set({"userInfo":userInfo}, function() {
		pulse("input");
	});
}




function customStyleTable() {
	var bgcolor = document.getElementById("bgcolor-table").value;
	var brcolor = document.getElementById("brcolor-table").value;
	chrome.storage.sync.set({backgroundColor:bgcolor, borderColor:brcolor}, function() {
		pulse("#bgcolor-table");
		pulse("#brcolor-table");
		document.getElementById("testTH").setAttribute("style", "background-color:" + bgcolor + "; border: 1px solid " + brcolor + ";");

	});
}




function customStyleInput() {
	var bgcolor = document.getElementById("bgcolor-input").value;
	var brcolor = document.getElementById("brcolor-input").value;
	var txtcolor = document.getElementById("txtcolor-input").value;
	var threed = document.getElementById("3dfx").checked;

	chrome.storage.sync.set({inpColor:bgcolor, inpBorderColor:brcolor, threed:threed, inptxtColor:txtcolor}, function() {
		pulse("#bgcolor-input");
		pulse("#brcolor-input");
		pulse("#txtcolor-input");
		document.getElementById("inpStyle").style.backgroundColor = bgcolor;
		document.getElementById("inpStyle").style.borderColor = brcolor;
		document.getElementById("selStyle").style.backgroundColor = bgcolor;
		document.getElementById("selStyle").style.border = "1px solid " + brcolor;
		document.getElementById("selStyle").style.color = txtcolor;

		if(threed) {
			document.getElementById("inpStyle").style.boxShadow = "0 2px 5px 0 gray";
			document.getElementById("selStyle").style.boxShadow = "0 2px 5px 0 gray";
		}
	});
}





function pulse(target) {
	$(target).addClass("pulseIn");
	setTimeout(function() {
		$(target).removeClass("pulseIn");
	}, 500);
}




function CommitteeGroup(groupname, committeelist) {
	var self = this;
	this.divObj = document.createElement("div");
		this.divObj.className = "form committeegroup";

	this.removeSelf = function() {
		document.getElementById("committeegroups").removeChild(self.divObj);
		// Remove from memory
		chrome.storage.local.get({committeeGroups:{}}, function(g) {
			if(g.committeeGroups[self.titleInput.val()]) {
				delete g.committeeGroups[self.titleInput.val()];
				chrome.storage.local.set({"committeeGroups":g.committeeGroups});
			}
		});

		delete self;
	}
	this.topRow = new DivElem({appendTo:this.divObj, clss:"form-inline"});
	this.closebtn = new KYM_Button({appendTo:this.topRow, clss:"btn btn-danger btn-xs pull-right", clck:self.removeSelf, txt:"X"});
	var titleinputgroup = new DivElem({appendTo:this.topRow, type:"span", clss:"input-group"});
	var titlelabelspan = new DivElem({appendTo:titleinputgroup, type:"span", clss:"input-group-addon"})
	this.titleLabel = new DivElem({appendTo:titlelabelspan, type:"label", txt:"Group Title: "});
	this.titleInput = new TxtInput({appendTo:titleinputgroup, clss:"form-control"});
	this.committees = [];
	this.groupname = null;

	this.titleInput.divObj.addEventListener("keypress", function() {
		if(self.titleInput.val().length > 0) {
			self.titleInput.css();
		}
	});

	this.addCommittee = function() {
		var comTxtInput = new TxtInput({appendTo:self.comlist, clss:"form-control", list:"allCommittees"});
		self.committees.push(comTxtInput);
	};

	this.saveCommittees = function(){
		self.titleInput.css();
		if(self.titleInput.val().length == 0) {
			self.titleInput.css({backgroundColor:"#ffffcc", borderColor:"red"});
			alert("Group Title is required");
			return;
		}
		var coms = [];
		for(var i=0; i<self.committees.length; i++) {
			if(self.committees[i].val().length > 0)	coms.push(getCommitteeNum(self.committees[i].val()));
		}
		
		chrome.storage.local.get({committeeGroups:{}}, function(g) {
			g.committeeGroups[self.titleInput.val()] = coms;
			chrome.storage.local.set({"committeeGroups":g.committeeGroups});
			pulse(self.titleInput.divObj);
			pulse(self.addCommitteeBtn.divObj);
			pulse(self.saveBtn.divObj);
		});
	};

	this.addCommitteeBtn = new KYM_Button({appendTo:this.topRow, txt:"Add Committee", clss:"btn btn-default", clck:self.addCommittee});
	this.comlist = new DivElem({appendTo:this.divObj});

	this.saveBtn = new KYM_Button({appendTo:this.divObj, clss:"btn btn-primary", txt:"Save", clck:self.saveCommittees});

	if(groupname) {
		this.groupname = groupname;
		this.titleInput.val(groupname);
	} 
	if(committeelist) {
		for(var i=0; i<committeelist.length; i++) {
			var comTxtInput = new TxtInput({appendTo:self.comlist, clss:"form-control", list:"allCommittees", value:committeelist[i].committee});
			self.committees.push(comTxtInput);
		}
	}
	if(!committeelist) {
		this.addCommittee();
		this.addCommittee();
	}
	document.getElementById("committeegroups").appendChild(this.divObj);
}


