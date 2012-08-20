// Chrome compatibility layer
SERVERS_TEXT_DEFAULT = [ 'spreadsheet("txW-R89lun35ZOhZGM8N50g")', 'spreadsheet("tSOPONq3I1v4-Amk0INakgg")' ]; // default of Skyrates Style, then Alternate Style (tSotW)

var customisation_icon = chrome.extension.getURL('icon.png');
var up_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEGSURBVDjLpZM/LwRRFMXPspmEaGc1shHRaiXsJ5GIRixbCr6SikxIlqgJM5UohIiGdofovHf/PZVmYwZvTntPfjnn3txWCAFNNFE33L/ZKXYv+1dRgL3r7bu0PbucJp3e4GLjtsrXGq9wkA8SU7tPk87i/MwCzAyP5QNeytcnJl46XMuoNoGKDoVlTkQhJpAgmJqcBjnqkqPTXxN8qz9cD6vdHtQMxXOBt49y5XjzLB/3tau6kWewKiwoRu8jZFvn+U++GgCBlWFBQY4qr1ANcAQxgQaFjwH4TwYrQ5skYBOYKbzjiASOwCrNd2BBwZ4jAcowGJgkAuAZ2dEJhAUqij//wn/1BesSumImTttSAAAAAElFTkSuQmCC';
var down_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAENSURBVDjLpZM/SwNREMTnxBRpFYmctaKCfwrBSCrRLuL3iEW6+EEUG8XvIVjYWNgJdhFjIXamv3s7u/ssrtO7hFy2fcOPmd03SYwR88xi1cPgpRdjjDB1mBquju+TMt1CFcDd0V7q4GilAwpnd2A0qCvcHRSdHUBqAYgOyaUGIBQAc4fkNSJIIGgGj4ZQx4EEAY3waPUiSC5FhLoOQkbQCJvioPQfnN2ctpuNJugKNUWYsMR/gO71yYPk8tRaboGmoCvS1RQ7/c1sq7f+OBUQcjkPGb9+xmOoF6ckCQb9pmj3rz6pKtPB5e5rmq7tmxk+hqO34e1or0yXTGrj9sXGs1Ib73efh1WaZN46/wI8JLfHaN24FwAAAABJRU5ErkJggg==';
var add_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJvSURBVDjLpZPrS5NhGIf9W7YvBYOkhlkoqCklWChv2WyKik7blnNris72bi6dus0DLZ0TDxW1odtopDs4D8MDZuLU0kXq61CijSIIasOvv94VTUfLiB74fXngup7nvrnvJABJ/5PfLnTTdcwOj4RsdYmo5glBWP6iOtzwvIKSWstI0Wgx80SBblpKtE9KQs/We7EaWoT/8wbWP61gMmCH0lMDvokT4j25TiQU/ITFkek9Ow6+7WH2gwsmahCPdwyw75uw9HEO2gUZSkfyI9zBPCJOoJ2SMmg46N61YO/rNoa39Xi41oFuXysMfh36/Fp0b7bAfWAH6RGi0HglWNCbzYgJaFjRv6zGuy+b9It96N3SQvNKiV9HvSaDfFEIxXItnPs23BzJQd6DDEVM0OKsoVwBG/1VMzpXVWhbkUM2K4oJBDYuGmbKIJ0qxsAbHfRLzbjcnUbFBIpx/qH3vQv9b3U03IQ/HfFkERTzfFj8w8jSpR7GBE123uFEYAzaDRIqX/2JAtJbDat/COkd7CNBva2cMvq0MGxp0PRSCPF8BXjWG3FgNHc9XPT71Ojy3sMFdfJRCeKxEsVtKwFHwALZfCUk3tIfNR8XiJwc1LmL4dg141JPKtj3WUdNFJqLGFVPC4OkR4BxajTWsChY64wmCnMxsWPCHcutKBxMVp5mxA1S+aMComToaqTRUQknLTH62kHOVEE+VQnjahscNCy0cMBWsSI0TCQcZc5ALkEYckL5A5noWSBhfm2AecMAjbcRWV0pUTh0HE64TNf0mczcnnQyu/MilaFJCae1nw2fbz1DnVOxyGTlKeZft/Ff8x1BRssfACjTwQAAAABJRU5ErkJggg==';
var del_icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJdSURBVDjLpZP7S1NhGMf9W7YfogSJboSEUVCY8zJ31trcps6zTI9bLGJpjp1hmkGNxVz4Q6ildtXKXzJNbJRaRmrXoeWx8tJOTWptnrNryre5YCYuI3rh+8vL+/m8PA/PkwIg5X+y5mJWrxfOUBXm91QZM6UluUmthntHqplxUml2lciF6wrmdHriI0Wx3xw2hAediLwZRWRkCPzdDswaSvGqkGCfq8VEUsEyPF1O8Qu3O7A09RbRvjuIttsRbT6HHzebsDjcB4/JgFFlNv9MnkmsEszodIIY7Oaut2OJcSF68Qx8dgv8tmqEL1gQaaARtp5A+N4NzB0lMXxon/uxbI8gIYjB9HytGYuusfiPIQcN71kjgnW6VeFOkgh3XcHLvAwMSDPohOADdYQJdF1FtLMZPmslvhZJk2ahkgRvq4HHUoWHRDqTEDDl2mDkfheiDgt8pw340/EocuClCuFvboQzb0cwIZgki4KhzlaE6w0InipbVzBfqoK/qRH94i0rgokSFeO11iBkp8EdV8cfJo0yD75aE2ZNRvSJ0lZKcBXLaUYmQrCzDT6tDN5SyRqYlWeDLZAg0H4JQ+Jt6M3atNLE10VSwQsN4Z6r0CBwqzXesHmV+BeoyAUri8EyMfi2FowXS5dhd7doo2DVII0V5BAjigP89GEVAtda8b2ehodU4rNaAW+dGfzlFkyo89GTlcrHYCLpKD+V7yeeHNzLjkp24Uu1Ed6G8/F8qjqGRzlbl2H2dzjpMg1KdwsHxOlmJ7GTeZC/nesXbeZ6c9OYnuxUc3fmBuFft/Ff8xMd0s65SXIb/gAAAABJRU5ErkJggg==';

