import './Filters.scss';
import React from 'react';
import { decorate } from '@nti/lib-commons';
import { HOC } from '@nti/web-commons';

class Filters extends React.Component {
	render() {
		return (
			<svg className="svg-filter">
				<filter id="active-tab-filter">
					<feFlood result="flood" floodColor="red" />
					<feComposite
						in="flood"
						in2="SourceAlpha"
						operator="atop"
						result="maskedflood"
					/>
				</filter>
			</svg>
		);
	}
}

export default decorate(Filters, [HOC.SingleInstance]);
