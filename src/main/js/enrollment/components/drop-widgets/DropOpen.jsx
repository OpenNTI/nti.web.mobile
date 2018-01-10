import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Notice} from 'nti-web-commons';

import Button from 'forms/components/Button';

import {dropCourse} from '../../Actions';

export default class extends React.Component {
	static displayName = 'DropOpen';

	static propTypes = {
		courseId: PropTypes.string.isRequired,
		courseTitle: PropTypes.string.isRequired
	};

	state = {
		loading: false
	};

	onCancel = () => {
		global.history.back();
	};

	onConfirm = () => {
		this.setState({ loading: true });

		dropCourse(this.props.courseId);
	};

	render () {

		if(this.state.loading) {
			return <Loading.Mask />;
		}

		return (
			<div>
				<Notice>Drop {this.props.courseTitle}?</Notice>
				<div className="small-12 columns">
					<Button onClick={this.onCancel} className="small-5 columns">Cancel</Button>
					<Button onClick={this.onConfirm} className="small-5 columns drop-course-confirmation">Drop course</Button>
				</div>
			</div>
		);
	}
}
