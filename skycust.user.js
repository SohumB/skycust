// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

// list of functions of form (name to check, success (link), failure())
var servers = [ spreadsheet("tINrGl7OrhT110weszgMnDw") ];

var local = GM_getValue('override_local');
if (local) { local = JSON.parse(local); } else { local = {}; }
function save_local() {
  GM_setValue('override_local', JSON.stringify(local));
}

function set_avatar_link(span, link) {
  $(span).find('span.postdetails img').attr({ src: link,
					      title: "Click to override this custom avatar"
  });
}

function add_override_link(span, name) {
  var img = $(span).find('span.postdetails img');
  var original = img.attr("src");
  var colour = img.parent().parent().css("background-color");
  var set_and_save = function(new_local) {
    local[name] = new_local;
    save_local();
    find_and_set_avatar(span, name);
    overrider.hide();
  };

  var overrider = $('<div class="overrider"></div>');
  var default_link = $('<a>Override to original skyrates art</a>');
  default_link.click(function () { set_and_save(original); });
  var custom_textbox = $('<input type="text"></input>');
  custom_textbox.css({ width: 100 });
  var custom_link = $('<a>Override to this custom URL</a>');
  custom_link.click(function () { set_and_save(custom_textbox.val()); });
  var clear_link = $('<a>Clear this override</a>');
  clear_link.click(function () { set_and_save(undefined); });

  overrider
    .append(default_link).append("<br><br>")
    .append(custom_textbox).append("<br>")
    .append(custom_link).append("<br><br>")
    .append(clear_link);
  overrider.appendTo($("body"));
  overrider.css({ 'width': 150,
		  'display': "inline-block",
		  'background-color': colour,
		  'border': '2px inset black',
		  'position': "absolute" });
  overrider.hide();

  img.attr({ title: "Click to override this with a custom avatar" });
  img.click( function(e) {
    overrider.toggle();
    overrider.css({ left: e.pageX + 5, top: e.pageY + 5 });
  });
}

function simple(url_base) {
  var avatars = {};
  return function(name,success,failure) {
    cached = avatars[name];
    if (cached) {
      if (cached != "not found") {
	success(avatars[name]);
      } else {
	failure();
      }
    } else {
      var link = url_base + name;
      $.ajax({ url: link,
	       type: "GET",
	       success: function (response) { avatars[name] = link; success(link); },
	       error: function (req, stat, err) { avatars[name] = "not found"; failure(); }});
    }
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
    } else { check_avatars(); }
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
  add_override_link(this, name);
  find_and_set_avatar(this, name);
});
