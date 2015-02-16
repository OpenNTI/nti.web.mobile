import React from 'react';
import {Component as Video} from 'video';

export default {

	'application/vnd.nextthought.embeddedvideo': renderVideoWidget

};


function renderVideoWidget(_, props) {
	return React.createElement(Video, {src: props.embedURL, context:[]});
}
