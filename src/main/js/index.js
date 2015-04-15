
require('babel/polyfill');

//monkey patch react and stop warning about contexts
let warn = require('react/lib/ReactCompositeComponent');
warn.Mixin._warnIfContextsDiffer = function(){};// eslint-disable-line

//TODO: find a way to get rid of this dirty import. All deps should come
// from node_modules, so switch to this in the future:
// 		https://www.npmjs.com/package/modernizr
// Its not a simple swap...otherwise I would have done that.
require('script!../resources/vendor/modernizr/modernizr.js');

let FastClick = require('fastclick');
let QueryString = require('query-string');
let React = require('react');
let {overrideConfigAndForceCurrentHost, getServerURI} = require('common/utils');
let OrientationHandler = require('common/utils/orientation');
//let emptyFunction = require('react/lib/emptyFunction');
// let preventOverscroll = require('common/thirdparty/prevent-overscroll');


//Allow CSS :active states:
//document.addEventListener("touchstart", emptyFunction, true);

overrideConfigAndForceCurrentHost();
console.debug('Client is using host: %s', getServerURI());

let EventPluginHub = require('react/lib/EventPluginHub');
let ResponderEventPlugin = require('common/thirdparty/ResponderEventPlugin');
let TapEventPlugin = require('common/thirdparty/TapEventPlugin');

EventPluginHub.injection.injectEventPluginsByName({
	ResponderEventPlugin: ResponderEventPlugin,
	TapEventPlugin: TapEventPlugin
});


FastClick.attach(document.body);

React.initializeTouchEvents(true);


// preventOverscroll(document.body);


// if (("standalone" in navigator) && !navigator.standalone){
// 	//Suggest Bookmarking to the home screen...
// }

let basePath = (global.$AppConfig || {}).basepath || '/';

let AppView = require('./AppView');
let app = React.render(
	React.createElement(AppView, {basePath: basePath}),
	document.getElementById('content')
);


let LoginActions = require('login/Actions');
let LoginStore = require('login/Store');
LoginStore.addChangeListener(function(evt) {
	let loc = global.location || {};
	let returnURL = QueryString.parse(loc.search).return;
	if (evt && evt.property === LoginStore.Properties.isLoggedIn) {
		if (evt.value) {
			LoginActions.deleteTOS();
			//app.navigate(returnURL || basePath, {replace:true});
			loc.replace(returnURL || basePath);
		}
		else {
			app.navigate(basePath + 'login/', {replace: true});
		}
	}
});


//After bundle CSS is injected, lets move this back down so it overrides the bundle.
let site = document.getElementById('site-override-styles');
if (site) { site.parentNode.appendChild(site); }

let sscss = document.getElementById('server-side-style');

//Lets free some memory... the server sends styles to the initial page view looks
//correct while the bundle downloads/loads...once loaded and in place, we want to
//remove the styles the server injected, in favor of the client's bundled styles
//(probably 100% identical, but we can't cut it out of the bundle...so lets just
//remove this form the dom and free up memory)... It's served its purpose.
if (sscss) {
	sscss.parentNode.removeChild(sscss);
}

OrientationHandler.init(app);

global.onbeforeunload = function() {
	app.setState({mask: 'Reloading...'});
};
