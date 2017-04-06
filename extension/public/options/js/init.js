function getVersion() { 
    var manifest = chrome.runtime.getManifest();
    return manifest.version; 
} 

function init() {

	window.shortList = document.getElementById("shortList");
	window.modificationsDOM = document.getElementById("modifications");
	window.latest = getVersion();

	// If the user is using the newest version for the first time, show the summary of modifications
	chrome.storage.sync.get({version:""}, function(v) {
		if(v.version != latest) {
			document.querySelector("body > div > div.row > span:nth-child(7)").click();
			chrome.storage.sync.set({version:latest}, function() {});
		}
	});


	String.prototype.capitalizeFirstLetter = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}

	chrome.storage.sync.get({"userInfo":false},function(item) {
		if(item.userInfo) {
			document.getElementById("firstName").value = item.userInfo.firstName;
			document.getElementById("lastName").value = item.userInfo.lastName;
			document.getElementById("workPhone").value = item.userInfo.phone;
			document.getElementById("workEmail").value = item.userInfo.email;
		}
	});


	// Put committees in a datalist
	var allCommitteesElem = document.getElementById("allCommittees");
	var committeeList = document.getElementById("committeeList");
	for(var i=0; i<allCommittees.length; i++) {
		var option = document.createElement("option");
			option.value = allCommittees[i].committee;
		var committee = document.createTextNode(allCommittees[i].num);
			option.appendChild(committee);
		allCommitteesElem.appendChild(option);
		var li = document.createElement("li");
		var committee2 = document.createTextNode(allCommittees[i].committee);
			li.appendChild(committee2);
			committeeList.appendChild(li);
	}

	chrome.storage.sync.get({
	    "backgroundColor": "white",
	    "borderColor": "black",
	    "inpColor": "white",
	    "inpBorderColor": "#dedede",
	    "inptxtColor":"black",
	    "threed":false
	  }, function(obj) {

	  	var testTH = document.getElementById("testTH");
	  	var inpStyle = document.getElementById("inpStyle");
	  	var selStyle = document.getElementById("selStyle");

	  testTH.style.backgroundColor = obj["backgroundColor"];
	  testTH.style.border = "1 px solid " + obj["borderColor"];

	  inpStyle.style.backgroundColor = obj["inpColor"];
	  inpStyle.style.border = "1px solid " + obj["inpBorderColor"];

	  selStyle.style.backgroundColor = obj["inpColor"];
	  selStyle.style.border = "1px solid " + obj["inpBorderColor"];

	  document.getElementById("bgcolor-input").value = obj["inpColor"];
	  document.getElementById("brcolor-input").value = obj["inpBorderColor"];
	  document.getElementById("txtcolor-input").value = obj["inptxtColor"];

	  if(obj.threed) {
	  	document.getElementById("3dfx").checked = obj.threed;
	  }
	});

	chrome.storage.sync.get({"committees":[]}, function(com) { 
		var selStyle = document.getElementById("selStyle");
		for(var i=0; i < com.committees.length; i++) {
			addCommittee(com.committees[i].committee);
			var opt = document.createElement("option");
			var comm = document.createTextNode(com.committees[i].committee);
			opt.appendChild(comm);
			selStyle.appendChild(opt);
		}
		if(com.committees.length == 0) {
			addCommittee();
			for(var i=1; i<4; i++) {
				if(com.committees[i]) {
					addCommittee(com.committees[i].committee);
					var opt = document.createElement("option");
					var comm = document.createTextNode("Option " + i);
					opt.appendChild(comm);
					selStyle.appendChild(opt);
				}
			}
		}
	});

	chrome.storage.local.get({"committeeGroups":{}}, function(g) {
		for(group in g.committeeGroups) {
			COMMITTEEGROUPS.push(new CommitteeGroup(group, g.committeeGroups[group]));
		}
	});

	chrome.storage.sync.get({
		componentballotdescription:"",
		componentballotexplanation:""
	}, function(d) {
		document.getElementById("componentballotdescription").value = d.componentballotdescription;
		document.getElementById("componentballotexplanation").value = d.componentballotexplanation;
	});


	document.getElementById("inpStyle").addEventListener("mouseenter", function() {
		$(this).val("Click on the boxes above")
		$(".inpStyleOption").css("border-width","2px");
		setTimeout(function() {
	      $(".inpStyleOption").css("border-width","1px");
	    }, 750);
	});

	document.getElementById("selStyle").addEventListener("mouseenter", function() {
		$("#inpStyle").val("Click on the boxes above")
		$(".inpStyleOption").css("border-width","2px");
		setTimeout(function() {
	      $(".inpStyleOption").css("border-width","1px");
	    }, 750);
	});

	document.getElementById("testTH").addEventListener("mouseenter", function() {
		$(this).html("Click on the boxes above")
		$(".headStyleOption").css("border-width","2px");
		setTimeout(function() {
			$(this).html("This is a table header");
	      	$(".headStyleOption").css("border-width","1px");
	    }, 750);
	});


	document.getElementById("customStyleInput").addEventListener("click", customStyleInput);

	document.getElementById("customStyleTable").addEventListener("click", customStyleTable);
	document.getElementById("savecomponentballotdescription").addEventListener("click", savecomponentballotdescription);
	document.getElementById("savecomponentballotexplanation").addEventListener("click", savecomponentballotexplanation);

	document.getElementById("saveUserInfo").addEventListener("click", function() {
		saveUserInfo();
	});

	document.getElementById("MinsBtn").addEventListener("click", function() {
		parseMinutes();
	});
	document.getElementById("extensionsLink").addEventListener("click",function(){
		chrome.tabs.create({url:'chrome://extensions'});
	});

	var saveCommitteesButton = document.getElementById("saveCommittees");
	saveCommitteesButton.addEventListener("click", saveCommittees);

	document.getElementById("clearStyleChanges").addEventListener("click", clearStyleChanges);
	document.getElementById("addCommittee").addEventListener("click", addCommittee);

	window.COMMITTEEGROUPS = [];
	document.getElementById("addcommitteegroup").addEventListener("click", addCommitteeGroup);

	for(var m=0; m<mods.length; m++) {
		displayModification(mods[m]);
	}
}



