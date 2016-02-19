(function  () {
  window.Game = function Game (board) {
    this.board = board;
    board.populate();
    this.mouseEventsEnable();
  };

  Game.prototype.createSkyfallOrb = function (pos) {
    var col = pos[1];
    for (var i = 0; i < 5; i++) {
      if (!this.board[5 + i][col]) {
        var orb = new Orb.skyfall([5 + i, col], this.board);
        orb.addToBoard();
        return;
      }
    }
  };

  Game.prototype.mouseEventsDisable = function () {
    this.board.mouseEventsDisable();
  };

  Game.prototype.mouseEventsEnable = function () {
    this.board.mouseEventsEnable();
  };

  Game.prototype.getEmpties = function () {
    var empties = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        if (!this.board[i][j]) {
          empties.push([i, j]);
        }
      }
    }
    return empties;
  };

  Game.prototype.getOrbsAbovePos = function (pos) {
    var orbs = [];
    for (var i = 1; pos[0] + i < 10; i++) {
      var orb = this.board[pos[0] + i][pos[1]];
      if (orb) orbs.push(orb);
    }
    return orbs;
  };

  Game.prototype.gravity = function (empties) {
    $('.skyfall').removeClass('skyfall');

    var orbsToFall = [];
    for (var i = 0; i < empties.length; i++) {
      orbsToFall = orbsToFall.concat(this.getOrbsAbovePos(empties[i]));
    }
    for (var idx = 0; idx < orbsToFall.length; idx++) {
      orbsToFall[idx].fall();
      if (idx === orbsToFall.length - 1) {
        orbsToFall[idx].$orb.one('transitionend', function () {
          $('.gravity').removeClass('gravity');
          setTimeout(this.match.bind(this), 100);
        }.bind(this));
      }
    }
  };

  Game.prototype.skyfall = function () {
    var empties = this.getEmpties();

    for (var i = 0; i < empties.length; i++) {
      this.createSkyfallOrb(empties[i]);
    }

    setTimeout(function () {
      this.gravity(empties);
    }.bind(this), 100);
  };
})();
