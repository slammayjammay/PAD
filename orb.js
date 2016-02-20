(function () {
  window.Orb = function Orb (color) {
    this.imageWidth = 90;
    this.color = color;

    this.$el = $('<img class="orb">').attr('src', Orb.colorUrls[this.color]);
  };

  Orb.colorUrls = {
    'r': 'http://pad.dawnglare.com/Red.png',
    'b': 'http://pad.dawnglare.com/Blue.png',
    'g': 'http://pad.dawnglare.com/Green.png',
    'l': 'http://pad.dawnglare.com/Light.png',
    'd': 'http://pad.dawnglare.com/Dark.png',
    'h': 'http://pad.dawnglare.com/Heart.png'
  };

  Orb.random = function () {
    var colors = Object.keys(Orb.colorUrls);
    var randIndex = ~~(Math.random() * colors.length);
    return new Orb(colors[randIndex]);
  };

  Orb.skyfall = function () {
    var colors = Object.keys(Orb.colorUrls);
    var randIndex = ~~(Math.random() * colors.length);
    var orb = new Orb(colors[randIndex]);
    orb.$el.addClass('skyfall');
    return orb;
  };

  Orb.prototype.addToBoard = function ($boardEl) {
    this.$el.css('bottom', this.imageWidth * this.pos[0] + 'px');
    this.$el.css('left', this.imageWidth * this.pos[1] + 'px');
    $boardEl.append(this.$el);
  };

  Orb.prototype.setColor = function (color) {
    this.color = color;
    this.$el.attr('src', Orb.colorUrls[color]);
  };

  Orb.prototype.click = function () {
    this.$el.attr('id', 'clicked');
  };

  Orb.prototype.randomizeColor = function () {
    var colors = Object.keys(Orb.colorUrls);
    var randIndex = ~~(Math.random() * colors.length);
    this.color = colors[randIndex];
    this.$el.find('img').attr('src', Orb.colorUrls[this.color]);
  };

  Orb.prototype.release = function () {
    this.$el.removeAttr('id');
  };

  Orb.prototype.remove = function () {
    this.$el.addClass('matched');
    this.$el.one('transitionend', function () {
      this.$el.remove();
    }.bind(this));
  };

  Orb.prototype.updatePosition = function (newPos) {
    this.pos = newPos;

    this.$el.css('bottom', this.imageWidth * this.pos[0] + 'px');
    this.$el.css('left', this.imageWidth * this.pos[1] + 'px');
  };
})();
