import React from 'react';

export default React.createClass({
	displayName: 'AnnotationBar',

	getRange () {
		return window.getSelection().getRangeAt(0);
	},

/*
	{name: 'yellow', color: 'EDE619'},
	{name: 'green', color: '4CE67F'},
	{name: 'blue', color: '3FB3F6'}
*/

	render () {
		return (
			<div className="add annotation toolbar">
				<button className="new-ugd highlight yellow">Highlight Yellow</button>
				<button className="new-ugd highlight green">Highlight Green</button>
				<button className="new-ugd highlight blue">Highlight Blue</button>
				<span className="spacer"/>
				<button className="new-ugd note icon-discuss">Discuss</button>
			</div>
		);
	}
});
