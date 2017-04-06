import { makePageSmall, insertScript } from './utils';

export default function formatUpdateInterpretationRecord() {
	makePageSmall();

	var actualCode = '(' + function() {

		var updateBtn = document.querySelectorAll('[value="Update Record"]');
		updateBtn[0].setAttribute('onclick', 'checkInputs(); var me = AddCommittee(); return me;');
		updateBtn[1].setAttribute('onclick', 'checkInputs(); var me = AddCommittee(); return me;');
		console.log(updateBtn);

	} + ')();' + function checkInputs() {

		var proposed = document.querySelector('#ItemDescription > tbody > tr:nth-child(4) > td > textarea');
		var explanation = document.querySelector('#ItemDescription > tbody > tr:nth-child(6) > td > textarea');

		if (proposed.value === '') proposed.value = 'To be Decided';
		if (explanation.value === '') explanation.value = 'To be Decided';

	};
	insertScript(actualCode);
}
