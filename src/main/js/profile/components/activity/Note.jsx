import React from 'react';

import Detail from 'content/components/discussions/Detail';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Note',
	mixins: [Mixin],

	statics: {
		mimeType: /note$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		return (
			<div>
				{/*Context With Image and Breadcrumb*/}
				<Detail item={item} lite/>
				{/*<Actions item={item}/> -- Comment count, [edit] [delete]*/}
			</div>
		);

	}
});
