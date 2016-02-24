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

  Painter.keyCodes = {
    8:  'backspace',
    37: true, // left arrow
    38: true, // up arrow
    39: true, // right arrow
    40: true, // down arrow
    66: 'b',
    68: 'd',
    71: 'g',
    72: 'h',
    76: 'l',
    82: 'r'
  };

  Painter.prototype.changeColor = function (e) {
    this.color = $(e.currentTarget).find('img').attr('color');
    this.$hoverOrb.attr('src', Orb.colors[this.color]);
  };

  Painter.prototype.displayOptions = function () {
    Object.keys(Orb.colors).forEach(function (color) {
      var $li = $('<li>').addClass('orb-paint');

      var src = Orb.colors[color];
      var $orb = $('<img>').attr('src', src);
      $orb.attr('color', color);

      $li.append($orb);
      $('#paint-colors').append($li);
    });
  };

  Painter.prototype.keydown = function (e) {
    if (e.metaKey) return;

    var action = Painter.keyCodes[e.keyCode];
    if (action === 'backspace') {
      if (e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
        e.currentTarget.selectionStart -= 1;
        e.preventDefault();
        return;
      }
    } else if (!action) {
      e.preventDefault();
      return;
    }

    if (Orb.colors[action]) {
      var row = 4 - ~~(e.currentTarget.selectionStart / 6) ;
      var col = e.currentTarget.selectionStart % 6;
      var orb = this.game.board.orbAtPosition(row, col);

      orb && orb.setColor(action);
    }
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

    $('textarea').keydown(this.keydown.bind(this));
    $('textarea').on('paste', this.paste.bind(this));

    $(window).mousemove(this.hoverOrbUpdate.bind(this));
  };

  Painter.prototype.paintOrb = function (e) {
    var pos = this.game.board.getBoardLocation(e);
    var orb = this.game.board.orbAtPosition(pos);
    orb.setColor(this.color);
  };

  Painter.prototype.paste = function (e) {
    var text = e.originalEvent.clipboardData.getData('text');
    var currentPos = e.currentTarget.selectionStart;
    for (var i = 0; i < text.length; i++) {
      var row = 4 - ~~(currentPos / 6);
      var col = currentPos % 6;
      var orb = this.game.board.orbAtPosition(row, col);
      orb && orb.setColor(text[i]);
      currentPos += 1;
    }
  };

  Painter.prototype.toggle = function () {
    this.on ? this.turnOff() : this.turnOn();
  };

  Painter.prototype.turnOff = function () {
    this.on = false;
    this.$hoverOrb.hide();
    this.$el.find('.button').text('Painter');
    this.$el.find('#paint-content').addClass('hidden');
    this.$el.find('textarea').val('');

    this.mouseEventsDisable();
    this.game.mouseEventsEnable();
  };

  Painter.prototype.turnOn = function () {
    this.on = true;
    this.$el.find('.button').text('Back to game');
    this.$el.find('#paint-content').removeClass('hidden');

    this.game.mouseEventsDisable();
    this.mouseEventsEnable();
  };
})();
