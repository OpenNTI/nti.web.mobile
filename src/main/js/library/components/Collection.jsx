'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');

var Package = require('./Package');
var Bundle = require('./Bundle');
var Course = require('./Course');

var Filter = require('common/components/CollectionFilter');

var ListView = React.createClass({
	mixins: [OwnerQuery],

	render: function() {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		return (
			<div>
				<div className="grid-container">
					{this.props.omittitle ? null : <h2>{this.props.title}</h2>}
					<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{this.props.list.map(function(item) {
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

	render: function() {
		return (
			<Filter {...this.props}>
				<ListView title={this.props.title} basePath={this.props.basePath} />
			</Filter>
		);
	}
});
