import React from 'react';

import locale, {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default React.createClass({
	displayName: 'CreditHours',

	propTypes: {
		entry: React.PropTypes.object.isRequired,
		credit: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
	},


	render () {
		let keyPrefix = this.props.entry + '-credit-';
		let credits = this.props.credit || [];
		//let hours = (credits[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
				{/*{locale('UNITS.credits', { count: hours  })} {t('CREDIT.available')}<br />*/}
				{credits.map((credit, i) => {
					let e = credit.Enrollment || {};
					return (
						<div className="credit" key={keyPrefix + i}>
							{locale('UNITS.credits', { count: credit.Hours })} {t('CREDIT.available')}<br />
							<a href={e.url} target="_blank">{e.label}</a>
						</div>
					);
				})}
			</div>
		);
	}
});
