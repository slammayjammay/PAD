(function () {
  window.Painter = function Painter ($el, game) {
    this.on = false;
    this.$el = $el;
    this.game = game;

    this.$image = $('<img>').addClass('painter-image');
    $('body').append(this.$image);
  };

  Painter.prototype.changeColor = function (el) {
    this.color = $(el.currentTarget).attr('color');
    this.$image.attr('src', Orb.colorUrls[this.color]);
  };

  Painter.prototype.mouseEventsDisable = function () {
    $('.orb-paint').off('click');
    $('#board').off('click');
    $(window).off('mousemove');
  };

  Painter.prototype.displayOptions = function () {
    Object.keys(Orb.colorUrls).forEach(function (color) {
      var src = Orb.colorUrls[color];
      var $orb = $('<img>').attr('src', src).addClass('orb-paint');
      $orb.attr('color', color);
      $('#paint').after($orb);
    });
  };

  Painter.prototype.mouseEventsEnable = function () {
    $('.orb-paint').click(this.changeColor.bind(this));
    $('#board').click(this.paintOrb.bind(this));
    $(window).mousemove(this.updateImagePos.bind(this));
  };

  Painter.prototype.paintOrb = function (e) {
    var pos = this.game.board.getBoardLocation(e);
    var orb = this.game.board.orbAtPosition(pos);
    orb.setColor(this.color);
  };

  Painter.prototype.toggle = function () {
    this.on ? this.turnOff() : this.turnOn();
  };

  Painter.prototype.turnOff = function () {
    this.on = false;
    this.$image.hide();
    $('.orb-paint').remove();
    this.mouseEventsDisable();
    this.game.mouseEventsEnable();
  };

  Painter.prototype.turnOn = function () {
    this.on = true;
    this.$image.show();
    this.$el.text('TURN PAINTER OFF');
    this.displayOptions();
    this.game.mouseEventsDisable();
    this.mouseEventsEnable();
  };

  Painter.prototype.updateImagePos = function (e) {
    this.$image.css('top', e.pageY - 45 + 'px');
    this.$image.css('left', e.pageX - 45 + 'px');
  };
})();
