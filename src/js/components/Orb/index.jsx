import React from 'react';
import 'gsap';

require('./index.scss');

class Orb extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(e) {

    console.log(this.props.canSwap());

    if (e.target.classList.contains('dragging')) {
      return;
    }
    // console.log(e.target);
    // console.log('uh oh...');
  }

  render() {
    return (
      <div
        className={`orb ${this.props.color}`}
				style={this.props.style}
				onMouseDown={this.props.onMouseDown}
				onMouseMove={this.onMouseMove}
      />
    );
  }
}

export default Orb;
