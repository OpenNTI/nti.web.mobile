import React from 'react';

import Notice from 'common/components/Notice';
import Button from 'common/forms/components/Button';
import Loading from 'common/components/Loading';

import {dropCourse} from '../../Actions';

export default React.createClass({
	displayName: 'DropOpen',

	propTypes: {
		courseId: React.PropTypes.string.isRequired,
		courseTitle: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: false
		};
	},

	onCancel () {
		history.back();
	},

	onConfirm () {
		this.setState({ loading: true });

		dropCourse(this.props.courseId);
	},

	render () {

		if(this.state.loading) {
			return <Loading />;
		}

		return (
			<div>
				<Notice>Drop {this.props.courseTitle}?</Notice>
				<div className="small-12 columns">
					<Button onClick={this.onCancel} className="small-5 columns">Cancel</Button>
					<Button onClick={this.onConfirm} className="small-5 columns">Drop course</Button>
				</div>
			</div>
		);
	}

});
