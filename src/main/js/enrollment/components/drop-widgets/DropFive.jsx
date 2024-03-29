import React from 'react';
import PropTypes from 'prop-types';

import { NoticePanel as Notice, Button } from '@nti/web-core';

export default class extends React.Component {
	static displayName = 'DropFive';

	static propTypes = {
		courseTitle: PropTypes.string.isRequired,
	};

	onCancel = () => {
		global.history.back();
	};

	render() {
		return (
			<div>
				<Notice>
					To drop {this.props.courseTitle} please contact support.
				</Notice>
				<div className="small-12 columns">
					<Button onClick={this.onCancel} className="small-5 columns">
						Okay
					</Button>
				</div>
			</div>
		);
	}
}
