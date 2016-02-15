(function () {
  window.Orb = function (color, pos, board) {
    this.imageWidth = 90;

    this.color = color;
    this.pos = pos;
    this.board = board;

    this.$orb = $('<div class="orb">');
    this.$orb.append($('<div class="swap-region">'));
    var $image = $('<img>').attr('src', Orb.colorUrls[this.color]);
    this.$orb.append($image);
  }

  Orb.colorUrls = {
    'r': 'http://pad.dawnglare.com/Red.png',
    'b': 'http://pad.dawnglare.com/Blue.png',
    'g': 'http://pad.dawnglare.com/Green.png',
    'l': 'http://pad.dawnglare.com/Light.png',
    'd': 'http://pad.dawnglare.com/Dark.png',
    'h': 'http://pad.dawnglare.com/Heart.png'
  };

  Orb.random = function (pos, board) {
    var colors = Object.keys(Orb.colorUrls);
    var randIndex = ~~(Math.random() * colors.length);
    return new Orb(colors[randIndex], pos, board);
  };

  Orb.prototype.addToBoard = function () {
    this.board[this.pos[0]][this.pos[1]] = this;

    this.$orb.css('bottom', this.imageWidth * this.pos[0] + 'px');
    this.$orb.css('left', this.imageWidth * this.pos[1] + 'px');
    $('#board').append(this.$orb);
  };

  Orb.prototype.click = function () {
    this.$orb.attr('id', 'clicked');
  };

  Orb.prototype.fall = function () {
    this.$orb.addClass('gravity');
    this.$orb.one('transitionend', function () {
      this.$orb.removeClass('gravity');
    }.bind(this));
    this.$orb.removeClass('skyfall');

    var newPos = [this.pos[0] - 1, this.pos[1]];
    this.updatePos(newPos);
  };

  Orb.prototype.isSameAs = function (orb2) {
    if (this.pos[0] === orb2.pos[0] && this.pos[1] === orb2.pos[1]) {
      return true;
    }
  };

  Orb.prototype.release = function () {
    this.$orb.removeAttr('id');
  };

  Orb.prototype.remove = function () {
    this.board[this.pos[0]][this.pos[1]] = undefined;
    this.$orb.addClass('matched');
    this.$orb.one('transitionend', function () {
      this.$orb.remove();
    }.bind(this));
  };

  Orb.prototype.setPos = function (newPos) {
    this.pos = newPos;
    this.board[newPos[0]][newPos[1]] = this;

    this.$orb.css('bottom', this.imageWidth * this.pos[0] + 'px');
    this.$orb.css('left', this.imageWidth * this.pos[1] + 'px');
  };

  Orb.prototype.updatePos = function (newPos) {
    this.board[this.pos[0]][this.pos[1]] = undefined;
    this.pos = newPos;
    this.board[newPos[0]][newPos[1]] = this;

    this.$orb.css('bottom', this.imageWidth * this.pos[0] + 'px');
    this.$orb.css('left', this.imageWidth * this.pos[1] + 'px');
  };
})();
