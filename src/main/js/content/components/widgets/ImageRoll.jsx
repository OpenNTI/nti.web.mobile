import React from 'react';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ImageRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'image-collection'
	},


	propTypes: {
		item: React.PropTypes.object
	},


	componentDidMount () {
		console.log(this.props.item);
	},

	render () {
		return (
			<div>Image Roll!!</div>
		);
	}
});
