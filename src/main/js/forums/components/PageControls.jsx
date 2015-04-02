import React from 'react';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'PageControls',

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

	render () {

		let {paging} = this.props;
		let current = paging.currentPage();
		let next = current + 1;
		let prev = current - 1;


		return (
			<ul className="page-controls">
				<li className="item previous">{paging.hasPrevious && <Link className="link" href={'/?p=' + prev}>Previous</Link>}</li>
				<li className="item current">{current} of {paging.numPages}</li>
				<li className="item next">{paging.hasNext && <Link className="link" href={'/?p=' + next}>Next</Link>}</li>
			</ul>
		);
	}
});
