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

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.isDragging = this.isDragging.bind(this);
  }

	/**
	 * @param {Orb} orb - The instance of the orb model.
	 */
	getOrbStyle(orb) {
		return {
			left: `${orb.position[0] * ORB_SIZE}px`,
			bottom: `${orb.position[1] * ORB_SIZE}px`
		};
	}

  isDragging() {
    return this._isDragging;
  }

	onMouseDown(e) {
		e.preventDefault();

		this.orb = e.currentTarget;
		let board = document.querySelector('.board-inner');

    this._isDragging = true;

    this.orb.classList.add('dragging');

		this.orbBox = this.orb.getBoundingClientRect();
		this.boardBox = board.getBoundingClientRect();
	}

	onMouseMove(e) {
		if (!this._isDragging) {
			return;
		}

		let x = e.pageX - this.boardBox.left - (this.orbBox.width / 2);
		let y = e.pageY - this.boardBox.bottom + (this.orbBox.width / 2);

    // constrain orb to inside the board
		x = Math.min(this.boardBox.width - this.orbBox.width, x);
		x = Math.max(0, x);
		y = Math.max(y, -this.boardBox.height + this.orbBox.height);
		y = Math.min(0, y);

		TweenMax.set(this.orb, { x, y, left: 0, bottom: 0, pointerEvents: 'none' });
	}

	onMouseUp(e) {
    this.orb.classList.remove('dragging');

		this._isDragging = false;
		this.orb = this.orbBox = this.boardBox = null;
	}

  render() {
		let orbs = this.model.orbs().map((orb, idx) => {
			return (
				<Orb
					color={orb.color}
					key={idx}
					style={this.getOrbStyle(orb)}
					onMouseDown={this.onMouseDown}
          canSwap={this.isDragging}
				/>
			);
		});

		return (
      <div className="board board-outer">
        <div className="board-inner" onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
          { orbs }
        </div>
      </div>
    );
  }
}

export default Board;
