/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');

var Package = require('./Package');
var Bundle = require('./Bundle');
var Course = require('./Course');

var Filter = require('./CollectionFilter');
var filters = require('../CourseFilters');

var ListView = React.createClass({
	mixins: [OwnerQuery],

	render: function() {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		return (
			<div>
				<h2>{this.props.title}</h2>
				<div className="grid-container">
					<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{this.props.list.map(function(item,index,arr) {
						var basePath = this.props.basePath;
						var Item = item.isBundle ?
								Bundle :
								item.isCourse ?
									Course :
									Package;

						return <Item key={item.NTIID} item={item} basePath={basePath}/>;
					}.bind(this))}
					</ul>
				</div>
			</div>
		);
	}

});

module.exports = React.createClass({
	displayName: 'Collection',
	
	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.array.isRequired,
		filters: React.PropTypes.object
	},

	render: function() {
		return (
			<div>
				<Filter filters={filters} list={this.props.list}>
					<ListView title={this.props.title} basePath={this.props.basePath} />
				</Filter>
			</div>
		);
	}
});
