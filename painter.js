(function () {
  window.Painter = function Painter ($el, game) {
    this.on = false;
    this.$el = $el;
    this.game = game;

    this.$hoverOrb = $('<img>').addClass('orb hover-orb');
    $('body').append(this.$hoverOrb);
    this.$hoverOrb.hide();

    this.displayOptions();
  };

  Painter.prototype.changeColor = function (e) {
    this.color = $(e.currentTarget).find('img').attr('color');
    this.$hoverOrb.attr('src', Orb.colorUrls[this.color]);
  };

  Painter.prototype.displayOptions = function () {
    Object.keys(Orb.colorUrls).forEach(function (color) {
      var $li = $('<li>').addClass('orb-paint');

      var src = Orb.colorUrls[color];
      var $orb = $('<img>').attr('src', src);
      $orb.attr('color', color);

      $li.append($orb);
      $('#paint-colors').append($li);
    });
  };

  Painter.prototype.hoverOrbUpdate = function (e) {
    this.$hoverOrb.css('top', e.pageY - 45 + 'px');
    this.$hoverOrb.css('left', e.pageX - 45 + 'px');
  };

  Painter.prototype.mouseEventsDisable = function () {
    $('.orb-paint').off('click');
    $('#board').off('click');
    $(window).off('mousemove');
    $('body').css('cursor', 'default');
  };

  Painter.prototype.mouseEventsEnable = function () {
    $('.orb-paint').one('click', function () {
      this.$hoverOrb.show();
      $('body').not('#paint .button').css('cursor', 'none');
    }.bind(this));

    $('.orb-paint').click(this.changeColor.bind(this));
    $('#board').click(this.paintOrb.bind(this));
    $(window).mousemove(this.hoverOrbUpdate.bind(this));
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
    this.$hoverOrb.hide();
    this.$el.find('.button').text('Turn painter on');
    this.$el.find('ul#paint-colors').addClass('hidden');

    this.mouseEventsDisable();
    this.game.mouseEventsEnable();
  };

  Painter.prototype.turnOn = function () {
    this.on = true;
    this.$el.find('.button').text('Turn painter off');
    this.$el.find('ul#paint-colors').removeClass('hidden');

    this.game.mouseEventsDisable();
    this.mouseEventsEnable();
  };
})();
