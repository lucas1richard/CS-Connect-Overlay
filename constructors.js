// -
//  --
//   --- This is the main prototype
//  --
// -
function CustomMethods() {
	this.chngID = function(ID) {
		this.identity = ID;
		this.divObj.setAttribute("id",this.identity);
	};
	this.setStyle = function(styleObj) {
		var styl = "";
		for(attr in styleObj) {
			styl += attr + ":" + styleObj[attr] + ";";
		}
		this.divObj.setAttribute("style", styl);
	};
	this.changeClass = function(newClass) {
		this.clss = newClass;
		this.divObj.setAttribute("class", newClass);
	};
	this.append = function(variable) {
		if(variable instanceof HTMLElement) this.divObj.appendChild(variable);
		else this.divObj.appendChild(variable.divObj);
	};
	this.remove = function(variable) {
		this.divObj.removeChild(variable.divObj)
	};
	this.setAttr = function(attr, val, obj) {
		this[attr] = val;
		if(!obj) this.divObj.setAttribute(attr, val);
	};
	this.removeAttr = function(attr, obj) {
		this[attr] = null;
		if(!obj) this.divObj.removeAttribute(attr);
	};
	this.val = function(v) {
		if(v) {
			this.divObj.value = v;
			this.value = v;
		} else {
			if(this.divObj.type == "number")
			{
				return parseFloat(this.divObj.value);
			} else {
				return this.divObj.value;
			}
		}
	}
	this.appendSelf = function(target) {
		if(target instanceof HTMLElement) target.appendChild(this.divObj);
		else { target.append(this); }
	}
	this.removeSelf = function() {
		this.divObj.parentNode.removeChild(this.divObj);
	}
	this.css = function(cssChanges) {
		if(!cssChanges) {
			this.removeAttr("style");
		}
		for(key in cssChanges) {
			this.divObj.style[key] = cssChanges[key];
		}
	}
	this.setParent = function(target) {
		if(typeof(target) == "object") {
			this.parentObj = target;
			this.divObj.parentObj = target;
		} else {
			throw "TypeError: The target is not an object. You can set references with setAttr()";
		}
	}
	this.addClass = function(clss) {
		this.divObj.className += " " + clss;
	}
}





function KYM_Button(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createElement("button");
	if(this.identity) this.divObj.setAttribute("id", this.identity);
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.clck) this.divObj.addEventListener("click", this.clck);
	if(this.style) this.divObj.setAttribute("style", this.style);
	if(this.txt) {
		this.txt = new KYM_Text({appendTo:this.divObj, txt:this.txt});
	}
	if(this.type) this.divObj.setAttribute("type",this.type);

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
}
KYM_Button.prototype = new CustomMethods();
KYM_Button.prototype.constructor = KYM_Button;





function DivElem(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	if(this.type) {
		this.divObj = document.createElement(this.type);
	}
	else { 
		this.divObj = document.createElement("div"); 
	}
	if(this.identity) this.divObj.setAttribute("id", this.identity);
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.style) this.divObj.setAttribute("style", this.style);
	if(this.txt) this.divObj.innerText = this.txt;

	this.val = function(txt) {
		if(txt) {
			this.divObj.innerText = txt;	
		} else {
			return this.divObj.innerText;
		}
	}

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
	}
}
DivElem.prototype = new CustomMethods();
DivElem.prototype.constructor = DivElem;






function LinkElem(obj) {
	this.hrf="#";

	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createElement("a");
	if(this.trgt) this.divObj.setAttribute("target",this.trgt);
	if(this.hrf) this.divObj.setAttribute("href",this.hrf);
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.style) this.divObj.setAttribute("style", this.style);
	if(this.identity) this.divObj.setAttribute("id", this.identity);
	if(this.txt) this.divObj.innerText = this.txt;

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
}
LinkElem.prototype = new CustomMethods();
LinkElem.prototype.constructor = LinkElem;







function JSelection(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createElement("select");
	if(this.identity) this.divObj.setAttribute("id", this.identity);
	if(this.identity) this.divObj.setAttribute("name", this.identity);
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.style) this.divObj.setAttribute("style", this.style);
	if(this.type) this.divObj.setAttribute("type", this.type);
	//if(this.chnge) this.divObj.setAttribute("onchange", this.chnge);
	if(this.chnge) this.divObj.addEventListener("change", this.chnge);
	this.removeOption = function(index) {
		this.divObj.removeChild(this.divObj.childNodes[index]);
	};

	var i=0;
	for(i=0;i<this.options.length;i++) {
		if(this.options[i].val) {
			var option = document.createElement("option");
			option.setAttribute("value", this.options[i].val);
			var optTxt = document.createTextNode(this.options[i].txt);
			option.appendChild(optTxt);
			this.divObj.appendChild(option);
			if(this.options[i].sel) {
				option.setAttribute("selected", true);
			}
		}
		else if(this.options[i].sel) {
			var option = document.createElement("option");
			option.setAttribute("value", this.options[i].txt);
			var optTxt = document.createTextNode(this.options[i].txt);
			option.appendChild(optTxt);
			this.divObj.appendChild(option);
			if(this.options[i].sel) {
				option.setAttribute("selected", true);
			}
		}
		else {
			var option = document.createElement("option");
			option.setAttribute("value", this.options[i]);
			var optTxt = document.createTextNode(this.options[i]);
			option.appendChild(optTxt);
			this.divObj.appendChild(option);
		}
	}
	if(this.value) {
		this.divObj.value = this.value;
	}
	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
	this.getTxt = function() {
		var selVal = this.val();
		for(i=0;i<this.options.length; i++) {
			if(this.options[i].val == selVal) {
				return this.options[i].txt;
			}
		}
	}
}
JSelection.prototype = new CustomMethods();
JSelection.prototype.constructor = JSelection;






