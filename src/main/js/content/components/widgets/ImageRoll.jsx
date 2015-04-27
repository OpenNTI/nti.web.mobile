import React from 'react';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ImageRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'image-collection'
	},

	render () {
		return (
			<div>Image Roll!!</div>
		);
	}
});
