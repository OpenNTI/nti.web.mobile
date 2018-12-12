import React from 'react';
import {Header} from '@nti/web-calendar';

import {closeDialog} from '../../util';

export default class Toolbar extends React.PureComponent {

	render () {
		return (
			<div className="mobile-calendar-view-toolbar">
				<div onClick={closeDialog}>Back</div>
				<Header />
				<div>Today</div>
			</div>
		);
	}
}
