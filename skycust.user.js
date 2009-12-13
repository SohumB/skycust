// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require          http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js
// @require          http://plugins.jquery.com/files/aqFloater.js.txt
//
// ==/UserScript==

var customisation_icon = 'http://images3.wikia.nocookie.net/Skyrates/images/9/99/Customisation_Icon.png';

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
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

function memoize(fn) {
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
      fn(name, success, failure);
    }
  };
}

function simple(url_base) {
  return memoize(
    function(name, success, failure) {
      var link = url_base + name;
      $.ajax({ url: link,
	       type: "GET",
	       success: function (response) { avatars[name] = link; success(link); },
	       error: function (req, stat, err) { avatars[name] = "not found"; failure(); }});
  });
}

// list of functions of form (name to check, success (link), failure())
var servers_text = GM_getValue('server_list');
if (servers_text) {
  servers_text = JSON.parse(servers_text);
} else {
  servers_text = [ 'spreadsheet("tINrGl7OrhT110weszgMnDw")' ];
}

var servers = servers_text.map(function(val, ind, thing) { return eval(val); });
function save_servers() {
  GM_setValue('server_list', JSON.stringify(servers_text));
  servers = servers_text.map(function(val, ind, thing) { return eval(val); });
}

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

$("head").append(
  '<style type="text/css">' +
    '.sortable { list-style-type: none; margin: 0; padding: 0; }' +
    '.sortable li { padding: 0.4em; font-size: 0.8em; }'
);

function add_to_list(list, itext) {
  list.append($('<li class="ui-state-default">' + itext + '</li>'));
}

var server_div = $('<div id="server_editor"></div>');

var list_div = $('<div></div>');
list_div.css({ height: '100%', width: '60%', float: 'left'});
var list = $('<ul class="sortable"></ul>');
for (i in servers_text) { add_to_list(list,servers_text[i]); }
list_div.append(list);

var add_div = $('<div></div>');
add_div.css({ height: '90%', width: '40%', float: 'left'});
var box = $('<input type="text">');
var add_as_simple = $('<a>Add as simple server</a>');
add_as_simple.click(function () { add_to_list(list, 'simple("' + box.val() + '")'); });
var add_as_spread = $('<a>Add as spreadsheet key</a>');
add_as_spread.click(function () { add_to_list(list, 'spreadsheet("' + box.val() + '")'); });
var area = $('<textarea rows="5"></textarea>');
var add_as_custom = $('<a>Add as custom function</a>');
add_as_custom.click(function () { add_to_list(list, area.val()); });
add_div
  .append(box).append("<br>")
  .append(add_as_simple).append("<br>")
  .append(add_as_spread).append("<br><br>")
  .append(area).append("<br>")
  .append(add_as_custom).append("<br>");

var button_div = $('<div></div>');
button_div.css({ height: '8%', width: '100%' });
var button = $('<button type="button">Save</button>');
button.click(function() {
  servers_text = list.children().map(function (i, li) { return $(li).text(); });
  save_servers();
});
button_div.append(button);

server_div.append(list_div).append(add_div).append(button_div);
server_div.css({ 'background-color': 'white', 'border': '1px solid black', 'position': 'absolute', width: '34%', padding: '1em' });
server_div.appendTo($("body"));
server_div.hide();
list.sortable();
list.disableSelection();

var img_div = $('<div></div>');
var custom_clicker = $('<img width="32px" height="32px" src="' + customisation_icon + '" />');
custom_clicker.click(
  function(e) {
    server_div.css({ left: e.pageX + 5, top: e.pageY + 5 });
    server_div.toggle();
  });
img_div.append(custom_clicker);
img_div.appendTo($("body"));
img_div.aqFloater({ attach: 'nw' });