function wait(ms)
{
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < ms);
}

String.prototype.getHostname = function() {
  var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
  return this.match(re)[1].toString();
}

function GM_getValue(name, def, cont) {
  chrome.extension.sendMessage(
    {get_local: true, key: name},
    function(val) {
      if (val) {
	cont(val);
      } else if (def) {
	cont(def);
      } else {
	cont(null);
      }
    });
}

function GM_setValue(name, val) {
  chrome.extension.sendMessage({save_local: true, key: name, value: val});
}

function GM_xmlhttpRequest(details) {
  var onload = details.onload;
  var onerror = details.onerror;
  details.onload = undefined;
  details.onerror = undefined;
  chrome.extension.sendMessage({xhr: details},
			       function(response) { if (response.onload && onload) { onload(response.status, response.responseText); }
						    else if (response.onerror && onerror) { onerror(response.status, response.responseText); } });
}

$.ajax = function (details) {
  var success = details.success;
  var error = details.error;
  details.success = undefined;
  details.error = undefined;
  chrome.extension.sendMessage({ajax: details}, function(response) { if (response.success && success) { success(response.response); }
							     else if (response.failure && failure) { failure(response.response, response.status, response.error); } });
};

function save_servers_text(servers_text) {
  GM_setValue('server_list', JSON.stringify(servers_text));
}

var name_checkers = {};
name_checkers.simple = function(addr) { return function(cont) { cont(addr.getHostname()); }; };
name_checkers.spreadsheet = function(key) {
  return function(cont) {
    window.setTimeout(function () { // for some reason this is necessary...
      GM_xmlhttpRequest({
		url: 'http://spreadsheets.google.com/feeds/worksheets/' + key + '/public/basic?alt=json',
		method: 'GET',
		onload: function(stat, responseText) {
		  response = JSON.parse(responseText);
		  cont(response.feed.title.$t);
		}
      });
    }, 0);
  };
};

function get_method(str) {
  var ret = str.split(/\((.*)\)$/);
  ret[1] = JSON.parse('[' + ret[1] + ']');
  return ret;
}

function get_name(str, cont) {
  chrome.extension.sendMessage(
    {check_name_cache: str},
    function(ret) {
      if (ret) { cont(ret); return; }
      var method = get_method(str);
      var actual_cont = function(name) {
	chrome.extension.sendMessage(
	  {set_name_cache: str, to: name},
	  function() { cont(name); }); };
      if (name_checkers[method[0]]) {
	name_checkers[method[0]].apply(null, method[1])(actual_cont);
      } else {
	actual_cont(str);
      }
    });
}

function attach_customisation_window() {
  chrome.extension.sendMessage({attach_customisation_window: true});
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
