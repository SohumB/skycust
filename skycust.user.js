// ==UserScript==
// @name             Skycust
// @description      A forum avatar-replacer based on a remote canonical image source.
// @include          http://skyrates.net/forum/*
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$('img[src^="images/avatars/gallery/skyrates/circle"]').attr({
  src: 'http://skyrates.jusque.net/betsy.png'
});
