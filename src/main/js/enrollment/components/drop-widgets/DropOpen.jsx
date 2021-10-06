import React from 'react';
import PropTypes from 'prop-types';

import { Loading, Notice } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import { dropCourse } from '../../Actions';

export default class DropOpen extends React.Component {
	static propTypes = {
		courseId: PropTypes.string.isRequired,
		courseTitle: PropTypes.string.isRequired,
	};

	state = {
		loading: false,
	};

	onCancel = () => {
		global.history.back();
	};

	onConfirm = () => {
		this.setState({ loading: true });

		dropCourse(this.props.courseId);
	};

	render() {
		if (this.state.loading) {
			return <Loading.Mask />;
		}

		return (
			<div>
				<Notice>Drop {this.props.courseTitle}?</Notice>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
						margin: 0 0.9375rem;

						& > * {
							flex: 0 1 41%;
						}
					`}
				>
					<Button onClick={this.onCancel}>Cancel</Button>
					<Button
						destructive
						onClick={this.onConfirm}
						className="drop-course-confirmation"
					>
						Drop course
					</Button>
				</div>
			</div>
		);
	}
}
