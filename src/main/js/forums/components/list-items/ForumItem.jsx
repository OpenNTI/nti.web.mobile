'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.FORUM
		]
	},

	getInitialState() {
		return {
			loading: false
		};
	},


	_href: function() {
		var path = [NTIID.encodeForURI(this.props.item.getID()), ''];
		if (this.props.parentPath) {
			path.unshift(this.props.parentPath);
		}
		return path.join('/');
	},

	render: function() {

		if (this.state.loading) {
			return <LoadingInline />;
		}
		var {item} = this.props;
		return (
			<div className="forum-item">
				<h3><a href={this._href()}>{item.title}</a></h3>

			</div>
		);
	}
});
