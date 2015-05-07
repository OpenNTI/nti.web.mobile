import React from 'react';

import InlineLoader from 'common/components/LoadingInline';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'LoadMore',

	propTypes: {
		onClick: React.PropTypes.func,

		store: React.PropTypes.object
	},

	render () {
		let store = this.props.store;
		return (
			<div className="text-center button-box">
				{store.isBusy ?
					<InlineLoader/>
				:
					<Button onClick={this.props.onClick}>Load More</Button>
				}
			</div>
		);
	}

});
