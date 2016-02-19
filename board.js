(function () {
  window.Board = function Board ($el) {
    this.$el = $el;
    this.board = [];
    for (var i = 0; i < 10; i++) {
      this.board.push([]);
    }
  };

  Board.prototype.addToBoard = function (orb, pos) {
    this.board[pos[0]][pos[1]] = orb;
    orb.updatePosition(pos);
    orb.addToBoard(this.$el);
  };

  Board.prototype.checkForMatch = function (orb, dir) {
    var matchOrbs = [orb];
    var side = -1;
    var length = 1;
    var nextOrb;

    var done;
    while (!done) {
      if (dir === 'v') {
        nextOrb = this.orbAtPosition(orb.pos[0] + (length * side), orb.pos[1]);
      } else if (dir === 'h'){
        nextOrb = this.orbAtPosition(orb.pos[0], orb.pos[1] + (length * side));
      }

      if (!nextOrb || nextOrb.color !== orb.color) {
        side *= -1;
        length = 1;

        if (side < 0) done = true;
      } else {
        matchOrbs.push(nextOrb);
        length += 1;
      }
    }

    // TODO: return a Match object
    return matchOrbs.length >= 3 ? matchOrbs : false;
  };

  Board.prototype.checkMatchConnections = function (totalMatches) {
    var idx = 0;
    var nextIdx = idx + 1;
    while (idx < totalMatches.length - 1) {

      var currentMatch = totalMatches[idx];
      var nextMatch = totalMatches[nextIdx];
      if (!nextMatch) break;

      if (currentMatch.isConnected(nextMatch)) {
        currentMatch.merge(nextMatch);
        totalMatches.splice(nextIdx, 1);
      } else {
        nextIdx += 1;
        if (nextIdx > totalMatches.length - 1) {
          idx += 1;
          nextIdx = idx + 1;
        }
      }
    }
  };

  Board.prototype.detectOrbSwap = function (e) {
    var newPos = this.getBoardLocation(e, true);
    if (!newPos) return;

    if (this.currentPos[0] !== newPos[0] || this.currentPos[1] !== newPos[1]) {
      var currentOrb = this.orbAtPosition(this.currentPos);
      var newOrb = this.orbAtPosition(newPos);
      this.swapOrbs(currentOrb, newOrb);
    }
  };

  Board.prototype.getAllMatches = function () {
    this.resetOrbs();
    // STEPS:
    // 1: go through all orbs on board. if it we've already created a new Match
    //    for this orb, skip it (there's no need to do it again)
    // 2: if this orb matches with other orbs, create a new Match and add it to
    //    totalMatches
    // 3: Edge case: go through all matches of the same color and check if any
    //    of their orbs are adjacent

    var totalMatches = [];

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        // if current orb is already in a match or not in one, go to next orb
        var orb = this.orbAtPosition(i ,j);
        if (orb.match) continue;

        var currentMatch = this.getMatchesForOrb(orb);
        if (currentMatch) {
          totalMatches.push(currentMatch);
        }
      }
    }

    this.checkMatchConnections(totalMatches);
    return totalMatches;
  };

  Board.prototype.getBoardLocation = function (e, flag) {
    // a true flag allows for diagonal swaps. it will only return a board
    // location if the cursor is within some distance of the slot boundaries.

    var top = (e.pageY) - this.$el.offset().top;
    var left = (e.pageX) - this.$el.offset().left;

    if (flag) {
      var topBorder = ~~(top / 90) * 90;
      var bottomBorder = topBorder + 90;
      var leftBorder = ~~(left / 90) * 90;
      var rightBorder = leftBorder + 90;

      if (top - topBorder < 5 || Math.abs(top - bottomBorder) < 5) return;
      if (left - leftBorder < 5 || Math.abs(left - rightBorder) < 5) return;
    }

    return [4 - ~~(top / 90), ~~(left / 90)];
  };

  Board.prototype.getMatchesForOrb = function (orb) {
    // first check if this orb is in a horizontal match. if yes, there's no need
    // to check for a possible vertical match. extendMatch() will do that. if no,
    // check for a vertical match and extend

    var match = this.checkForMatch(orb, 'h');
    if (!match) match = this.checkForMatch(orb, 'v');
    if (!match) return false;

    return this.extendMatch(match);
  };

  Board.prototype.match = function () {
    var matches = this.getAllMatches();
    this.removeMatches(matches);
  };

  Board.prototype.extendMatch = function (matchOrbs) {
    match = new Match(this, matchOrbs);

    var queue = [];
    // if dirToCheck is true then orbs are aligned horizontally
    var dirToCheck = match.orbs[1].pos[0] - match.orbs[0].pos[0] === 0;
    if (dirToCheck) {
      dirToCheck = 'v';
    } else {
      dirToCheck = 'h';
    }

    for (var i = 0; i < match.orbs.length; i++) {
      queue.push({ orb: match.orbs[i], dirToCheck: dirToCheck });
    }

    while (queue.length > 0) {
      var current = queue.shift();
      var newMatch = this.checkForMatch(current.orb, current.dirToCheck);
      if (!newMatch) continue;

      for (var i = 0; i < newMatch.length; i++) {
        var newOrb = newMatch[i];
        if (newOrb === current.orb || newOrb.match === match) continue;

        var newDir = current.dirToCheck === 'h' ? 'v' : 'h';
        queue.push({ orb: newOrb, dirToCheck: newDir });
      }
      match.add(newMatch);
    }

    return match;
  };

  Board.prototype.mouseEventsEnable = function () {
    this.$el.on('mousedown', this.mousedown.bind(this));
  };

  Board.prototype.mouseEventsDisable = function () {
    this.$el.off('mousedown');
  };

  Board.prototype.ensureNoMatches = function () {

  };

  Board.prototype.hoverOrbContain = function (e) {
    if (e.pageX < this.$el.offset().left + 45) {
      e.pageX = this.$el.offset().left + 45;
    } else if (e.pageX > this.$el.offset().left + this.$el.width() - 45) {
      e.pageX = this.$el.offset().left + this.$el.width() - 45;
    }

    if (e.pageY < this.$el.offset().top + 45) {
      e.pageY = this.$el.offset().top + 45;
    } else if (e.pageY > this.$el.offset().top + this.$el.height() - 45) {
      e.pageY = this.$el.offset().top + this.$el.height() - 45;
    }
  };

  Board.prototype.hoverOrbShow = function (e) {
    var src = $(e.target).attr('src');
    this.$hoverOrb = $('<img class="orb">').attr('src', src)
    this.$hoverOrb.attr('id', 'drag');

    this.hoverOrbUpdate(e);
    $('body').append(this.$hoverOrb);
  };

  Board.prototype.hoverOrbUpdate = function (e) {
    this.hoverOrbContain(e);
    this.$hoverOrb.css('top', e.pageY - 45 + 'px');
    this.$hoverOrb.css('left', e.pageX - 45 + 'px');
  };

  Board.prototype.mousedown = function (e) {
    e.preventDefault();
    $(window).on('mousemove', this.mousemove.bind(this));

    this.hoverOrbShow(e);
    this.currentPos = this.getBoardLocation(e);
    this.orbAtPosition(this.currentPos).click();

    $(window).one('mouseup', this.mouseup.bind(this));
  };

  Board.prototype.mousemove = function (e) {
    this.detectOrbSwap(e);
    this.hoverOrbUpdate(e);
  };

  Board.prototype.mouseup = function () {
    $(window).off('mousemove');
    this.$hoverOrb.remove();
    this.orbAtPosition(this.currentPos).release();
    this.match();
  };

  Board.prototype.orbAtPosition = function (pos, pos2) {
    if (pos.constructor.name === 'Array') {
      if (!this.board[pos[0]]) return;
      return this.board[pos[0]][pos[1]];
    }

    if (!this.board[pos]) return;
    return this.board[pos][pos2];
  };

  Board.prototype.populate = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 5; j++) {
        var orb = Orb.random();
        this.addToBoard(orb, [j, i]);
      }
    }

    this.ensureNoMatches();
  };

  Board.prototype.removeOrb = function (orb) {
    this.board[orb.pos[0]][orb.pos[1]] = undefined;
  };

  Board.prototype.removeMatches = function (matches) {
    var firstMatch = matches.pop();
    if (!firstMatch) return;

    firstMatch.remove();

    var id = setInterval(function () {
      var match = matches.pop();
      if (match) {
        match.remove();
      } else {
        clearInterval(id);
        // this.skyfall();
      }
    }.bind(this), 500);
  };

  Board.prototype.resetOrbs = function () {
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        this.orbAtPosition(i, j).match = undefined;
      }
    }
  };

  Board.prototype.swapOrbs = function (currentOrb, newOrb) {
    var currentPos = currentOrb.pos;
    var newPos = newOrb.pos;

    this.board[currentPos[0]][currentPos[1]] = newOrb;
    this.board[newPos[0]][newPos[1]] = currentOrb;
    currentOrb.updatePosition(newPos);
    newOrb.updatePosition(currentPos);

    this.currentPos = newPos;
  };
})();
