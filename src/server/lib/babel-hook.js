require('babel-core/register')({
	ignore: false,//parse node_modules too

	//but...

	// only if filenames match this regex...
	only: /(nti.lib|react-editor-component|server\/lib)[^\/]*\/((?!node_modules\/).+)/
});
