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
