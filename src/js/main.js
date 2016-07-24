var $ = require('jquery');

var Game = require('./game');
var Board = require('./board');
var Painter = require('./painter');

$(document).ready(function () {
  var board = new Board($('#board'));
  var game = new Game(board);
  var painter = new Painter($('#paint'), game);
});
