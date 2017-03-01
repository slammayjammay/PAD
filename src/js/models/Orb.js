class Orb {
	static colors = ['red', 'blue', 'green', 'light', 'dark', 'heart'];

	static Random() {
		let idx = ~~(Math.random() * Orb.colors.length);
		return new Orb(Orb.colors[idx]);
	}

	constructor(color) {
		if (!Orb.colors.includes(color)) {
			throw new Error(`${color} is not a valid color.`);
		}

		this.color = color;
	}

	setPosition([x, y]) {
		this.position = [x, y];
	}
}

export default Orb;
