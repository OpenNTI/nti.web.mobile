import React from 'react';
import {Component as Video} from 'video';
import {Panel as Whiteboard} from 'whiteboard';
import {FileAttachmentIcon} from 'nti-modeled-content';

export default {
	'application/vnd.nextthought.embeddedvideo': renderVideoWidget,
	'application/vnd.nextthought.canvas': renderWhiteboardWidget,
	'application/vnd.nextthought.contentfile': renderFileAttachment
};


function renderVideoWidget (_, properties) {
	const {widget} = properties;
	return React.createElement(Video, {src: widget.embedURL, context: []});
}


function renderWhiteboardWidget (_, properties) {
	const {widget, id} = properties;
	const props = {id, scene: widget};
	return React.createElement(Whiteboard, props);
}


function renderFileAttachment (_, properties) {
	const {widget, id} = properties;
	return React.createElement(FileAttachmentIcon, {data: widget, id});
}
