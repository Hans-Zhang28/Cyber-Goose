/*
 * Cyber Goose Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of harassment content from the web page.
 */


var getNewParas = function() {
	arrayOfParas = $(baseId + ' p').toArray();
	var len = arrayOfParas.length;
	for (var j = i; j < len; j++) {
		newArrayOfParas[j] = {"id": arrayOfParas[j].parentElement, "content": arrayOfParas[j].textContent};
	}
	i = j;
}

var postReq = function(text, elementId) {
	// console.log(text);
	runningStatus = true;
	runningId = elementId;
	if (text != "") {
		var body = {
		  "documents": [
		    {
		      "language": "en",
		      "id": "string",
		      "text": text
		    }
		  ]
		};		
		$.ajax({
			url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
			beforeSend: function(xhrObj){
	        // Request headers
	        xhrObj.setRequestHeader("Content-Type","application/json");
	        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","dfa74b07190b406e8bc0f37ca0dedf0d");
	        },
	        type: "POST",
	        // Request body
	        data: JSON.stringify(body)
	    })
	    .done(function(data) {
	        removeHarassmentElement(data, elementId);
	    })	
	}
	runningStatus = false;
}

var checkRunningStatus = function(content, id) {
	if (para1.id != runningId && !runningStatus) {
		postReq(para.content, para.id);		
	} else {
		setTimeout(checkRunningStatus(para.content, para.id), 1000);
	}
}

// This function starts the request and calls success on response.
var checkSensitiveSentence = function() {	
	var k = 0;
	$.map(newArrayOfParas, function(para) {
		var content = para.content;
		if (k == 0) {
			postReq(para.content, para.id);	
		} else {		
			checkRunningStatus(para.content, para.id);		
		}		
	})  	
}

// Replaces the contents of the field with your response and
// triggers refresh() after 1000ms.
var removeHarassmentElement = function(data, elementId) {
	// console.log(data);
	if (data.documents[0].score < 0.5) {
		$(elementId).html("Harassment Contents");		
	} 
}

$(window).bind('scroll', bindScroll);
var baseId = '#contentArea';
var nearToBottom = 100;
var arrayOfParas = [];
var newArrayOfParas = [];
var runningId;
var runningStatus = false;

var i = 0;
arrayOfParas = $(baseId + ' p').toArray();
$.map(arrayOfParas, function(para) {	
	// if (para.content == '') {
	// 	console.log(JSON.stringify(para));
	// }
	newArrayOfParas[i] = {"id": para.parentElement, "content": para.textContent};
	i++;
	checkSensitiveSentence();
})	

function bindScroll() {		
	if ($(window).scrollTop() + $(window).height() > 
		$(document).height() - nearToBottom) { 		
		$(window).unbind('scroll');
		checkSensitiveSentence();
		$(window).bind('scroll', bindScroll);
		getNewParas();
	}
}

$(window).on('hashchange', function() {
	$(window).bind('scroll', bindScroll);
	var baseId = '#contentArea';
	var nearToBottom = 100;
	var arrayOfParas = [];
	var newArrayOfParas = [];

	var i = 0;
	arrayOfParas = $(baseId + ' p').toArray();
	$.map(arrayOfParas, function(para) {	
	// if (para.content == '') {
	// console.log(JSON.stringify(para));
	// }
	newArrayOfParas[i] = {"id": para.parentElement, "content": para.textContent};
	i++;
	checkSensitiveSentence();
	})	

	function bindScroll() {		
	if ($(window).scrollTop() + $(window).height() > 
		$(document).height() - nearToBottom) { 		
		$(window).unbind('scroll');
		checkSensitiveSentence();
		$(window).bind('scroll', bindScroll);
		getNewParas();
	}
	}
});


