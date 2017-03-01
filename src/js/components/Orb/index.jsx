import React from 'react';

require('./index.scss');

class Orb extends React.Component {
  render() {
    return (
      <div
        className={`orb ${this.props.color}`}
				style={this.props.style}
      />
    );
  }
}

export default Orb;
