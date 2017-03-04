import 'gsap';
import React from 'react';
import ReactDom from 'react-dom';
import Orb from '../Orb';

require('./index.scss');

// NO! make responsive.
const ORB_SIZE = 90;

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

		this.newSlot = this.slotChange(e);
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

		this.positionOrbAtSlot(orbEl, [ x, y ], 0);

		this.orbs[`orb${x}${y}`] = orbEl;
		this.orbs[`orb${newX}${newY}`] = this.orbEl; 
	}

	onMouseUp(e) {
		this.positionOrbAtSlot(this.orbEl, this.currentSlot);
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
		return [~~(x / 90), ~~(y / 90)];
	}

	slotChange(e) {
		let newSlot = this.getSlotAtPoint(e.pageX, e.pageY);
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
