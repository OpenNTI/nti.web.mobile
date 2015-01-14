/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicList = require('../TopicList');
var _t = require('common/locale').scoped('FORUMS');

var Topics = React.createClass({

	mixins: [NavigatableMixin],

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		return getContextProvider().then(context => {
			return context;
		});
	},

	render: function() {
		var label = _t('topicLabel');

		return (
			<div>
				<Breadcrumb contextProvider={this.__getContext} />
				<section>
					<h1>{label}</h1>
					<TopicList {...this.props} />
				</section>
			</div>
		);
	}

});

module.exports = Topics;