function NumInput(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}
	this.divObj = document.createElement("input");
	this.divObj.setAttribute("type","number");

	if(this.identity) {
		this.divObj.setAttribute("id", this.identity);
		this.divObj.setAttribute("name", this.identity);
	}
	if(this.min) this.divObj.setAttribute("min", parseFloat(this.min));
	if(this.max) this.divObj.setAttribute("max", parseFloat(this.max));
	if(this.step) this.divObj.setAttribute("step", this.step);
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.chng) this.divObj.setAttribute("onchange", this.chng);
	if(this.style) this.divObj.setAttribute("style", this.style);
	if(this.placeholder) this.divObj.setAttribute("placeholder", this.placeholder);

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
}
NumInput.prototype = new CustomMethods();
NumInput.prototype.constructor = NumInput;






function TxtInput(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}
	this.divObj = document.createElement("input");
	this.divObj.setAttribute("type","text");

	if(this.identity) {
		this.divObj.setAttribute("id", this.identity);
		this.divObj.setAttribute("name", this.identity);
	}
	if(this.clss) this.divObj.setAttribute("class", this.clss);
	if(this.chng) this.divObj.setAttribute("onchange", this.chng);
	if(this.placeholder) this.divObj.setAttribute("placeholder", this.placeholder);
	if(this.value) this.divObj.setAttribute("value", this.value);
	if(this.list) this.divObj.setAttribute("list", this.list);

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
}
TxtInput.prototype = new CustomMethods();
NumInput.prototype.constructor = TxtInput;







function KYM_Text(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createTextNode(this.txt);
	if(this.appendTo) {
		this.appendSelf(this.appendTo);
	}
	this.val = function(txt) {
		var parent = this.divObj.parentNode;
		var tmp = document.createTextNode(txt);
		parent.replaceChild(tmp, this.divObj);
		this.divObj = tmp
	}
}
KYM_Text.prototype = new CustomMethods();
KYM_Text.prototype.constructor = KYM_Text;






function Label(obj) {
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createElement("label");
	if(this.txt) {
		var txt = document.createTextNode(this.txt);
		this.divObj.appendChild(txt);
	}
	if(!this.txt) {
		var txt = document.createTextNode("Specify Text");
		this.divObj.appendChild(txt);
	}
	if(this.forInp) {
		this.divObj.setAttribute("for", this.forInp);
	}
	/*if(this.clss) {
		this.divObj.setAttribute("class", this.clss);
	}*/
	if(this.appendTo) {
		this.appendSelf(this.appendTo);
	}
}
Label.prototype = new CustomMethods();
Label.prototype.constructor = Label;





// Object should include the following parameters:
// - clss
// - title
// - bodyContent
// - footerContent
function Panel(obj) {
	this.clss = "default";
	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.thePanel = new DivElem({clss:"panel panel-" + this.clss});

	this.divObj = this.thePanel.divObj;

	this.heading = new DivElem({appendTo:this.thePanel, clss:"panel-heading"});
	if(this.panelBody != false) this.panelBody = new DivElem({appendTo:this.thePanel, clss:"panel-body"});
	this.footer = new DivElem({appendTo:this.thePanel, clss:"panel-footer"});

	if(this.title) {
		var h4 = new DivElem({appendTo:this.heading, type:"h4", clss:"panel-title"});
		var title = new KYM_Text({appendTo:h4, txt:this.title});
	}
	if(this.bodyContent) {
		if(typeof(this.bodyContent) == "string") {
			var bodyContent = new KYM_Text({appendTo:this.panelBody, txt:this.bodyContent});
		}
		if(typeof(this.bodyContent) == "object") {
			this.bodyContent.appendSelf(this.panelBody);
		}
	}
	if(this.footerContent) {
		if(typeof(this.footerContent) == "string") {
			var footerContent = new KYM_Text({appendTo:this.footer, txt:this.footerContent});
		}
		if(typeof(this.footerContent) == "object") {
			this.footerContent.appendSelf(this.footer);
		}

	}
	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}
}
Panel.prototype = new CustomMethods();
Panel.prototype.constructor = Panel;






