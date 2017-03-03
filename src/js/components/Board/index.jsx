import 'gsap';
import React from 'react';
import ReactDom from 'react-dom';
import Orb from '../Orb';
import { default as Model } from '../../models/Board';

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
			this._board[x][y] = (
				<Orb
					color={Orb.randomColor()}
					key={`${x}${y}`}
					ref={ el => this.orbs[`orb${x}${y}`] = el }
				/>
			);
		});
	}

	/**
	 * Performs the callback on each orb slot position.
	 * @param {function} callback - The callback to perform.
	 */
	eachSlot(callback) {
		for (let x = 0; x < this.props.height; x++) {
			for (let y = 0; y < this.props.width; y++) {
				callback([x, y])
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
			this.listenOnceForSwap();
		}
	}

	listenOnceForSwap() {
		let fn = (e) => {
			let orb = e.currentTarget;

			if (!orb.classList.contains('orb')) {
				return;
			}

			this.refs.board.removeEventListener('mousemove', fn);
			this.triggerOrbSwap(orb);
		};

		this.refs.board.addEventListener('mousemove', fn);
	}

	triggerOrbSwap(orb) {

	}

	onMouseUp(e) {
		this.orbEl = null;
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

		TweenMax.set(this.orbEl, { x, y });
	}

	positionOrbAtSlot(orbEl, [slotX, slotY]) {
		let x = slotX * ORB_SIZE - ORB_SIZE / 2;
		let y = -(slotY * ORB_SIZE) + ORB_SIZE / 2;

		TweenMax.set(orbEl, { x, y });
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
		return this.model.slotsEqual(this.currentSlot, newSlot) ? false : newSlot;
	}

	render() {
		let orbs = [];
		this._board.forEach(row => orbs.push(...row));

		return (
			<div className="board board-outer">
				<div
					ref="board"
					className="board-inner"
					onMouseMove={this.onMouseMove.bind(this)}
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
			let orb = this.getOrbElAtPosition([x, y]);

			TweenMax.set(orb, {
				x: x * ORB_SIZE,
				y: y * ORB_SIZE
			});
		});

		window.addEventListener('mouseup', this.onMouseUp.bind(this));
	}
}

export default Board;
