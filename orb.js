(function () {
  window.Orb = function (color, pos) {
    this.imageWidth = 90;
    this.color = color;
    this.pos = pos;

    // create orb html
    this.$orb = $('<div class="orb">');
    this.$orb.append($('<div class="swap-region">'));
    var $image = $('<img>').attr('src', Orb.colorUrls[this.color]);
    this.$orb.append($image);

    this.addOrbToBoard();
  }

  Orb.colorUrls = {
    'r': 'http://pad.dawnglare.com/Red.png',
    'b': 'http://pad.dawnglare.com/Blue.png',
    'g': 'http://pad.dawnglare.com/Green.png',
    'l': 'http://pad.dawnglare.com/Light.png',
    'd': 'http://pad.dawnglare.com/Dark.png',
    'h': 'http://pad.dawnglare.com/Heart.png'
  };

  Orb.prototype.addOrbToBoard = function () {
    this.$orb.css('top', this.imageWidth * this.pos[0] + 'px');
    this.$orb.css('left', this.imageWidth * this.pos[1] + 'px');
    $('#board').append(this.$orb);
  };

  Orb.prototype.click = function () {
    this.$orb.css('opacity', 0.3).addClass('clicked');
  };

  Orb.prototype.isSameAs = function (orb2) {
    if (this.pos[0] === orb2.pos[0] && this.pos[1] === orb2.pos[1]) {
      return true;
    }
  };

  Orb.prototype.release = function () {
    this.$orb.css('opacity', 1).removeClass('clicked');
  };

  Orb.prototype.updatePos = function (newPos) {
    this.pos = newPos;
    this.$orb.css('top', this.imageWidth * this.pos[0] + 'px');
    this.$orb.css('left', this.imageWidth * this.pos[1] + 'px');
  };
})();
