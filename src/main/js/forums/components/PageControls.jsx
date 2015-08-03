import React from 'react';
import {Link} from 'react-router-component';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

const goToPage = 'PageControls:goToPage';

export default React.createClass({
	displayName: 'forums:PageControls',

	mixins: [NavigatableMixin],

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

	[goToPage] () {
		scrollTo(0, 0); // solves an issue in firefox on android in which navigating to a short page from the bottom of a long one results in a blank screen.
		let page = React.findDOMNode(this.refs.pageselect).value;
		this.navigate('/?p=' + page);
	},

	pageSelector (paging) {
		let current = paging.currentPage();
		let options = [];
		for(let i = 1; i <= paging.numPages; i++) {
			options.push(<option key={'option' + i} value={i}>{i}</option>);
		}
		return (
			<div className="page-selector-wrapper">
				<select value={current}
						ref="pageselect"
						onChange={this[goToPage]}
						className="page-select">
							{options}
						</select>
					of {paging.numPages}
			</div>
		);
	},

	render () {

		let {paging} = this.props;
		let current = paging.currentPage();
		let next = current + 1;
		let prev = current - 1;

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
