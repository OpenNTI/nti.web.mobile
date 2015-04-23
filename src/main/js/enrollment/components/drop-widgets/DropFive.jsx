import React from 'react';

import Notice from 'common/components/Notice';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'DropFive',

	propTypes: {
		courseTitle: React.PropTypes.string.isRequired
	},

	onCancel () {
		history.back();
	},

	render () {
		return (
			<div>
				<Notice>To drop {this.props.courseTitle} please contact someone.</Notice>
				<div className="small-12 columns">
					<Button onClick={this.onCancel} className="small-5 columns">Okay</Button>
				</div>
			</div>
		);
	}

});
