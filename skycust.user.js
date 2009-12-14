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

// Chrome compatibility layer
function GM_getValue(name, def) {
  if (localStorage[name]) {
    return localStorage[name];
  } else if (def) {
    return def;
  } else {
    return null;
  }
}

function GM_setValue(name, val) {
  localStorage[name] = val;
}

function GM_xmlhttpRequest(details) {
  var onload = details.onload;
  var onerror = details.onerror;
  details.onload = undefined;
  details.onerror = undefined;
  chrome.extension.sendRequest({xhr: details},
			       function(response) { if (response.onload && onload) { onload(response.response); }
						    else if (response.onerror && onerror) { onerror(response.response); } });
}

$.ajax = function (details) {
  var success = details.success;
  var error = details.error;
  details.success = undefined;
  details.error = undefined;
  chrome.extension.sendRequest({ajax: details}, function(response) { if (response.success && success) { success(response.response); }
							     else if (response.failure && failure) { failure(response.response, response.status, response.error); } });
}

var customisation_icon = chrome.extension.getURL('icon.png');
var up_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEGSURBVDjLpZM/LwRRFMXPspmEaGc1shHRaiXsJ5GIRixbCr6SikxIlqgJM5UohIiGdofovHf/PZVmYwZvTntPfjnn3txWCAFNNFE33L/ZKXYv+1dRgL3r7bu0PbucJp3e4GLjtsrXGq9wkA8SU7tPk87i/MwCzAyP5QNeytcnJl46XMuoNoGKDoVlTkQhJpAgmJqcBjnqkqPTXxN8qz9cD6vdHtQMxXOBt49y5XjzLB/3tau6kWewKiwoRu8jZFvn+U++GgCBlWFBQY4qr1ANcAQxgQaFjwH4TwYrQ5skYBOYKbzjiASOwCrNd2BBwZ4jAcowGJgkAuAZ2dEJhAUqij//wn/1BesSumImTttSAAAAAElFTkSuQmCC';
var down_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAENSURBVDjLpZM/SwNREMTnxBRpFYmctaKCfwrBSCrRLuL3iEW6+EEUG8XvIVjYWNgJdhFjIXamv3s7u/ssrtO7hFy2fcOPmd03SYwR88xi1cPgpRdjjDB1mBquju+TMt1CFcDd0V7q4GilAwpnd2A0qCvcHRSdHUBqAYgOyaUGIBQAc4fkNSJIIGgGj4ZQx4EEAY3waPUiSC5FhLoOQkbQCJvioPQfnN2ctpuNJugKNUWYsMR/gO71yYPk8tRaboGmoCvS1RQ7/c1sq7f+OBUQcjkPGb9+xmOoF6ckCQb9pmj3rz6pKtPB5e5rmq7tmxk+hqO34e1or0yXTGrj9sXGs1Ib73efh1WaZN46/wI8JLfHaN24FwAAAABJRU5ErkJggg==';
var add_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJvSURBVDjLpZPrS5NhGIf9W7YvBYOkhlkoqCklWChv2WyKik7blnNris72bi6dus0DLZ0TDxW1odtopDs4D8MDZuLU0kXq61CijSIIasOvv94VTUfLiB74fXngup7nvrnvJABJ/5PfLnTTdcwOj4RsdYmo5glBWP6iOtzwvIKSWstI0Wgx80SBblpKtE9KQs/We7EaWoT/8wbWP61gMmCH0lMDvokT4j25TiQU/ITFkek9Ow6+7WH2gwsmahCPdwyw75uw9HEO2gUZSkfyI9zBPCJOoJ2SMmg46N61YO/rNoa39Xi41oFuXysMfh36/Fp0b7bAfWAH6RGi0HglWNCbzYgJaFjRv6zGuy+b9It96N3SQvNKiV9HvSaDfFEIxXItnPs23BzJQd6DDEVM0OKsoVwBG/1VMzpXVWhbkUM2K4oJBDYuGmbKIJ0qxsAbHfRLzbjcnUbFBIpx/qH3vQv9b3U03IQ/HfFkERTzfFj8w8jSpR7GBE123uFEYAzaDRIqX/2JAtJbDat/COkd7CNBva2cMvq0MGxp0PRSCPF8BXjWG3FgNHc9XPT71Ojy3sMFdfJRCeKxEsVtKwFHwALZfCUk3tIfNR8XiJwc1LmL4dg141JPKtj3WUdNFJqLGFVPC4OkR4BxajTWsChY64wmCnMxsWPCHcutKBxMVp5mxA1S+aMComToaqTRUQknLTH62kHOVEE+VQnjahscNCy0cMBWsSI0TCQcZc5ALkEYckL5A5noWSBhfm2AecMAjbcRWV0pUTh0HE64TNf0mczcnnQyu/MilaFJCae1nw2fbz1DnVOxyGTlKeZft/Ff8x1BRssfACjTwQAAAABJRU5ErkJggg==';
var del_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJdSURBVDjLpZP7S1NhGMf9W7YfogSJboSEUVCY8zJ31trcps6zTI9bLGJpjp1hmkGNxVz4Q6ildtXKXzJNbJRaRmrXoeWx8tJOTWptnrNryre5YCYuI3rh+8vL+/m8PA/PkwIg5X+y5mJWrxfOUBXm91QZM6UluUmthntHqplxUml2lciF6wrmdHriI0Wx3xw2hAediLwZRWRkCPzdDswaSvGqkGCfq8VEUsEyPF1O8Qu3O7A09RbRvjuIttsRbT6HHzebsDjcB4/JgFFlNv9MnkmsEszodIIY7Oaut2OJcSF68Qx8dgv8tmqEL1gQaaARtp5A+N4NzB0lMXxon/uxbI8gIYjB9HytGYuusfiPIQcN71kjgnW6VeFOkgh3XcHLvAwMSDPohOADdYQJdF1FtLMZPmslvhZJk2ahkgRvq4HHUoWHRDqTEDDl2mDkfheiDgt8pw340/EocuClCuFvboQzb0cwIZgki4KhzlaE6w0InipbVzBfqoK/qRH94i0rgokSFeO11iBkp8EdV8cfJo0yD75aE2ZNRvSJ0lZKcBXLaUYmQrCzDT6tDN5SyRqYlWeDLZAg0H4JQ+Jt6M3atNLE10VSwQsN4Z6r0CBwqzXesHmV+BeoyAUri8EyMfi2FowXS5dhd7doo2DVII0V5BAjigP89GEVAtda8b2ehodU4rNaAW+dGfzlFkyo89GTlcrHYCLpKD+V7yeeHNzLjkp24Uu1Ed6G8/F8qjqGRzlbl2H2dzjpMg1KdwsHxOlmJ7GTeZC/nesXbeZ6c9OYnuxUc3fmBuFft/Ff8xMd0s65SXIb/gAAAABJRU5ErkJggg==';

