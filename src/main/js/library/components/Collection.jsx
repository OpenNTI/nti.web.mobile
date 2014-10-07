/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');

var Package = require('./Package');
var Bundle = require('./Bundle');
var Course = require('./Course');


module.exports = React.createClass({
	displayName: 'Collection',
	mixins: [OwnerQuery],

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

	_onFilterClick: function(filterName) {
		this.setState({
			activeFilter: filterName
		});
	},

	componentWillMount: function() {
		if (this.props.filters && Object.keys(this.props.filters).length > 0) {
			this.setState({activeFilter: Object.keys(this.props.filters)[0]});
		}
	},

	filterBar: function() {
		var filterItems = Object.keys(this.props.filters).map(function(key,index,array) {
			var isActive = this.state.activeFilter === key;
			return <dd className={isActive ? 'active' : null}><a href="#" onClick={this._onFilterClick.bind(this,key)}>{key}</a></dd>
		}.bind(this));

		var filterBar = filterItems.length === 0 ? null : (
			<dl className="sub-nav">
				{filterItems}
			</dl>
		);

		return filterBar;
	},

	render: function() {
		var list = this.props.list || [];
		var basePath = this.props.basePath;

		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		var fbar = this.filterBar();

		if (this.state.activeFilter) {
			list = list.filter(this.props.filters[this.state.activeFilter]);
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
