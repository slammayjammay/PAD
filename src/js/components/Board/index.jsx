import 'gsap';
import React from 'react';
import ReactDom from 'react-dom';
import Orb from '../Orb';

require('./index.scss');

// NO! make responsive.
const ORB_SIZE = 90;
const DURATION = 0.2;

class Board extends React.Component {
	constructor(props) {
		super(props);

		this.setup();

		this.state = {
			isDragging: false
		};
	}

	setup() {
		this.orbs = {};
		this._board = [];

		for (let y = 0; y < this.props.height; y++) {
			this._board.push([]);
		}

		this.eachSlot(([x, y]) => {
			this._board[y][x] = (
				<Orb
					color={Orb.randomColor()}
					key={`${x}${y}`}
					attachToBoard={ el => this.orbs[`orb${x}${y}`] = el }
					onOrbHold= { this.onOrbHold.bind(this) }
				/>
			);
		});
	}

	/**
	 * Performs the callback on each orb slot position.
	 * @param {function} callback - The callback to perform.
	 */
	eachSlot(callback) {
		for (let y = 0; y < this.props.height; y++) {
			for (let x = 0; x < this.props.width; x++) {
				callback([x, y]);
			}
		}
	}

	match() {
		let matches = this.getAllMatches();
	}

	getAllMatches() {
		let matches = [];
		let alreadyMatched = {};

		this.eachSlot(([x, y]) => {
			if (alreadyMatched[this.getOrbElAtPosition([x, y])]) {
				return;
			}

			let horizontalMatch = this.getOrbHorizontalMatch([x, y]);
			let verticalMatch = this.getOrbVerticalMatch([x, y]);

			let match = new Set(...horizontalMatch, ...verticalMatch);

			// push match in
			matches.push(match);

			// cache matched orbs
			match.forEach(orbEl => alreadyMatched[orbEl] = true);
		});

		return matches;
	}

	getOrbHorizontalMatch([x, y]) {
		return this.getOrbMatchInDirection([x, y], [1, 0]);
	}

	getOrbVerticalMatch([x, y]) {
		return this.getOrbMatchInDirection([x, y], [0, 1]);
	}

	/**
	 * Looks for a match starting from the start position, and move in the
	 * direction of dirX and dirY, negative and positive.
	 *
	 * @param {integer} x - The x value of the start position.
	 * @param {integer} y - The y value of the start position.
	 * @param {integer} dirX - The direction of X to move in.
	 * @param {integer} dirY - The direction of Y to move in.
	 * @return {array} - An array of orb elements.
	 */
	getOrbMatchInDirection([x, y], [dirX, dirY]) {
		let match = [];
		let currentOrb = this.getOrbAtPosition([x, y]);
		let nextX = null;
		let nextOrb = null;

		let lookDir = -1;
		let nextX = x + 1 * lookDir * dirX;
		let nextY = y + 1 * lookDir * dirY;

		// look negative then positive
		while (nextOrb = this.getOrbAtPosition([nextX, nextY])) {
			if (!nextOrb && lookDir === 1) {
				// we're done looking
				break;
			}

			if (!nextOrb) {
				// switch directions
				nextX = x + 1;
				nextY = y + 1;
				lookDir =* -1;
				continue;
			}

			if (nextOrb.props.color === currentOrb.props.color) {
				// push in the match and increment x or y
				match.push(this.getOrbElAtPosition([nextX, nextY]));

				nextX = nextX + 1 * lookDir * dirX;
				nextY = nextY + 1 * lookDir * dirY;
			}
		}

		return match.length >= 3 ? match : [];
	}

	onOrbHold(e) {
		this.orbEl = e.currentTarget;
		this.currentSlot = this.getSlotAtPoint(e.pageX, e.pageY);
		this.setState({ isDragging: true });

		this.setOrbPosition(e.pageX, e.pageY);
	}

