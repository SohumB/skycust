// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

// list of functions of form (name to check, success (link), failure())
var servers = [ spreadsheet("tINrGl7OrhT110weszgMnDw") ];

var local = { 'Sadistica': 'http://skyrates.jusque.net/betsy.png' };

function set_avatar_link(span, link) {
  $(span).find('span.postdetails img').attr({src: link});
}

function simple(url_base) {
  return function(name,success,failure) {
    var link = url_base + name;
    $.ajax({ url: link,
	     type: "GET",
	     success: function (response) { success(link); },
	     error: function (req, stat, err) { failure(); }});
  };
}

function spreadsheet(key) {
  var avatars;
  return function(name,success,failure) {
    var check_avatars = function () {
      if (avatars[name]) { success(avatars[name]); } else { failure(); }
    };
    if (!avatars) {
      GM_xmlhttpRequest({
	url: 'http://spreadsheets.google.com/feeds/list/' + key + '/1/public/values?alt=json',
	method: 'GET',
	onload: function(response) { response = JSON.parse(response.responseText);
				     avatars = {};
				     $.each(response.feed.entry, function(i, entry) {
				       avatars[entry.gsx$name.$t] = entry.gsx$avatar.$t;
				     });
				     check_avatars();
				   },
	onerror: function(response) { failure(); }});
    } else { unsafeWindow.console.log("with cached json: " + name); check_avatars(); }
  };
}

function check_asynchronously(span, name, which_server) {
  var fn = servers[which_server];
  if (fn) { fn(name,
	       function(link) { set_avatar_link(span, link); },
	       function() { check_asynchronously(span, name, which_server+1); }); }
}

function find_and_set_avatar(span, name) {
  var link = local[name];
  if (link) { set_avatar_link(span,link); return; }

  check_asynchronously(span, name, 0);
}

$('td:has(span.name):has(span.postdetails)').each(function () {
  var name = $(this).find('span.name').text();
  find_and_set_avatar(this, name);
});
