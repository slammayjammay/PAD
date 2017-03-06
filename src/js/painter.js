var $ = require('jquery');

var Orb = require('./orb');

var Painter = function Painter ($el, game) {
	this.$el = $el;
	this.game = game;

	this.$hoverOrb = $('<img>').addClass('orb hover-orb');
	$('body').append(this.$hoverOrb);
	this.$hoverOrb.hide();

	this.mouseEventsEnable();
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

Painter.prototype.apply = function (e) {
	var text = $('textarea').val();
	if (this.validText(text)) {
		this.applyText(text);
	}
};

Painter.prototype.applyText = function (text, currentPos) {
	if (!currentPos) {
		currentPos = 0;
	}

	for (var i = 0; i < text.length; i++) {
		var row = 4 - ~~(currentPos / 6);
		var col = currentPos % 6;
		var orb = this.game.board.orbAtPosition(row, col);
		orb && orb.setColor(text[i]);
		currentPos += 1;
	}
};

Painter.prototype.changeColor = function (e) {
	this.color = $(e.currentTarget).find('img').attr('color');
	this.$hoverOrb.attr('src', Orb.colors[this.color]);
};

Painter.prototype.keydown = function (e) {
	if (e.metaKey) {
		if (e.which === 90) {
			// no undo's
			e.preventDefault();
		}
		return;
	};

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

Painter.prototype.hoverOrbHide = function (e) {
	this.game.mouseEventsEnable();

	this.$hoverOrb.hide();
	$('body').css('cursor', 'default');
	$(document).off('mousemove');
	$('#board').off('click');
};

Painter.prototype.hoverOrbShow = function (e) {
	this.game.mouseEventsDisable();

	this.color = $(e.currentTarget).find('img').attr('color');
	this.$hoverOrb.attr('src', Orb.colors[this.color]);
	this.$hoverOrb.show();
	this.hoverOrbUpdate(e);

	$('body').css('cursor', 'none');
	$(document).mousemove(this.hoverOrbUpdate.bind(this));
	$('#board').click(this.paintOrb.bind(this));
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
	// for orb painting
	$('.orb-paint').on('click', function (e) {
		if ($(e.currentTarget).hasClass('selected')) {
			this.hoverOrbHide(e);
			$('.orb-paint').removeClass('selected');
		} else {
			this.hoverOrbShow(e);
			$('.orb-paint').removeClass('selected');
			$(e.currentTarget).addClass('selected');
		}
	}.bind(this));

	// for textarea editing
	$('textarea').keydown(this.keydown.bind(this));
	$('textarea').on('paste', this.paste.bind(this));

	// for applying and button hovering
	$('#apply .button').click(this.apply.bind(this));
	$('#apply .button').hover(
		function () {
			$('#apply .button.hover').css('opacity', 1);
		},

		function () {
			$('#apply .button.hover').css('opacity', 0);
		}
	);

	$('#apply .button').mousedown(function () {
		$('#apply .button.click').css('opacity', 1);
	});
	$('#apply .button').mouseup(function () {
		$('#apply .button.click').css('opacity', 0);
	});
};

Painter.prototype.paintOrb = function (e) {
	var pos = this.game.board.getBoardLocation(e);
	var orb = this.game.board.orbAtPosition(pos);
	orb.setColor(this.color);
};

Painter.prototype.paste = function (e) {
	var text = e.originalEvent.clipboardData.getData('text');
	var currentPos = e.currentTarget.selectionStart;
	if (this.validText(text)) {
		this.applyText(text, currentPos);
	}
};

Painter.prototype.validText = function (text) {
	for (var i = 0; i < text.length; i++) {
		if (!Orb.colors[text[i]]) {
			return false;
		}
	}
	return true;
};

module.exports = Painter;
