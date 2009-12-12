// -*- javascript-indent-level: 2 -*-
// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var avatars = {
  'Calvin':    'http://skyrates.net/resources/avatar/circle7.png',
  'Sadistica': 'http://skyrates.jusque.net/betsy.png'
}

function find_avatar(name) {
  return avatars[name];
}

$('td:has(span.name):has(span.postdetails)').each(function () {
  var name = $(this).find('span.name').text();
  var avatar = find_avatar(name);
  if (avatar) {
    $(this).find('span.postdetails img').attr({
      src:    avatar,
      width:  80,
      height: 90
    });
  }
});
