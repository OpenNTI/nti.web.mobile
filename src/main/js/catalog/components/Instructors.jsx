import React from 'react';

import Instructor from './Instructor';

export default React.createClass({
	displayName: 'Instructors',

	propTypes: {
		entry: React.PropTypes.object
	},

	render () {
		let {entry} = this.props;
		let instructors = ((entry || {}).Instructors) || [];
		let root = '/no-root/';

		if (entry) {
			root = entry.getAssetRoot() || root;
		}

		return (
			<div className="instructors">
			{instructors.map((i, index) =>
				<Instructor key={i.Name} index={index} assetRoot={root} instructor={i}/>
			)}
			</div>
		);
	}
});
