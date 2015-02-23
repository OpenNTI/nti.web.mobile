'use strict';

var React = require('react');
var List = require('../List');
var TopicList = require('../TopicList');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

module.exports = React.createClass({

	mixins: [NavigatableMixin],

	__getContext: function() {
		var entry = {
			label: (this.props.filter||{}).name||'',
			href: this.makeHref(this.getPath())
		};
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		return getContextProvider().then(context => {
			context.push(entry);
			return context;
		});
	},


	_renderList: function() {
		var {list} = this.props;
		if (!Array.isArray(list) || list.length === 0) {
			return <div>No Forums</div>;
		}

		var itemProps = {
			topicsComponent: TopicList // passing in the component to avoid a circular import of List
		};

		return (
			<List container={{Items: list}}
				contextProvider={this.__getContext}
				className="forum-list"
				itemProps={itemProps} />
		);
	},

	render: function() {
		return (
			<nav className="forum">
				<Breadcrumb contextProvider={this.__getContext} />
				<section>
					<h1>Forums</h1>
					{this._renderList()}
				</section>
			</nav>
		);
	}

});
