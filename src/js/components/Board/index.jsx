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

		this.model = new Model();
		this.state = {
			isDragging: false
		};
  }

	/**
	 * @param {Orb} orb - The instance of the orb model.
	 */
	getOrbStyle(orb) {
    let x = orb.position[0] * ORB_SIZE - ORB_SIZE / 2;
    let y = -(orb.position[1] * ORB_SIZE) + ORB_SIZE / 2;

    return {
      transform: translate(`${x}px ${y}px`)
		};
	}

	onOrbHold(e) {
		this.orbEl = e.currentTarget;
		// this.currentPosition = this.getBoardPositionAtPoint(e.pageX, e.pageY);
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
		let orbs = this.model.orbs().map((orb, idx) => {
			return (
				<Orb
					color={orb.color}
					key={idx}
					onOrbHold={this.onOrbHold.bind(this)}
					style={this.getOrbStyle(orb)}
				/>
			);
		});

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

		window.addEventListener('mouseup', this.onMouseUp.bind(this));
	}
}

export default Board;
