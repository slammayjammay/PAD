import React from 'react';
import ReactDom from 'react-dom';
import Orb from './Orb';

require('../../sass/board.scss');

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 5;
const ORB_SIZE = 90;

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board.push([]);
    }

    this.updateOrbPosition = this.updateOrbPosition.bind(this);
  }

  componentDidMount() {
    this.populate();
    this.forceUpdate();
  }

  populate() {
    this.orbs = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        let color = Orb.randomColor();
        let style = {
          left: `${j * ORB_SIZE}px`,
          bottom: `${i * ORB_SIZE}px`
        };
        let orb = (
          <Orb
            color={color}
            key={`${i}${j}`}
            position={[i, j]}
            updatePosition={this.updateOrbPosition}
            style={style}
          />
        );

        this.orbs.push(orb);
        this.board[i][j] = orb;
      }
    }

    // this.ensureNoMatches();
  }

  updateOrbPosition(orb) {
    // orb.el.style.left = orb.props.position[0] * ORB_SIZE + 'px';
    // orb.el.style.top = orb.props.position[1] * ORB_SIZE + 'px';
  }

  render() {
    return (
      <div className="board board-outer">
        <div className="board-inner" ref={(el) => { this.el = el; }}>
          { this.orbs }
        </div>
      </div>
    );
  }
}

export default Board;