function addCommitteeGroup() {
	COMMITTEEGROUPS.push(new CommitteeGroup());
}



function displayModification(obj) {
	var out = "";
	out += "<div><b>Modification:</b> "+ obj.mod +"</div>";
	out += "<div><b>C&amp;S Connect Page: </b> "+ obj.page +"</div>";
	out += "<div><b>Function: </b> "+ obj.fnc +"</div>";
	if(obj.caveat) out += "<div><b>Caveat: </b> "+ obj.caveat +"</div>";
	out += "<div><small>Released version "+ obj.version +"</small></div>";

	if(obj.version == latest) {
		modificationsDOM.innerHTML += "<div style='color:#2b73b7'><h4>--- New ---</h4>"+ out +"</div>";
	} else {
		modificationsDOM.innerHTML += "<div>"+ out +"</div>";
	}
	
	modificationsDOM.innerHTML += "<hr/>";
}

var mods = [
	{
		mod:"Board inclusion", 
		page:"Component or Entire Document Ballot", 
		fnc:"For Standards Committee ballots, the appropriate Board is automatically included for review and comment",
		version:3.5
	},
	{
		mod:"Committee Groups", 
		page:"Component or Entire Document Ballot",
		fnc:"Lets you save a group to be added for normal ballot or for review by clicking a button",
		caveat:"Create the group in the Overlay Options page", 
		version:3.5
	},
	{
		mod:"Published records detection",
		page:"Record search page",
		fnc:"Checks records to determine if they have been published, and updates them with that status if applicable",
		caveat:"You must watch this tool in action and acknowledge when a record is updated. This tool enables you to modify records for committees for which you are not the staff secretary",
		version: 3.0
	},
	{
		mod:"Interpretation response email", 
		page:"Any interpretation record (view mode)", 
		fnc:"Generate email to inquirer when their inquiry is invalid",
		version: 2.5
	},
	{
		mod:"Custom style options", 
		page:"C&amp;S Connect Overlay Page (Style Options)", 
		fnc:"Create your own style rather than use a predefined style",
		caveat:"You need to reference an outside page to get color codes (link provided on page)",
		version: 2.5
	},
	{
		mod:"Component ballot explanation default", 
		page:"C&amp;S Connect Overlay Page (Input Defaults)", 
		fnc:"Set a default input for component ballot explanations. This is useful as a template for consistency.",
		caveat:"",
		version: 2.5
	},
	{
		mod:"Ballot closure vote tally for multiple records", 
		page:"Update Component Ballot page", 
		fnc:"Voting results are tallied and names are recorded as appropriate.",
		caveat:"This currently only works with one committee.",
		version: 2.5
	},
	{
		mod:"Ballot closure vote tally", 
		page:"Update Member Ballot page", 
		fnc:"Voting results are tallied and names are recorded as appropriate.",
		caveat:"This currently only works with one committee.",
		version: 2.5
	},
	{
		mod:"Record TPM email is a direct link", 
		page:"Any component record", 
		fnc:"Clicking on the TPM's email will open an Outlook email message prepopulated with the TPM's email, subject field, and email body. It will include your name if you provide it.",
		version: 2.0
	},
	{
		mod:"Quick View tool", 
		page:"Any page with the navigation bar", 
		fnc:"Open a new tab with the record or ballot entered without needing to go to the Search page.",
		version: 2.0
	},
	{
		mod:"Addition of Generate Interpretation Letter button at the top of the page", 
		page:"Any Interpretation Record", 
		fnc:"Clears the window and creates an interpretation letter with ASME letterhead, date, inquirer's address, subject, C/S edition, year, inquiry/response (as submitted to the database on submission), and your name if provided",
		caveat:"If your letter is more than one page long, the system will not break it into separate pages. You can still copy/paste the generated letter into a Word document and add the letterhead.", 
		version: 2.0
	},
	{
		mod:"Addition of Create Email List button", 
		page:"VCC page where you would actually write the email", 
		fnc:"Clears the window and creates a list of the committee members' email addresses which can be copy/paste to an email window.",
		version: 2.0
	},
	{
		mod:"Committee short list", 
		page:"Staff page and VCC page", 
		fnc:"The dropdown list will include a list at the top that contains the committees of your choosing.",
		caveat:"You must choose the committees on the Overlay Options page.", 
		version: 1.0
	},
	{
		mod:"Open Ballot automation", 
		page:"New Component Ballot or Recirculation Ballot page", 
		fnc:"Voting period ends is populated with 4 weeks or 2 weeks out, depending on the type of the ballot. Setting the committee level will automatically include the appropriate committee. Inclusion of records and changing the ballot level will automatically change the Description field and Opening Remarks field.",
		caveat:"Standards committee level ballots do not automatically include the Board for review and comment.", 
		version: 1.0
	},
	{
		mod:"Comment response warning", 
		page:"Any View Component Record page", 
		fnc:"Checks responses to comments and detects duplicates. If duplicates are found, a warning is displayed at the top of the page.",
		version: 2.0
	},
	{
		mod:"General ease of use", 
		page:"Search page", 
		fnc:"'Record' is automatically selected and the input field is focused, so you can just type without needing to click anything.",
		version: 1.0
	},
	{
		mod:"General ease of information", 
		page:"Ballot page", 
		fnc:"Different ballot types are color coded. Links that staff don't normally use are reduced. 'Voting Period Ends' is checked for each ballot; if the voting period has ended, the ballot will turn red and the 'Update' link will be highlighted.",
		version: 1.0
	},
	{
		mod:"General ease of information", 
		page:"Record Search Results page", 
		fnc:"If a record has been approved at a level lower than the Board, the font is red. If it has been approved at the Board level, the font is blue. Otherwise there is no change.",
		version: 1.0
	},
	{
		mod:"Addition of 'Reformat for Agenda' button", 
		page:"View Component Record page", 
		fnc:"Removes excess information boxes that contain no useful information (such as 'None'), and removes styles so the record can be printed directly to PDF instead of sending to Word.",
		version: 2.0
	},
	{
		mod:"Minutes Parser", 
		page:"Extension Options page", 
		fnc:"Compile a list of Actions and Motions recorded in meeting Minutes",
		caveat:"Minutes Actions and Motions must be in a specific format to be found by the program.", 
		version: 2.0
	},
	{
		mod:"Issuance letter capitalization", 
		page:"Any interpretation record (view mode)", 
		fnc:"Interpretation Issuance Letter corrects capitalization of the inquirer’s name/address.",
		version:3.1
	}, 
	{
		mod:"Quick view recirculation", 
		page:"Any page with the navigation bar", 
		fnc:"Quick view can open recirculation ballots.",
		caveat:"The tool will need to open two other windows which will self-close to find the recirculation ballot",
		version:3.1 
	}, 
	{
		mod:"Email list stacked", 
		page:"VCC page where you would actually write the email", 
		fnc:"Email list page includes a back button, removes duplicate emails, and stacks them instead of showing them inline.",
		version:3.1
	}, 
	{
		mod:"Motions key word", 
		page:"Extension Options page", 
		fnc:"Minutes parser can use different key words to detect Motions.",
		version:3.1
	},
	{
		mod:"Recircluation statement update", 
		page:"New recirculation ballot", 
		fnc:"Recirculation ballot statement updated with suggestion from Managing Director.",
		version:3.1
	},{
		mod:"Recirculation ballot description", 
		page:"New recirculation ballot", 
		fnc:"Recirculation ballots automatically update the description input from “Four weeks” to “Two weeks” and “first consideration” to “recirculation”.",
		version:3.1
	}
	// {
	// 	mod:"", 
	// 	page:"", 
	// 	fnc:"",
	// 	caveat:"", 
	// 	version:""
	// },
];
