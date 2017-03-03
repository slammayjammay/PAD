import React from 'react';
import Board from '../Board';
import Orb from '../Orb';

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 5;

class Game extends React.Component {
	render() {
		return (
			<div className="game">
				<Board width={BOARD_WIDTH} height={BOARD_HEIGHT}/>
			</div>
		);
	}
}

export default Game;
