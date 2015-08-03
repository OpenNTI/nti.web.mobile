import React from 'react';
import {Component as Video} from 'video';
import {Panel as Whiteboard} from 'whiteboard';

export default {

	'application/vnd.nextthought.embeddedvideo': renderVideoWidget,

	'application/vnd.nextthought.canvas': renderWhiteboardWidget
};


function renderVideoWidget (_, props) {
	let {widget} = props;
	return React.createElement(Video, {src: widget.embedURL, context: []});
}


function renderWhiteboardWidget (_, props) {
	let {widget, id} = props;

	props = {id, scene: widget};

	return React.createElement(Whiteboard, props);
}
