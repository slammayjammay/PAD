import React from 'react';

require('./index.scss');

class Orb extends React.Component {
	static colors = ['red', 'blue', 'green', 'light', 'dark', 'heart'];

	static randomColor() {
		let idx = ~~(Math.random() * Orb.colors.length);
		return Orb.colors[idx];
	}

	constructor(props) {
		super(props);

		this.state = {
			isDragging: false
		};
	}

	getClassName() {
		return [
			'orb',
			this.props.color,
			this.state.isDragging ? 'dragging' : ''
		].join(' ');
	}

	onMouseDown(e) {
		e.preventDefault();

		this.setState({ isDragging: true });
		this.props.onOrbHold(e);
	}

	onMouseUp(e) {
		e.preventDefault();

		this.setState({ isDragging: false });
		this.props.onOrbRelease();
	}

	render() {
		return (
			<div
				ref="el"
				className={this.getClassName()}
				onMouseDown={this.onMouseDown.bind(this)}
			/>
		);
	}
}

export default Orb;
