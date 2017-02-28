import React from 'react';

require('../../sass/orb.scss');

class Orb extends React.Component {
  static colors = ['red', 'blue', 'green', 'light', 'dark', 'heart'];

  static randomColor() {
    var idx = ~~(Math.random() * Orb.colors.length);
    return Orb.colors[idx];
  }

  componentDidMount() {
    this.props.updatePosition(this);
  }

  render() {
    return (
      <div
        className={`orb ${this.props.color}`}
        ref={(el) => { this.el = el; }}
        style={this.props.style}
      />
    );
  }
}

export default Orb;
