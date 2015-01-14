'use strict';

var React = require('react/addons');
var Video = require('video').Component;

Object.assign(exports, {

	'application/vnd.nextthought.embeddedvideo': renderVideoWidget

});


function renderVideoWidget(_, props) {
	return React.createElement(Video, {src: props.embedURL, context:[]});
}
