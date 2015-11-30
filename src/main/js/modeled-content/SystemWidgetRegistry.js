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

renderVideoWidget.propTypes = {
	widget: React.propTypes.object.isRequired
};



function renderWhiteboardWidget (_, props) {
	let {widget, id} = props;

	props = {id, scene: widget};

	return React.createElement(Whiteboard, props);
}

renderWhiteboardWidget.propTypes = {
	id: React.propTypes.string.isRequired,
	widget: React.propTypes.object.isRequired
};
