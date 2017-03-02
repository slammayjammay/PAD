import React from 'react';
import 'gsap';

require('./index.scss');

class Orb extends React.Component {
  constructor(props) {
    super(props);

		this.state = {
			isDragging: false
		};
  }

	className() {
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
        className={this.className()}
				style={this.props.style}
				onMouseDown={this.onMouseDown.bind(this)}
      />
    );
  }
}

export default Orb;
