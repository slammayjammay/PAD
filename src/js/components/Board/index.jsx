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

  render() {
		let orbs = this.model.orbs().map((orb, idx) => {
			return (<Orb color={orb.color} key={idx} style={this.getOrbStyle(orb)}/>);
		});

		return (
      <div className="board board-outer">
        <div className="board-inner">
          { orbs }
        </div>
      </div>
    );
  }
}

export default Board;
