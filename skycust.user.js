// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/*
// @include          http://*.skyrates.net/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require          http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js
// @require          http://plugins.jquery.com/files/aqFloater.js.txt
//
// ==/UserScript==
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

String.prototype.strip = function() {
  return (this.replace(/^\W+/,'')).replace(/\W+$/,'');
}

var blacklist;
GM_getValue('blacklist', null, function(b) {
blacklist = b;
if (blacklist) { blacklist = JSON.parse(blacklist); } else { blacklist = {}; }
});

function save_blacklist() {
  GM_setValue('blacklist', JSON.stringify(blacklist));
}

function check_existence_of(uri, successfn, failurefn) {
  if (blacklist[uri]) {
	failurefn();
  } else {
    GM_xmlhttpRequest({ url: uri,
                        method: "GET",
                        onload: function(response) { if (response.status < 400) { successfn(); } else { failurefn(); } },
                        onerror: failurefn });
  }
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

function simple(url_base) {
  return function(name, success, failure) {
    var link = url_base + name;
    check_existence_of(link,
      function (response) { success(link); },
      function (req, stat, err) { failure(); });
  };
}

// list of functions of form (name to check, success (link), failure())
var servers;
var servers_text;
function save_servers() {
  save_servers_text(servers_text);
  servers = servers_text.map(function(val, ind, thing) { return eval(val); });
}

var local;
function save_local() {
  GM_setValue('override_local', JSON.stringify(local));
}

function set_avatar_link(img, link, where) {
  var alt = "Click to override this custom avatar";
  if (where) { alt = alt + " (recommended by " + where + ")"; }
  img.attr({ src: link, title: alt });
}

function add_override_link(img, name) {
  var original = img.attr("src");
  var colour = 'white'; //img.parent().parent().css("background-color"); nice, but doesn't work generally.

  var overrider = $('<div class="overrider"></div>');
  var set_and_save = function(new_local) {
    local[name] = new_local;
    save_local();
    find_and_set_avatar(img, name);
    overrider.hide();
  };

  var sas_blacklist = function(new_blacklist) {
	uri = img.attr("src");
	blacklist[uri] = new_blacklist;
	save_blacklist();
	set_avatar_link(img, original);
	find_and_set_avatar(img, name);
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
  var blacklist_link = $('<a>Add this image to blacklist</a>');
  blacklist_link.click(function () { sas_blacklist(true); });

  overrider
    .append(default_link).append("<br><br>")
    .append(custom_textbox).append("<br>")
    .append(custom_link).append("<br><br>")
    .append(clear_link).append("<br><br>")
    .append(blacklist_link);
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

function check_asynchronously(img, name, which_server) {
  var fn = servers[which_server];
  if (fn) { fn(name,
	       function(link) { get_name(servers_text[which_server], function(name) { set_avatar_link(img, link, name); }); },
	       function() { check_asynchronously(img, name, which_server+1); }); }
}

function find_and_set_avatar(img, name) {
  var link = local[name];
  if (link) { set_avatar_link(img,link,"your local override"); return; }

  check_asynchronously(img, name, 0);
}

var attach = false;
var images = [];

GM_getValue('override_local', null, function(l) {
local = l;
if (local) { local = JSON.parse(local); } else { local = {}; }


GM_getValue('server_list', null, function (s) {
servers_text = s;


if (servers_text) {
  servers_text = JSON.parse(servers_text);
} else {
  servers_text = SERVERS_TEXT_DEFAULT;
}
servers = servers_text.map(function(val, ind, thing) { return eval(val); });
var cap = $('#cap');
if (cap.find('#avClip').length > 0) {
  var avClip = cap.find('#avClip');
  avClip.attr_old = avClip.attr;
  avClip.attr = function(thing) {
    if (thing.src) {
      $(this).css('background-image', 'url(' + thing.src + ')'); thing.src = undefined;
    } else if (thing == "src") {
      return $(this).css('background-image').slice(4,-1);
    }
    return this.attr_old(thing);
  } // this is such a beautiful ugly hack. I am proud and ashamed simultaneously.
  images.push({ name: cap.find('p.name').text().strip(), img: avClip });
};

$('tbody:has(td.profile)').each(function () {
  var sthis = $(this);
  images.push({ name: sthis.find('.postauthor').text().strip(), img: $(sthis.find('img')[1]) });
});

$('td.character').each(function () {
  var sthis = $(this);
  images.push({ name: sthis.find('td.name').text().strip(), img: sthis.find('img') });
});

for (i in images) {
  var av = images[i];
  if (!attach) {
    attach = true;
    attach_customisation_window();
  }
  add_override_link(av.img, av.name);
  find_and_set_avatar(av.img, av.name);
};
});
});
