import React from 'react';
import OwnerQuery from 'common/mixins/OwnerQuery';

import Package from './Package';
import Bundle from './Bundle';
import Course from './Course';

import Filter from 'common/components/CollectionFilter';

var ListView = React.createClass({
	mixins: [OwnerQuery],

	render () {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		return (
			<div>
				<div className="grid-container">
					{this.props.omittitle ? null : <h2>{this.props.title}</h2>}
					<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{this.props.list.map(item => {
						var Item = item.isBundle ?
								Bundle :
								item.isCourse ?
									Course :
									Package;

						return <Item key={item.NTIID || item.href} item={item}/>;
					})}
					</ul>
				</div>
			</div>
		);
	}

});


export default React.createClass({
	displayName: 'Library:Collection',

	propTypes: {
		title: React.PropTypes.string,

		/**
		 *	An array or object with a filter() method.
		 */
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func
			})
		]),

		filters: React.PropTypes.array
	},

	render () {
		return (
			<Filter {...this.props}>
				<ListView title={this.props.title} />
			</Filter>
		);
	}
});