	onMouseMove(e) {
		if (!this.state.isDragging) {
			return;
		}

		this.setOrbPosition(e.pageX, e.pageY);

		this.newSlot = this.detectSlotChange(e);
		if (this.newSlot) {
			let swappedOrb = this.getOrbElAtPosition(this.newSlot);
			this.triggerOrbSwap(swappedOrb);
			this.currentSlot = this.newSlot;
			this.newSlot = null;
		}
	}

	triggerOrbSwap(orbEl) {
		if (!orbEl) {
			return;
		}

		let [ x, y ] = this.currentSlot;
		let [ newX, newY ] = this.newSlot;

		this.positionOrbAtSlot(orbEl, [ x, y ], DURATION);

		this.orbs[`orb${x}${y}`] = orbEl;
		this.orbs[`orb${newX}${newY}`] = this.orbEl;
	}

	onMouseUp(e) {
		this.positionOrbAtSlot(this.orbEl, this.currentSlot, DURATION);
		TweenMax.set(this.orbEl, { pointerEvents: 'all' });

		this.currentSlot = this.orbEl = null;
		this.setState({ isDragging: false });
	}

	setOrbPosition(pageX, pageY) {
		let { x, y } = this.getBoardPositionAtPoint(pageX, pageY);

		// center the orb around cursor
		x = x - ORB_SIZE / 2;
		y = -y + ORB_SIZE / 2;

		// constrain orb to inside the board
		x = Math.min(this.boardBox.width - ORB_SIZE, x);
		x = Math.max(0, x);
		y = Math.max(y, -this.boardBox.height + ORB_SIZE);
		y = Math.min(0, y);

		TweenMax.set(this.orbEl, { x, y, pointerEvents: 'none' });
	}

	positionOrbAtSlot(orbEl, [slotX, slotY], duration = 0) {
		let x = slotX * ORB_SIZE;
		let y = -(slotY * ORB_SIZE);

		TweenMax.to(orbEl, duration, { x, y });
	}

	getOrbAtPosition([x, y]) {
		if (!this._board[y]) {
			return null;
		}
		return this._board[y][x];
	}

	getOrbElAtPosition([x, y]) {
		return this.orbs[`orb${x}${y}`];
	}

	getBoardPositionAtPoint(pageX, pageY) {
		let x = pageX - this.boardBox.left;
		let y = -(pageY - this.boardBox.height - this.boardBox.top);

		return { x, y };
	}

	getSlotAtPoint(pageX, pageY) {
		let { x, y } = this.getBoardPositionAtPoint(pageX, pageY);
		let [slotX, slotY] = [~~(x / 90), ~~(y / 90)];

		if (Math.abs(x - slotX * 90) <= 5 || Math.abs(y - slotY * 90) <= 5) {
			return;
		}

		return [slotX, slotY];
	}

	detectSlotChange(e) {
		let newSlot = this.getSlotAtPoint(e.pageX, e.pageY);
		if (!newSlot) {
			return;
		}
		return this.slotsEqual(this.currentSlot, newSlot) ? false : newSlot;
	}

	slotsEqual(slot1, slot2) {
		return slot1[0] === slot2[0] && slot1[1] === slot2[1];
	}

	render() {
		let orbs = [];
		this._board.forEach(row => orbs.push(...row));

		return (
			<div className="board board-outer">
				<div
					ref="board"
					className="board-inner"
					onMouseMove={ this.onMouseMove.bind(this) }
				>
					{ orbs }
				</div>
			</div>
		);
	}

	componentDidMount() {
		// TODO: calculate this on resize too
		this.boardBox = this.refs.board.getBoundingClientRect();

		// position each orb correctly
		this.eachSlot(([x ,y]) => {
			let orbEl = this.getOrbElAtPosition([x, y]);

			this.positionOrbAtSlot(orbEl, [x, y]);
		});

		window.addEventListener('mouseup', this.onMouseUp.bind(this));
	}
}

export default Board;
