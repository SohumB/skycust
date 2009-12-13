// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var servers = [ "http://skyrates.jusque.net/skycust/",
		"http://skyrates.jusque.net/skyrates/" ];

var local = { 'Sadistica': 'http://skyrates.jusque.net/betsy.png' };

function set_avatar_link(span, link) {
  $(span).find('span.postdetails img').attr({src: link});
}

function check_asynchronously(span, name, which_server) {
  if (servers[which_server]) {
    var link = servers[which_server] + name;
    $.ajax({ url : link,
	     type: "GET",
	     success: function (response) { set_avatar_link(span, link); },
	     error: function (req,stat,err) { check_asynchronously(span, name, which_server+1); }});
  }
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
