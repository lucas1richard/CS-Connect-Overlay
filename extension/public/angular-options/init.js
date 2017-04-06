// Put committees in a datalist
var allCommitteesElem = document.getElementById('allCommittees');
var committeeList = document.getElementById('committeeList');
for (var i = 0; i < allCommittees.length; i++) {
	var option = document.createElement('option');
		option.value = allCommittees[i].committee;
	var committee = document.createTextNode(allCommittees[i].num);
		option.appendChild(committee);
	allCommitteesElem.appendChild(option);
	var li = document.createElement('li');
	var committee2 = document.createTextNode(allCommittees[i].committee);
		li.appendChild(committee2);
		committeeList.appendChild(li);
}

// Referenced in saveCommittees()
function getCommitteeNum(committee) {
	if (!committee) return false;

	for (var i = 0; i < allCommittees.length; i++) {
		if (allCommittees[i].committee === committee) return allCommittees[i];
	}
	alert('There is no match for ' + committee);
	return false;
}
