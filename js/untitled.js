// This function starts the request and calls success on response.
var refresh = function(sentence) {
  $.ajax({
    url: "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2",
    body: {"text": sentence, "apikey": "6f10995a-e89c-40c4-b2d8-5e3a609c411f"},
    cache: false,
    success: success
  });
}

// Replaces the contents of the field with your response and
// triggers refresh() after 1000ms.
var success = function(data) {
  $(".field").html("harassment content");
  setTimeout(refresh, 1000);
}

// Starts processing when document is ready.
$(function() {
  refresh();
}