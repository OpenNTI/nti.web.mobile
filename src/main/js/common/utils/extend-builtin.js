export default function (cls) {
	function ExtendableBuiltin () {
		cls.apply(this, arguments);
	}
	ExtendableBuiltin.prototype = Object.create(cls.prototype);
	Object.setPrototypeOf(ExtendableBuiltin, cls);

	return ExtendableBuiltin;
}