function Table(obj) {
	this.clss = "table table-condensed";

	for(attr in obj) {
		this[attr] = obj[attr];
	}

	this.divObj = document.createElement("table");
	this.head = document.createElement("thead");
	this.head.setAttribute("class","text-centered");
	this.body = document.createElement("tbody");
	this.caption = document.createElement("caption");

	this.divObj.appendChild(this.head);
	this.divObj.appendChild(this.body);
	this.divObj.setAttribute("class", this.clss);
	if(this.captionTxt) {
		this.captionTxt = new KYM_Text({appendTo:this.caption, txt:this.captionTxt});
		this.divObj.appendChild(this.caption);
	}
	if(this.heading) {
		var tr = document.createElement("tr");
		for(var i=0; i<this.heading.length; i++) {
			var th = document.createElement("th");
			var txt = document.createTextNode(this.heading[i]);

			th.appendChild(txt);
			tr.appendChild(th);
		}
		this.head.appendChild(tr);
	}

	if(this.row) {
		for(var i=0; i<this.row.length; i++) {
			var tr = document.createElement("tr");
			for(var j=0; j<this.row[i].length; j++) {
				var td = document.createElement("td");
				if(this.row[i][j] instanceof HTMLElement) {
					td.appendChild(this.row[i][j]);
				}
				else if(typeof(this.row[i][j]) == "string") {
					this.row[i][j] = new KYM_Text({txt:this.row[i][j], appendTo:td});
				}
				else if(typeof(this.row[i][j]) == "number") {
					this.row[i][j] = new KYM_Text({txt:this.row[i][j], appendTo:td});
				}
				else if(typeof(this.row[i][j]) == "object") {
					var td = document.createElement("td");
					td.appendChild(this.row[i][j].divObj);
				}
				tr.appendChild(td);
			}
			this.body.appendChild(tr);
		}
	}

	if(this.appendTo) {
		this.appendSelf(this.appendTo);
		this.setParent(this.appendTo);
	}

	this.appendRow = function(rowArray, index) {
		
		if(!index) {
			this.row.push(rowArray);
			var tr = document.createElement("tr");
			for(var i=0; i<rowArray.length; i++) {
				var td = document.createElement("td");
				if(rowArray[i] instanceof HTMLElement) {
					td.appendChild(rowArray[i]);
				}
				else if(typeof(rowArray[i]) == "string" || typeof(rowArray[i]) == "number") {
					this.row[this.row.length-1][i] = new KYM_Text({txt:rowArray[i], appendTo:td});
				}
				else if(typeof(rowArray[i]) == "object") {
					td.appendChild(rowArray[i].divObj);
				}
				tr.appendChild(td);
			}
			this.body.appendChild(tr);
		}
	}

	this.appendHeading = function(headArray) {
		if(this.heading) this.heading.push(headArray);
		if(!this.heading) this.heading = headArray;
		var tr = document.createElement("tr");
		for(var i=0; i<headArray.length; i++) {
			var th = document.createElement("th");
			if(headArray[i] instanceof HTMLElement) {
				th.appendChild(headArray[i]);
			}
			else if(typeof(headArray[i]) == "string" || typeof(headArray[i]) == "number") {
				var txt = document.createTextNode(headArray[i]);
				th.appendChild(txt);
			}
			else if(typeof(headArray[i]) == "object") {
				th.appendChild(headArray[i].divObj);
			}
			tr.appendChild(th);
		}
		this.head.appendChild(tr);
	}

	this.changeCell = function(theRow, column, newThing) {
		theRow = parseInt(theRow);
		column = parseInt(column);
		var theCell = this.divObj.tBodies[0].rows[theRow].children[column];

		while(theCell.firstChild) theCell.removeChild(theCell.firstChild);
		theCell.appendChild(newThing.divObj);
		this.row[theRow][column] = newThing;
	}

	this.cellAttribute = function(theRow, column, attribute, val) {
		theRow = parseInt(theRow);
		column = parseInt(column);
		var theCell = this.divObj.tBodies[0].rows[theRow].children[column];
		theCell.setAttribute(attribute, val);
	}
	this.colAttribute = function(col, attr, val) {
		column = parseInt(col);
		for(var i=0; i<this.row.length; i++) {
			var theCell = this.divObj.tBodies[0].rows[i].children[column];
			theCell.setAttribute(attr, val);		
		}
	}
}
Table.prototype = new CustomMethods();
Table.prototype.constructor = Table;





function cleanOut(element) {
	if(element instanceof HTMLElement) {
		while(element.firstChild) {
			element.removeChild(element.firstChild);
		}
		return;
	}
	while(element.divObj.firstChild) {
		element.divObj.removeChild(element.divObj.firstChild);
	}
}




function Space(target) {
	this.divObj = document.createTextNode(" ");
	this.appendSelf(target);
}
Space.prototype = new CustomMethods();
Space.prototype.constructor = Space;




Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
var DateDiff = {

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseFloat((t2-t1)/(24*3600*1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseFloat((t2-t1)/(24*3600*1000*7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}