import React from 'react';

import locale, {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

export default React.createClass({
	displayName: 'CreditHours',

	propTypes: {
		entry: React.PropTypes.string.isRequired,
		credit: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
	},


	render () {
		let {entry, credit = []} = this.props;
		let keyPrefix = entry + '-credit-';
		//let hours = (credit[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
				{/*{locale('UNITS.credits', { count: hours  })} {t('CREDIT.available')}<br />*/}
				{credit.map((item, i) => {
					let e = item.Enrollment || {};
					return (
						<div className="item" key={keyPrefix + i}>
							{locale('UNITS.credits', { count: item.Hours })} {t('CREDIT.available')}<br />
							<a href={e.url} target="_blank">{e.label}</a>
						</div>
					);
				})}
			</div>
		);
	}
});
