  var names = [];
    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
	if (request.ajax) {
	  var details = request.ajax;
	  details.success = function(r) { sendResponse({ success: true, response: r }); };
	  details.error = function(r,s,e) { sendResponse({ failure: true, response: r, status: s, error: e }); };
	  $.ajax(details);
	} else if (request.xhr) {
	  var details = request.xhr;
	  var xhr = new XMLHttpRequest();
	  xhr.open(details.method, details.url, true);
	  xhr.onreadystatechange = function() {
	    if (xhr.readyState != 4) { return; }
	    if (xhr.status != 200) {
	      sendResponse({ onerror: true, response: xhr });
	      return;
	    } else {
	      sendResponse({ onload: true, response: xhr });
	    }
	  }
	  xhr.send();
	} else if (request.get_local) {
	  sendResponse(localStorage[request.key]);
	} else if (request.save_local) {
	  localStorage[request.key] = request.value;
	  sendResponse(null);
	} else if (request.check_name_cache) {
	  var name = request.check_name_cache;
	  sendResponse(names[name]);
	} else if (request.set_name_cache) {
	  names[request.set_name_cache] = request.to;
	  sendResponse(null);
	} else if (request.attach_customisation_window) {
	  chrome.pageAction.show(sender.tab.id);
	  sendResponse(null);
	}
      });
