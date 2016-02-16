(function () {
  window.Match = function (orbs) {
    this.orbs = orbs;
    this.color = orbs[0].color;
    this.length = orbs.length;
  };

  Match.prototype.isConnected = function (match2) {
    if (this.color !== match2.color) return;

    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < match2.length; j++) {
        if (this.orbsConnectedOrSame(this.orbs[i], match2.orbs[j])) {
          return true;
        }
      }
    }
  };

  Match.prototype.merge = function (match2) {
    for (var i = 0; i < match2.orbs.length; i++) {
      for (var j = 0; j < this.orbs.length; j++) {
        if (this.orbs[j].isSameAs(match2.orbs[i])) {
          delete match2.orbs[i];
          break;
        }
      }
    }

    for (var i = 0; i < match2.orbs.length; i++) {
      if (match2.orbs[i] != undefined) this.orbs.push(match2.orbs[i]);
    }
  };

  Match.prototype.orbsConnectedOrSame = function (orb1, orb2) {
    if (orb1.pos[0] === orb2.pos[0]) {
      // check for same position
      if (orb1.pos[1] === orb2.pos[1]) return true;
      // check for horizontal connection
      if (orb1.pos[1] + 1 === orb2.pos[1] || orb1.pos[1] - 1 === orb2.pos[1]) {
        return true;
      }
    }

    if (orb1.pos[1] === orb2.pos[1]) {
      // check for vertical connection
      if (orb1.pos[0] + 1 === orb2.pos[0] || orb1.pos[0] - 1 === orb2.pos[0]) {
        return true;
      }
    }

    return false;
  };

  Match.prototype.randomize = function () {
    for (var i = 0; i < this.orbs.length; i++) {
      this.orbs[i].randomizeColor();
    }
  };

  Match.prototype.remove = function () {
    this.orbs.forEach(function (orb) {
      orb.remove();
    });
  };
})();
