(function  () {
  window.Game = function () {
    this.board = [];
    for (var i = 0; i < 10; i++) {
      this.board.push([]);
    }

    $('#board').on('mousedown', this.mousedown.bind(this));
  };

  Game.prototype.containSelectedOrb = function (e) {
    if (e.clientX < $('#board').offset().left + 45) {
      e.clientX = $('#board').offset().left + 45;
    }
    if (e.clientX > $('#board').offset().left + $('#board').width() - 45) {
      e.clientX = $('#board').offset().left + $('#board').width() - 45;
    }
    if (e.clientY < $('#board').offset().top + 45) {
      e.clientY = $('#board').offset().top + 45;
    }
    if (e.clientY > $('#board').offset().top + $('#board').height() - 45) {
      e.clientY = $('#board').offset().top + $('#board').height() - 45;
    }
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

  Game.prototype.findHorizontalMatches = function () {
    var matches = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 4; j++) {
        var color = this.board[i][j].color;
        var k = 1;
        matchLength = 1;
        while (this.board[i][j + k].color === color) {
          matchLength += 1;
          k += 1;
          if (!this.board[i][j + k]) break;
        }
        if (matchLength >= 3) {
          if (!matches[color]) matches[color] = [];

          var orbs = [];
          for (var l = 0; l < k; l++) {
            orbs.push(this.board[i][j + l]);
          }
          matches.push(new Match(orbs));
          j = j + k - 1;
        }
      }
    }
    return matches;
  };

  Game.prototype.findVerticalMatches = function () {
    var matches = [];
    for (var j = 0; j < 6; j++) {
      for (var i = 0; i < 3; i++) {
        var color = this.board[i][j].color;
        var k = 1;
        matchLength = 1;
        while (this.board[i + k][j].color === color) {
          matchLength += 1;
          k += 1;
          if (!this.board[i + k][j]) break;
        }
        if (matchLength >= 3) {
          if (!matches[color]) matches[color] = [];

          var orbs = [];
          for (var l = 0; l < k; l++) {
            orbs.push(this.board[i + l][j]);
          }
          matches.push(new Match(orbs));
          i = i + k - 1;
        }
      }
    }
    return matches;
  };

  Game.prototype.getBoardLocation = function (e) {
    var top = ~~(e.clientY) - $('#board').offset().top;
    var left = ~~(e.clientX) - $('#board').offset().left;
    return [4 - ~~(top / 90), ~~(left / 90)];
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

  Game.prototype.match = function () {
    var horizontal = this.findHorizontalMatches();
    var vertical = this.findVerticalMatches();
    var allMatches = horizontal.concat(vertical);

    var connectedIndices = [];
    for (var i = 0; i < allMatches.length; i++) {
      for (var j = i + 1; j < allMatches.length; j++) {
        if (allMatches[i].isConnected(allMatches[j])) {
          if (connectedIndices.indexOf(i) < 0) connectedIndices.push(i);
          if (connectedIndices.indexOf(j) < 0) connectedIndices.push(j);
        }
      }
    }

    var baseMatch = allMatches[connectedIndices[0]];
    for (var i = 1; i < connectedIndices.length; i++) {
      baseMatch.merge(allMatches[connectedIndices[i]]);
      delete allMatches[connectedIndices[i]];
    }

    allMatches = allMatches.filter(function (el) {
      return el != undefined;
    });

    this.removeMatches(allMatches);
  };

  Game.prototype.mousedown = function (e) {
    e.preventDefault();
    $(window).on('mousemove', this.mousemove.bind(this));

    this.showSelectedOrb(e);
    var currentPos = this.getBoardLocation(e);
    this.board[currentPos[0]][currentPos[1]].click();

    $('.orb:not(#clicked, #drag) .swap-region').mouseenter(function (e) {
      var nextPos = this.getBoardLocation(e);
      this.swapOrbs(currentPos, nextPos);
      currentPos = nextPos;
    }.bind(this));

    $(window).one('mouseup', function () {
      this.mouseup(currentPos);
    }.bind(this));
  };

  Game.prototype.mousemove = function (e) {
    this.containSelectedOrb(e);

    this.$selectedOrb.css('left', e.clientX - 45 + 'px');
    this.$selectedOrb.css('top', e.clientY - 45 + 'px');
  };

  Game.prototype.mouseup = function (currentPos) {
    $(window).off('mousemove');
    $('#drag').remove();
    $('.swap-region').unbind('mouseenter');
    this.board[currentPos[0]][currentPos[1]].release();
    this.removeSelectedOrb();
    this.match();
  };

  Game.prototype.populateBoard = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 5; j++) {
        var orb = Orb.random([j, i], this.board);
        orb.addToBoard();
      }
    }
  };

  Game.prototype.removeMatches = function (allMatches) {
    var firstMatch = allMatches.pop();
    if (firstMatch) {
      firstMatch.remove();
    } else {
      return;
    }

    var id = setInterval(function () {
      var match = allMatches.pop();
      if (match) {
        match.remove();
      } else {
        clearInterval(id);
        this.skyfall();
      }
    }.bind(this), 500);
  };

  Game.prototype.removeSelectedOrb = function () {
    this.$selectedOrb.remove();
  };

  Game.prototype.showSelectedOrb = function (e) {
    var src = $(e.target).parent().find('img').attr('src');
    this.$selectedOrb = $('<img class="orb">').attr('src', src).attr('id', 'drag');
    this.$selectedOrb.css('position', 'absolute');
    this.$selectedOrb.css('left', e.clientX - 45 + 'px');
    this.$selectedOrb.css('top', e.clientY - 45 + 'px');
    $('body').append(this.$selectedOrb);
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

  Game.prototype.swapOrbs = function (currentPos, nextPos) {
    var orb1 = this.board[currentPos[0]][currentPos[1]];
    var orb2 = this.board[nextPos[0]][nextPos[1]];

    this.board[currentPos[0]][currentPos[1]] = orb2;
    this.board[nextPos[0]][nextPos[1]] = orb1;

    orb1.setPos(nextPos);
    orb2.setPos(currentPos);
  };
})();
