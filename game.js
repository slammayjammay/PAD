(function  () {
  window.Game = function () {
    this.board = [];
    for (var i = 0; i < 5; i++) {
      this.board.push([]);
    }

    $('#board').on('mousedown', this.mousedown.bind(this));
  };

  Game.prototype.getBoardLocation = function (e) {
    var top = ~~(e.clientY) - $('#board').offset().top;
    var left = ~~(e.clientX) - $('#board').offset().left;
    return [~~(top / 90), ~~(left / 90)];
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
          if (!this.board[i + k]) break;
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
  };

  Game.prototype.mousedown = function (e) {
    e.preventDefault();
    $(window).on('mousemove', this.mousemove.bind(this));

    this.showSelectedOrb(e);
    var currentPos = this.getBoardLocation(e);
    this.board[currentPos[0]][currentPos[1]].click();

    $('.orb:not(.clicked, .selected) .swap-region').mouseenter(function (e) {
      var nextPos = this.getBoardLocation(e);
      this.swapOrbs(currentPos, nextPos);
      currentPos = nextPos;
    }.bind(this));

    $(window).one('mouseup', function () {
      this.mouseup(currentPos);
    }.bind(this));
  };

  Game.prototype.mousemove = function (e) {
    this.$image.css('left', e.clientX - 45 + 'px');
    this.$image.css('top', e.clientY - 45 + 'px');
  };

  Game.prototype.mouseup = function (currentPos) {
    $(window).off('mousemove');
    $('.selected').remove();
    $('.swap-region').unbind('mouseenter');
    this.board[currentPos[0]][currentPos[1]].release();
    this.match();
  };

  Game.prototype.populateBoard = function () {
    var colors = ['r', 'b', 'g', 'l', 'd', 'h'];
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 5; j++) {
        var randIndex = ~~(Math.random() * colors.length);
        var orb = new Orb(colors[randIndex], [j, i]);

        this.board[j][i] = orb;
      }
    }
  };

  Game.prototype.showSelectedOrb = function (e) {
    var src = $(e.target).parent().find('img').attr('src');
    this.$image = $('<img>').attr('src', src).addClass('orb selected');
    this.$image.css('position', 'absolute');
    this.$image.css('left', e.clientX - 45 + 'px');
    this.$image.css('top', e.clientY - 45 + 'px');
    $('body').append(this.$image);
  };

  Game.prototype.swapOrbs = function (currentPos, nextPos) {
    var orb1 = this.board[currentPos[0]][currentPos[1]];
    var orb2 = this.board[nextPos[0]][nextPos[1]];

    this.board[currentPos[0]][currentPos[1]] = orb2;
    this.board[nextPos[0]][nextPos[1]] = orb1;

    orb1.updatePos(nextPos);
    orb2.updatePos(currentPos);
  };
})();
