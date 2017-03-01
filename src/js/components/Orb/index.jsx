import React from 'react';
import 'gsap';

require('./index.scss');

class Orb extends React.Component {
  render() {
    return (
      <div
        className={`orb ${this.props.color}`}
				style={this.props.style}
				onMouseDown={this.props.onMouseDown}
				onMouseMove={this.props.onMouseMove}
      />
    );
  }
}

export default Orb;