var names = {};
var name_checkers = {};

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

String.prototype.getHostname = function() {
  var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
  return this.match(re)[1].toString();
}

function check_existence_of(uri, successfn, failurefn) {
  GM_xmlhttpRequest({ url: uri,
		      method: "GET",
		      onload: successfn,
		      onerror: failurefn });
}

function spreadsheet(key) {
  var avatars;
  return function(name,success,failure) {
    var check_avatars = function () {
      var link = avatars[name];
      if (link) {
	check_existence_of(link, function() { success(link); }, failure);
      } else {
	failure();
      }
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

name_checkers.spreadsheet = function(key) {
  return function(cont) {
    window.setTimeout(function () { // for some reason this is necessary...
      GM_xmlhttpRequest({
	url: 'http://spreadsheets.google.com/feeds/worksheets/' + key + '/public/basic?alt=json',
	method: 'GET',
	onload: function(response) {
	  response = JSON.parse(response.responseText);
	  cont(response.feed.title.$t);
	}
      });
    }, 0);
  };
};

function memoize(fn) {
  var avatars = {};
  return function(name,success,failure) {
    var cached = avatars[name];
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
      check_existence_of(link,
			 function (response) { avatars[name] = link; success(link); },
			 function (req, stat, err) { avatars[name] = "not found"; failure(); });
    });
}
name_checkers.simple = function(addr) { return function(cont) { cont(addr.getHostname); }; };

// list of functions of form (name to check, success (link), failure())
var servers_text = GM_getValue('server_list');
if (servers_text) {
  servers_text = JSON.parse(servers_text);
} else {
  servers_text = [ spreadsheet("txW-R89lun35ZOhZGM8N50g"), spreadsheet("tSOPONq3I1v4-Amk0INakgg") ]; // default of Skyrates Style, then Alternate Style (tSotW)
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

function get_method(str) {
  return str.split('(')[0];
}

function get_name(str, cont) {
  if (names[str]) { cont(names[str]); return; }
  var method = get_method(str);
  var actual_cont = function(name) { names[str] = name; cont(name); };
  if (name_checkers[method]) {
    eval('name_checkers.' + str)(actual_cont);
  } else {
    actual_cont(str);
  }
}

function set_avatar_link(span, link, where) {
  var alt = "Click to override this custom avatar";
  if (where) { alt = alt + " (recommended by " + where + ")"; }
  $(span).find('span.postdetails img').attr({ src: link, title: alt });
}

function add_override_link(span, name) {
  var img = $(span).find('span.postdetails img');
  var original = img.attr("src");
  var colour = img.parent().parent().css("background-color");

  var overrider = $('<div class="overrider"></div>');
  var set_and_save = function(new_local) {
    local[name] = new_local;
    save_local();
    find_and_set_avatar(span, name);
    overrider.hide();
  };

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
	       function(link) { get_name(servers_text[which_server], function(name) { set_avatar_link(span, link, name); }); },
	       function() { check_asynchronously(span, name, which_server+1); }); }
}

function find_and_set_avatar(span, name) {
  var link = local[name];
  if (link) { set_avatar_link(span,link,"your local override"); return; }

  check_asynchronously(span, name, 0);
}

$("head").append(
  '<style type="text/css">' +
    '.sortable { list-style-type: none; margin: 0; padding: 0; }' +
    '.sortable li { padding: 0.4em; font-size: 0.8em; }' +
    'a { cursor: pointer; }' +
    'button { display:block;' +
    'padding: 0px;' +
    'float:left;' +
    'margin:0 7px 0 0;' +
    'background-color:#f5f5f5;' +
    'border:1px solid #dedede;' +
    'border-top:1px solid #eee;' +
    'border-left:1px solid #eee;' +
    'font-family:"Lucida Grande", Tahoma, Arial, Verdana, sans-serif;' +
    'font-size:100%;' +
    'line-height:130%;' +
    'text-decoration:none;' +
    'font-weight:bold;' +
    'color:#565656;' +
    'cursor:pointer;' +
    'width:24px;' +
    'overflow:visible;' +
    'button img {' +
    'margin:0 3px -3px 0 !important;' +
    'padding:0;' +
    'border:none;' +
    'width:16px;' +
    'height:16px; }' +
  '</style>'
);

function update_with_text(op, itext) {
  op.attr({ value: itext });
  op.text(itext);
  get_name(itext, function(name) { op.text(name); });
}

function add_to_list(list, itext) {
  var op = $('<option></option>');
  update_with_text(op, itext);
  list.append(op);
  op.attr('selected', 'selected');
}

var server_div = $('<div id="server_editor"></div>');

var outer_div = $('<div></div>');
outer_div.css({ height: '100%', width: '60%', float: 'left'});
var list_div = $('<div></div>');
list_div.css({ height: '100%', width: '85%', float: 'left' });
var list = $('<select size=12></select>');
list.css({ height: '100%', width: '95%' });
for (i in servers_text) { add_to_list(list,servers_text[i]); }
var button_div = $('<div></div>');
button_div.css({ width: '10%', height: '100%', float: 'left' });
var up_but = $('<button type="button"><img src="' + up_icon + '" /></button>');
var down_but = $('<button type="button"><img src="' + down_icon + '" /></button>');
var add_but = $('<button type="button"><img src="' + add_icon + '" /></button>');
var del_but = $('<button type="button"><img src="' + del_icon + '" /></button>');

list_div.append(list);

button_div
  .append(up_but)
  .append(down_but)
  .append(add_but)
  .append(del_but);

outer_div
  .append(list_div)
  .append(button_div);

var add_div = $('<div></div>');
add_div.css({ height: '90%', width: '40%', float: 'left'});
var simple_label = $('<label>Simple:</label>');
var sheet_label = $('<label>Spreadsheet key:</label>');
var custom_label = $('<label>Custom:</label>');
var simple_box = $('<input type="text">');
var sheet_box = $('<input type="text">');
var custom_area = $('<textarea rows="5"></textarea>');
simple_label.append(simple_box);
sheet_label.append(sheet_box);
custom_label.append(custom_area);
add_div
  .append(simple_label).append("<br>")
  .append(sheet_label).append("<br><br>")
  .append(custom_label);

function wrap_with(out, arg) { return out + '("' + arg + '")'; }
function current_selection() { return $($("option:selected", list)[0]); }

simple_box.change(function(e) { update_with_text(current_selection(), wrap_with("simple", $(this).val())); list.change(); list.effect("highlight", {}, 1000); });
sheet_box.change(function(e) { update_with_text(current_selection(), wrap_with("spreadsheet", $(this).val())); list.change(); list.effect("highlight", {}, 1000); });
custom_area.change(function(e) { update_with_text(current_selection(), $(this).val()); list.effect("highlight", {}, 1000); });

list.change(function(e) { custom_area.val($(this).attr('value')); custom_area.effect("highlight", {}, 1000); });

up_but.click(function() {
  var curr = current_selection();
  if (curr.prev().length > 0) {
    var tmp = curr.clone().insertBefore(curr.prev());
    curr.remove();
    tmp.attr('selected', 'selected');
  }
});
down_but.click(function() {
  var curr = current_selection();
  if (curr.next().length > 0) {
    var tmp = curr.clone().insertAfter(curr.next());
    curr.remove();
    tmp.attr('selected', 'selected');
  }
});
add_but.click(function() { add_to_list(list, "new value"); });
del_but.click(function() { current_selection().remove(); });

var button_div = $('<div></div>');
button_div.css({ height: '8%', width: '100%' });
var button = $('<button type="button">Save</button>');
button.css({ width: 'auto' });
button.click(function() {
  servers_text = [];
  list.children().each(function (i, op) { servers_text[i] = $(op).attr('value'); });
  save_servers();
});
button_div.append(button);

server_div.append(outer_div).append(add_div).append(button_div);
server_div.css({ 'background-color': 'white', 'border': '1px solid black', 'position': 'absolute', width: '34%', padding: '1em' });
server_div.appendTo($("body"));
server_div.hide();

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

$('td:has(span.name):has(span.postdetails)').each(function () {
  var name = $(this).find('span.name').text();
  add_override_link(this, name);
  find_and_set_avatar(this, name);
});
