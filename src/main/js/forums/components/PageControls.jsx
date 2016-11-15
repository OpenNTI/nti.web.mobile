import React from 'react';
import {Link} from 'react-router-component';
import {Mixins} from 'nti-web-commons';

const goToPage = 'PageControls:goToPage';

export default React.createClass({
	displayName: 'forums:PageControls',

	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		// available from Paging mixin
		paging: React.PropTypes.shape({
			currentPage: React.PropTypes.func,
			pageSize: React.PropTypes.number,
			numPages: React.PropTypes.number,
			hasPrevious: React.PropTypes.bool,
			hasNext: React.PropTypes.bool
		}).isRequired
	},


	[goToPage] ({target}) {
		scrollTo(0, 0); // solves an issue in firefox on android in which navigating to a short page from the bottom of a long one results in a blank screen.
		const {value: page} = target;
		setTimeout(() => this.navigate('/?p=' + page), 1);
	},

	pageSelector (paging) {
		const current = paging.currentPage();

		return (
			<div className="page-selector-wrapper">
				<select value={current} onChange={this[goToPage]} className="page-select">
					{Array.from({length: paging.numPages})
						.map((_, i) => (i++, <option key={i} value={i}>{i}</option>))
					}
				</select>
				of {paging.numPages}
			</div>
		);
	},

	render () {
		const {paging} = this.props;
		const current = paging.currentPage();
		const next = current + 1;
		const prev = current - 1;

		return (
			<ul className="page-controls">
				<li className="item previous">{paging.hasPrevious && <Link className="link" href={'/?p=' + prev}>Previous</Link>}</li>
				<li className="item current">
					{paging.numPages > 1 ? this.pageSelector(paging) : 'Page 1 of 1'}
				</li>
				<li className="item next">{paging.hasNext && <Link className="link" href={'/?p=' + next}>Next</Link>}</li>
			</ul>
		);
	}
});
