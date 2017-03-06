var $ = require('jquery');

var Orb = require('./orb');
var Match = require('./match');

var Board = function Board ($el) {
	this.$el = $el;
	this.board = [];
	for (var i = 0; i < 10; i++) {
		this.board.push([]);
	}
};

Board.prototype.addOrb = function (orb, pos) {
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

	return matchOrbs.length >= 3 ? new Match(this, matchOrbs) : false;
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

Board.prototype.clearSkyfallSlots = function () {
	for (var i = 5; i < 10; i++) {
		this.board[i].splice(0);
	}
};

Board.prototype.createSkyfallOrbs = function (empties) {
	// for each position in the given list of empty board slots, create a
	// skyfall orb. add it to the board in the correct column, and at least one
	// row above the board height

	for (var i = 0; i < empties.length; i++) {
		var col = empties[i][1];

		for (var height = 0; height < 5; height++) {
			var pos = [5 + height, col];
			if (!this.orbAtPosition(pos)) {
				var orb = new Orb.skyfall();
				this.addOrb(orb, pos);
				break;
			}
		}
	}
};

Board.prototype.dropOrb = function (orb) {
	orb.$el.addClass('gravity');

	this.board[orb.pos[0]][orb.pos[1]] = undefined;
	var newPos = [orb.pos[0] - 1, orb.pos[1]];
	this.board[newPos[0]][newPos[1]] = orb;
	orb.updatePosition(newPos);
};

Board.prototype.ensureNoMatches = function () {
	var matches = this.getMatches();
	while (matches.length > 0) {
		for (var i = 0; i < matches.length; i++) {
			matches[i].randomize();
		}
		matches = this.getMatches();
	}
};

Board.prototype.extendMatch = function (match) {
	// checks for all possible orbs that are also connected to this match

	match.setAsParent();

	var dirToCheck = match.orbs[1].pos[0] - match.orbs[0].pos[0] === 0;
	if (dirToCheck) {
		// if dirToCheck is true then this match is aligned horizontally
		dirToCheck = 'v';
	} else {
		dirToCheck = 'h';
	}

	var queue = [];
	for (var i = 0; i < match.orbs.length; i++) {
		queue.push({ orb: match.orbs[i], dirToCheck: dirToCheck });
	}

	while (queue.length > 0) {
		var current = queue.shift();
		var newMatch = this.checkForMatch(current.orb, current.dirToCheck);
		if (!newMatch) continue;

		for (var i = 0; i < newMatch.orbs.length; i++) {
			var newOrb = newMatch.orbs[i];
			if (newOrb === current.orb || newOrb.match === match) continue;

			var newDir = current.dirToCheck === 'h' ? 'v' : 'h';
			queue.push({ orb: newOrb, dirToCheck: newDir });
		}
		match.merge(newMatch);
	}

	return match;
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

Board.prototype.getEmpties = function () {
	var empties = [];

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 6; j++) {
			if (!this.board[i][j]) {
				empties.push([i, j]);
			}
		}
	}
	return empties;
};

Board.prototype.getMatches = function () {
	// reset orbs for error handling. go through all orbs, find the matches for
	// each, and push it into totalMatches. skip orbs that are already in a
	// match.

	this.resetOrbs();
	var totalMatches = [];

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 6; j++) {
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

Board.prototype.getMatchesForOrb = function (orb) {
	// first check if this orb is in a horizontal match. if yes, there's no need
	// to check for a possible vertical match. extendMatch() will do that. if no,
	// check for a vertical match and extend

	var match = this.checkForMatch(orb, 'h');
	if (!match) match = this.checkForMatch(orb, 'v');
	if (!match) return false;

	return this.extendMatch(match);
};

Board.prototype.getOrbsAbovePos = function (pos) {
	var orbs = [];
	for (var i = 1; pos[0] + i < 10; i++) {
		var orb = this.board[pos[0] + i][pos[1]];
		if (orb) orbs.push(orb);
	}
	return orbs;
};

Board.prototype.gravity = function (empties) {
	var orbsToFall = [];
	for (var i = 0; i < empties.length; i++) {
		orbsToFall = orbsToFall.concat(this.getOrbsAbovePos(empties[i]));
	}
	for (var idx = 0; idx < orbsToFall.length; idx++) {
		this.dropOrb(orbsToFall[idx]);
	}
	this.clearSkyfallSlots();
};

Board.prototype.hideOrbs = function () {
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 6; j++) {
			this.orbAtPosition(i, j).hide();
		}
	}
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
			this.addOrb(orb, [j, i]);
		}
	}

	this.ensureNoMatches();
};

Board.prototype.removeOrb = function (orb) {
	this.board[orb.pos[0]][orb.pos[1]] = undefined;
};

Board.prototype.resetOrbs = function () {
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 6; j++) {
			this.orbAtPosition(i, j).match = undefined;
		}
	}
};

Board.prototype.skyfall = function () {
	var empties = this.getEmpties();
	this.createSkyfallOrbs(empties);

	setTimeout(function () {
		this.gravity(empties);
	}.bind(this), 100);
};

Board.prototype.swapOrbs = function (currentOrb, newOrb) {
	var currentPos = currentOrb.pos;
	var newPos = newOrb.pos;

	this.board[currentPos[0]][currentPos[1]] = newOrb;
	this.board[newPos[0]][newPos[1]] = currentOrb;
	currentOrb.updatePosition(newPos);
	newOrb.updatePosition(currentPos);
};

module.exports = Board;
