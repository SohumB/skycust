var servers_text = [];

var names;
function update_with_text(op, itext) {
  op.attr({ value: itext });
  op.text(itext);
  get_name(itext, function(name) { op.text(name); });
}

function add_to_list(list, itext, selected) {
  var op = $('<option></option>');
  update_with_text(op, itext);
  list.append(op);
  if (selected) { op.attr('selected', 'selected'); }
}

$(document).ready(function () {
  var server_div = $('<div id="server_editor"></div>');
  var outer_div = $('<div></div>');
  outer_div.css({ height: '100%', width: '60%', float: 'left'});
  var list_div = $('<div></div>');
  list_div.css({ height: '100%', width: '85%', float: 'left' });
  var list = $('<select size=12></select>');
  list.css({ height: '100%', width: '95%' });

  function refresh_list() {
    list.children().remove();
    servers_text = localStorage['server_list'];
    if (servers_text) {
      servers_text = JSON.parse(servers_text);
    } else {
      servers_text = SERVERS_TEXT_DEFAULT;
    }
    for (i in servers_text) { add_to_list(list,servers_text[i], false); }
  }
  refresh_list();

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

  var wrap_with = function(out, arg) { return out + '("' + arg + '")'; };
  var current_selection = function() {
    s = $("option:selected", list);
    if (s.length == 0) { add_to_list(list, "new value", true); s = $("option:selected", list); }
    return $(s[0]);
  }

  simple_box.change(function(e) { update_with_text(current_selection(), wrap_with("simple", $(this).val())); list.trigger('change'); list.effect("highlight", {}, 1000); });
  sheet_box.change(function(e) { update_with_text(current_selection(), wrap_with("spreadsheet", $(this).val())); list.trigger('change'); list.effect("highlight", {}, 1000); });
  custom_area.change(function(e) { update_with_text(current_selection(), $(this).val()); list.effect("highlight", {}, 1000); });

  list.change(function(e) { simple_box.val(''); sheet_box.val(''); custom_area.val($(this).attr('value')); custom_area.effect("highlight", {}, 1000); });

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
  add_but.click(function() { add_to_list(list, "new value", true); });
  del_but.click(function() { current_selection().remove(); });

  var save_div = $('<div></div>');
  save_div.css({ height: '8%', width: '100%', float: 'left' });
  var save = $('<button type="save">Save</save>');
  save.css({ width: 'auto' });
  save.click(function() {
    servers_text = [];
    list.children().each(function (i, op) { servers_text[i] = $(op).attr('value'); });
    save_servers_text(servers_text);
    window.close();
  });
  save_div.append(save);

  server_div.append(outer_div).append(add_div).append(save_div);
  //    server_div.css({ 'background-color': 'white', 'border': '1px solid black', 'position': 'absolute', width: '34%', padding: '1em' });
  server_div.appendTo($("body"));
});
