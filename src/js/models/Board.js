import Orb from './Orb';

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 5;

class Board {
  constructor() {
    this._board = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this._board.push([]);
    }

    this._populate();
  }

  addOrb(orb, [x, y]) {
    this.setPosition([x, y], orb);
    orb.setPosition([x, y]);
  }

  getPosition([x, y]) {
    return this._board[y][x];
  }

  setPosition([x, y], value) {
    this._board[y][x] = value;
  }

  /**
   * @return {array}
   */
  orbs() {
    let orbs = [];
    this._eachSlot(([x, y]) => orbs.push(this.getPosition([x, y])));
    return orbs;
  }

  slotsEqual(slot1, slot2) {
    return slot1[0] === slot2[0] && slot1[1] === slot2[1];
  }

  /**
   * Performs the callback on each orb slot position.
   * @param {function} callback - The callback to perform.
   */
  _eachSlot(callback) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        callback([x, y])
      }
    }
  }

  _populate() {
    this._eachSlot(pos => this.addOrb(Orb.Random(), pos));
  }
}

export default Board;
