import React from 'react';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'VideoRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'videoroll'
	},

	render () {
		return (
			<div>VIDEO ROLL!!</div>
		);
	}
});
