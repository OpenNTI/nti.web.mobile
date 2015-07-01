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
				<Detail item={item} lite/>
			</div>
		);

	}
});
