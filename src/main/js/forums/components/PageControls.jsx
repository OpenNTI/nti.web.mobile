import React from 'react';
import {Link} from 'react-router-component';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

const goToPage = 'PageControls:goToPage';

export default React.createClass({
	displayName: 'PageControls',

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

	[goToPage]() {
		let page = this.refs.pageselect.getDOMNode().value;
		this.navigate('/?p=' + page);
	},

	render () {

		let {paging} = this.props;
		let current = paging.currentPage();
		let next = current + 1;
		let prev = current - 1;
		let options = [];
		for(let i = 1; i <= paging.numPages; i++) {
			options.push(<option key={'option' + i} value={i}>{i}</option>);
		}

		return (
			<ul className="page-controls">
				<li className="item previous">{paging.hasPrevious && <Link className="link" href={'/?p=' + prev}>Previous</Link>}</li>
				<li className="item current">
					<select defaultValue={current}
						ref="pageselect"
						onChange={this[goToPage]}
						className="page-select">
							{options}
						</select>
					of {paging.numPages}
				</li>
				<li className="item next">{paging.hasNext && <Link className="link" href={'/?p=' + next}>Next</Link>}</li>
			</ul>
		);
	}
});
