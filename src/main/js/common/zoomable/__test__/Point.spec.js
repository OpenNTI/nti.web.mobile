import Point from '../Point';

describe('Point', () => {

	it('should have a Point.ORIGIN of (0,0)', () => {
		expect(Point.ORIGIN).toBeDefined();
		expect(Point.ORIGIN.x).toEqual(0);
		expect(Point.ORIGIN.y).toEqual(0);
	});

	it('should create a Point instance with the specified x and y', () => {
		let p = new Point(100, 200);
		expect(p.x).toEqual(100);
		expect(p.y).toEqual(200);
	});

	it('should have the id provided to the constructor', () => {
		let testId = 'test-id';
		let p = new Point(100, 200, testId);
		expect(p.id).toEqual(testId);
	});

	it('should generate an ID if one is not provided', () => {
		let p = new Point(100, 200);
		expect(p.id).toBeDefined();
		expect(p.id).not.toBeNull();
	});

	it('should return the sum of two points', () => {
		let p1 = new Point(10, 20);
		let p2 = new Point(30, 40);
		let p3 = p1.plus(p2);

		expect(p3.x).toEqual(40);
		expect(p3.y).toEqual(60);

	});

	it('should return the difference between two points', () => {
		let p1 = new Point(10, 30);
		let p2 = new Point(30, 40);
		let p3 = p1.minus(p2);

		expect(p3.x).toEqual(-20);
		expect(p3.y).toEqual(-10);
	});

	it('should return the product of two points', () => {
		let p1 = new Point(10, 30);
		let p2 = new Point(30, 40);
		let p3 = p1.times(p2);

		expect(p3.x).toEqual(300);
		expect(p3.y).toEqual(1200);
	});

	it('should scale the point by the given factor from the specified origin', () => {
		let p1 = new Point(0, 1);
		let p2 = new Point(2, 1);
		let p3 = p1.scale(2, p2);
		expect(p3.x).toBe(-2);
		expect(p3.y).toBe(1);

		p1 = new Point(0, 0);
		p2 = new Point(1, 1);
		p3 = p1.scale(2, p2);
		expect(p3.x).toBe(-1);
		expect(p3.y).toBe(-1);

		p1 = new Point(2, 2);
		p2 = new Point(1, 1);
		p3 = p1.scale(2, p2);
		expect(p3.x).toBe(3);
		expect(p3.y).toBe(3);
	});

	it('should find the middle point between p1 and p2', () => {
		let p1 = new Point(0, 0);
		let p2 = new Point(2, 4);
		let p3 = p1.middle(p2);
		expect(p3.x).toBe(1);
		expect(p3.y).toBe(2);

		// should work in either direction
		let p4 = p2.middle(p1);
		expect(p4.x).toBe(1);
		expect(p4.y).toBe(2);
	});

	it('should have a toString in the form of \'Point (id): (x, y)\'', () => {
		let p = new Point(10, 20, 'testPointId');
		expect(''.concat(p)).toEqual('Point testPointId: (10, 20)');
	});

});
