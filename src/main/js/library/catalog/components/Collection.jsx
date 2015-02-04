import React from 'react/addons';

import OwnerQuery from 'common/mixins/OwnerQuery';
import Filter from 'common/components/CollectionFilter';

import Item from './Entry';

const filters = [
	{
		name: 'Upcoming',
		path: 'upcoming',
		filter: item => {
			var startDate = item.getStartDate();
			return startDate > Date.now();
		}
	},
	{
		name: 'Current',
		path: 'current',
		filter: item => {
			var startDate = item.getStartDate();
			var endDate = item.getEndDate();
			var now = Date.now();

			return startDate < now && endDate > now;}
	},
	{
		name: 'Archived',
		path: 'archived',
		filter: item => {
			var endDate = item.getEndDate();
			return endDate < Date.now();
		}
	}
];

const ListView = React.createClass({
	mixins: [OwnerQuery],

	render () {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;

		if (!this.props.list.map) {
			console.warn('this.props.list doesn\'t have a map function? %O', this.props.list);
			return null;
		}


		return (
			<div className="grid-container">
				<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{this.props.list.map(o=><Item key={o.NTIID} item={o}/>)}
				</ul>
			</div>
		);
	}

});


export default React.createClass({
	displayName: 'Catalog:Collection',

	propTypes: {
		title: React.PropTypes.string,

		/**
		 *	An array or object with a filter() method.
		 */
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func //shouldn't this be 'map' ?
			})
		]).isRequired,

		filters: React.PropTypes.object
	},

	render () {
		return (
			<Filter {...this.props} filters={filters}>
				<ListView title={this.props.title} />
			</Filter>
		);
	}
});
