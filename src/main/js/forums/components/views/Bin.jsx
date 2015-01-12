/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var CollectionFilter = require('common/components/CollectionFilter');
var NTIID = require('dataserverinterface/utils/ntiids');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TabBar = require('../GroupsTabBar');
var Board = require('./Board');
var Forum = require('./Forum');
var tt = require('common/locale').scoped('FORUMS.groupTitles');

var Bin = React.createClass({

	mixins: [NavigatableMixin],

	componentDidMount: function() {
		this.__getContext();
	},

	_filters: function(bin) {
		var filters = [];
		Object.keys(bin).forEach(boardName => {
			var board = bin[boardName];
			var path = NTIID.encodeForURI(board.id);
			filters.push({
				name: tt(boardName, {fallback: boardName}),
				path: path,
				filter: function(item) {
					return (item||{}).ContainerId === board.id;
				}
			});
		});
		return filters;
	},

	_forumList: function(bin) {
		var forums = [];
		Object.keys(bin).forEach(boardName => {
			// forums.push(...bin[boardName]);
			Array.prototype.push.apply(forums, bin[boardName].forums);
		});
		return forums;
	},

	__getContext: function() {
		var {binName} = this.props;
		var href = this.makeHref('/' + binName + '/', false);
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider();
		return getContextProvider().then(context => {
			context.push({
				label: binName,
				href: href
			});
			return context;
		});
	},

	render: function() {

		var {discussions, binName} = this.props;
		var bin = discussions[binName];
		var forums = this._forumList(bin);
		var filters = this._filters(bin);

		var content;

		if (!this.props.forumId) {
			content = (
			<CollectionFilter
				list={forums}
				filters={filters}
				childHandler={Forum}
				childPropName='forumId'
				contextProvider={this.__getContext}>
				<Board contextProvider={this.__getContext} />
			</CollectionFilter>	);
		}

		return (
			<div>
				<TabBar groups={discussions} />
				{content}
			</div>
		);
	}

});

module.exports = Bin;
