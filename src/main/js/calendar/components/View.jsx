import React from 'react';
import PropTypes from 'prop-types';
import {Calendar} from '@nti/web-calendar';
import {DarkMode} from '@nti/web-commons';

export default class View extends React.Component {

	render () {
		return (
			<>
				<DarkMode/>
				<Calendar className="nti-mobile-calendar" />
			</>
		);
	}
}
