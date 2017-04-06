(function() {
	var errorspan = document.getElementById("errormsg");
	document.getElementById("submitpassword").addEventListener("click", function() {
		var password = document.getElementById("password").value;
		if(password == "ASME_1234") {
			chrome.storage.sync.set({"accessEnabled":true}, function() {
				errorspan.innerText = "Access Enabled";
			});
		} else {
			errorspan.innerText = "Incorrect password";
		}
	});
})();