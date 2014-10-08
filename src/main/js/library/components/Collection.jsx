/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');
var CourseFilters = require('../mixins/CourseFilters');

var Package = require('./Package');
var Bundle = require('./Bundle');
var Course = require('./Course');


module.exports = React.createClass({
	displayName: 'Collection',
	mixins: [OwnerQuery,CourseFilters],

	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.array.isRequired,
		filters: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			activeFilter:null
		};
	},

	render: function() {
		var list = this.props.list || [];
		var basePath = this.props.basePath;

		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		var fbar = this.filterBar();

		if (this.state.activeFilter) {
			list = this.filter(list);
		}

		return (
			<div>
				{fbar}
				<h2>{this.props.title}</h2>
				<div className="grid-container">
					<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{list.map(function(o) {
						var Item = o.isBundle ?
							Bundle :
							o.isCourse ?
								Course :
								Package;

						return <Item key={o.NTIID} item={o} basePath={basePath}/>;
					})}
					</ul>
				</div>
			</div>
			
		);
	}
});
