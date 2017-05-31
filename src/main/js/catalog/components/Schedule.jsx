import PropTypes from 'prop-types';
import React from 'react';

import moment from 'moment';

export default class extends React.Component {
	static displayName = 'Schedule';

	static propTypes = {
		startDate: PropTypes.string.isRequired,
		schedule: PropTypes.shape({
			days: PropTypes.arrayOf(PropTypes.string),
			times: PropTypes.arrayOf(PropTypes.string)
		}).isRequired
	};

	format = (d) => {
		let date = this.props.startDate.split('T')[0];//YUCK
		date = [date, d].join('T'); //ICK!

		return moment(date).format('h:mm a');
	};

	render () {
		let {schedule} = this.props;
		return (
			<div className="value">
				<span>{schedule.days.join(' / ')}</span>
				<span className="space">{' '}</span>
				<span>{schedule.times.map(this.format).join(' - ')}</span>
			</div>
		);

	}
}
