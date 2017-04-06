(function() {


  angular.module("pdh", ["services"]);
  angular
    .module("pdh")
    .controller("pdhCtrl", pdhCtrl);

  function pdhCtrl($scope, getJSON) {
    var vm = $scope;
    window.vm = $scope;

    vm.allCommittees = [];
    vm.appendSignature = appendSignature;
    vm.complete = complete;
    vm.selectedcommittee = "";
    vm.description = "Professional Development Hours (PDH) are made available to the following members of the [committee] in attendance:";
    vm.endtime = "";
    vm.realTime = realTime;
    vm.saveDescription = saveDescription;
    vm.starttime = "";
    vm.timeDiff = timeDiff;
    vm.totalbreaks = "";
    vm.staffName = "";
    vm.staffEmail = "";
    vm.staffPhone = "";

    activate();

    function activate() {
      chrome.storage.sync.get({"userInfo": false}, function(item) {
        if(item.userInfo) {
          vm.staffName = item.userInfo.firstName + " " + item.userInfo.lastName;
          vm.staffPhone = item.userInfo.phone;
          vm.staffEmail = item.userInfo.email;
        }
      });
      return getJSON.getdata("../../json/committees.json").then(function(r) {
        vm.allCommittees = r.data;
        return vm.allCommittees;
      });
    }

    function complete(c) {
      vm.committee = "";
      vm.selectedcommittee = c;
      vm.description = "Professional Development Hours (PDH) are made available to the following members of the [committee] in attendance:";
      vm.description = vm.description.replace(/\[committee\]/g, vm.selectedcommittee.committee);
      return chrome.storage.local.get({pdh_desc:{}}, function(d) {
        if(d.pdh_desc[c.num]) {
          vm.description = d.pdh_desc[c.num];
        }
        vm.description = vm.description.replace(/\[committee\]/g, vm.selectedcommittee.committee);
      });
    }

    function realTime(timeObj) {
      if(timeObj) {
        if(typeof timeObj == "object") {
          var tmp = timeObj.getHours();
          var tmpM = timeObj.getMinutes();
          var AMPM = "AM";
          if(tmp > 12) {
            tmp -= 12;
            AMPM = "PM";
          }
          if(tmpM < 10) tmpM = "0" + tmpM;

          return tmp + ":" + tmpM + " " + AMPM;
        }
      }
    }

    function saveDescription(num, desc) {
      return chrome.storage.local.get({pdh_desc:null}, function(d) {
        if(d.pdh_desc) {
          d.pdh_desc[num] = desc;
          chrome.storage.local.set({pdh_desc:d.pdh_desc});
        } else {
          chrome.storage.local.set({pdh_desc:{}}, function() {
            console.log("Setting initial custom description for " + num);
          });
        }
      });
    }

    function timeDiff(starttime, endtime) {
      if(endtime && starttime) {
        if(endtime < starttime) return "End time must be after start time";

        var dt = endtime-starttime;
        // return dt/1000/60;
        var dh = parseFloat(dt/1000/60/60);
        var dm = Math.round((dt/1000/60 - dh*60)*10)/10;

        return (dh+dm);
      }
    }

  }


})();

var fileInp = document.getElementById("fileInp");
var img = document.getElementById("signature");
fileInp.addEventListener("change", appendSignature);
function appendSignature() {
  var input = fileInp;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
  img.removeAttribute("width");
  // fileInp.style.display = "none";
  document.getElementById("tmpSig").style.display = "none";
  img.removeAttribute("style");
}